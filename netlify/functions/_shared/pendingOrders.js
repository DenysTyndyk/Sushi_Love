'use strict';

const fs = require('fs');
const path = require('path');
const { loadLocalEnv } = require('./loadEnv');
const { getTimeoutMs } = require('./pendingOrderConfig');
loadLocalEnv();

const STORE_NAME = 'pending-orders';
const LOCAL_STORE_FILE = path.resolve(__dirname, '../../../.data/pending-orders.json');

const memoryTimers = new Map();

let requestEvent = null;
let localExpiryPollerStarted = false;

function shouldUseBlobStore() {
  const ctx = String(process.env.CONTEXT || '').trim();
  return ctx === 'production' || ctx === 'deploy-preview' || ctx === 'branch-deploy';
}

function shouldUseFileStore() {
  return !shouldUseBlobStore();
}

function orderKey(chatId, messageId) {
  return `${String(chatId)}:${String(messageId)}`;
}

function initPendingContext(event) {
  requestEvent = event || null;
  if (!requestEvent) return;

  try {
    const { connectLambda } = require('@netlify/blobs');
    if (typeof connectLambda === 'function') {
      connectLambda(requestEvent);
    }
  } catch {
  }
}

function getBlobStore() {
  if (!shouldUseBlobStore()) {
    return null;
  }

  try {
    const { getStore } = require('@netlify/blobs');
    return getStore(STORE_NAME);
  } catch (err) {
    console.error(
      JSON.stringify({
        component: 'pending-orders',
        level: 'error',
        status: 'blob_store_unavailable',
        detail: String(err?.message || err).slice(0, 200)
      })
    );
    return null;
  }
}

function startLocalExpiryPoller() {
  if (!shouldUseFileStore() || localExpiryPollerStarted) return;
  localExpiryPollerStarted = true;

  const pollMs = Number(process.env.ORDER_PENDING_POLL_MS || 30_000);
  const safePollMs =
    Number.isFinite(pollMs) && pollMs >= 10_000 ? pollMs : 30_000;

  const runPoll = () => {
    const store = readFileStore();
    const hasPending = Object.values(store).some((row) => row?.status === 'pending');
    if (!hasPending) return;

    try {
      const { expirePendingOrders } = require('./expirePending');
      expirePendingOrders().catch((err) => {
        console.error(
          JSON.stringify({
            component: 'pending-orders',
            level: 'error',
            status: 'local_poll_failed',
            detail: String(err?.message || err).slice(0, 200)
          })
        );
      });
    } catch (err) {
      console.error(
        JSON.stringify({
          component: 'pending-orders',
          level: 'error',
          status: 'local_poll_load_failed',
          detail: String(err?.message || err).slice(0, 200)
        })
      );
    }
  };

  runPoll();
  setInterval(runPoll, safePollMs);

  console.info(
    JSON.stringify({
      component: 'pending-orders',
      level: 'info',
      status: 'local_expiry_poller_started',
      pollMs: safePollMs
    })
  );
}

function readFileStore() {
  try {
    if (!fs.existsSync(LOCAL_STORE_FILE)) return {};
    const raw = fs.readFileSync(LOCAL_STORE_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeFileStore(data) {
  const dir = path.dirname(LOCAL_STORE_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(LOCAL_STORE_FILE, JSON.stringify(data, null, 2));
}

function scheduleFileExpiry(key, record, onExpire) {
  const existing = memoryTimers.get(key);
  if (existing) clearTimeout(existing);

  const delay = Math.max(0, Number(record.expiresAt) - Date.now());
  const timer = setTimeout(() => {
    memoryTimers.delete(key);
    const store = readFileStore();
    const current = store[key];
    if (!current || current.status !== 'pending') return;

    onExpire(current)
      .then(() => {
        const fresh = readFileStore();
        delete fresh[key];
        writeFileStore(fresh);
      })
      .catch((err) => {
        console.error(
          JSON.stringify({
            component: 'pending-orders',
            level: 'error',
            status: 'file_expiry_failed',
            key,
            detail: String(err?.message || err).slice(0, 200)
          })
        );
      });
  }, delay);

  memoryTimers.set(key, timer);
}

async function savePendingOrder(record, onExpire) {
  const key = orderKey(record.chatId, record.messageId);
  const blobStore = getBlobStore();

  if (blobStore) {
    await blobStore.setJSON(key, record);
    return 'blobs';
  }

  const fileStore = readFileStore();
  fileStore[key] = record;
  writeFileStore(fileStore);

  if (typeof onExpire === 'function') {
    scheduleFileExpiry(key, record, onExpire);
  }

  startLocalExpiryPoller();

  return 'file';
}

async function updatePendingOrder(chatId, messageId, patch) {
  const key = orderKey(chatId, messageId);
  const blobStore = getBlobStore();

  if (blobStore) {
    const existing = await blobStore.get(key, { type: 'json' });
    if (!existing) return null;
    const next = { ...existing, ...patch };
    await blobStore.setJSON(key, next);
    return next;
  }

  const fileStore = readFileStore();
  const existing = fileStore[key];
  if (!existing) return null;
  const next = { ...existing, ...patch };
  fileStore[key] = next;
  writeFileStore(fileStore);

  if (patch.status && patch.status !== 'pending') {
    const timer = memoryTimers.get(key);
    if (timer) {
      clearTimeout(timer);
      memoryTimers.delete(key);
    }
  }

  return next;
}

async function removePendingOrder(chatId, messageId) {
  const key = orderKey(chatId, messageId);
  const blobStore = getBlobStore();

  if (blobStore) {
    await blobStore.delete(key);
    return;
  }

  const fileStore = readFileStore();
  delete fileStore[key];
  writeFileStore(fileStore);

  const timer = memoryTimers.get(key);
  if (timer) {
    clearTimeout(timer);
    memoryTimers.delete(key);
  }
}

async function listExpiredPendingOrders() {
  const now = Date.now();
  const expired = [];
  const blobStore = getBlobStore();

  if (blobStore) {
    const { blobs } = await blobStore.list();
    for (const blob of blobs) {
      const record = await blobStore.get(blob.key, { type: 'json' });
      if (
        record &&
        record.status === 'pending' &&
        Number(record.expiresAt) <= now
      ) {
        expired.push({ key: blob.key, record });
      }
    }
    return expired;
  }

  const fileStore = readFileStore();
  for (const [key, record] of Object.entries(fileStore)) {
    if (record.status === 'pending' && Number(record.expiresAt) <= now) {
      expired.push({ key, record });
    }
  }
  return expired;
}

async function claimPendingForExpiry(key, record) {
  if (record.status !== 'pending' || Number(record.expiresAt) > Date.now()) {
    return null;
  }

  const blobStore = getBlobStore();
  if (blobStore) {
    const fresh = await blobStore.get(key, { type: 'json' });
    if (
      !fresh ||
      fresh.status !== 'pending' ||
      Number(fresh.expiresAt) > Date.now()
    ) {
      return null;
    }
    const claimed = { ...fresh, status: 'expiring' };
    await blobStore.setJSON(key, claimed);
    return claimed;
  }

  const fileStore = readFileStore();
  const fresh = fileStore[key];
  if (
    !fresh ||
    fresh.status !== 'pending' ||
    Number(fresh.expiresAt) > Date.now()
  ) {
    return null;
  }

  const claimed = { ...fresh, status: 'expiring' };
  fileStore[key] = claimed;
  writeFileStore(fileStore);

  const timer = memoryTimers.get(key);
  if (timer) {
    clearTimeout(timer);
    memoryTimers.delete(key);
  }

  return claimed;
}

function buildPendingRecord({
  chatId,
  messageId,
  messageThreadId,
  text,
  email,
  customerName
}) {
  const createdAt = Date.now();
  const timeoutMs = getTimeoutMs();
  return {
    chatId: String(chatId),
    messageId,
    messageThreadId: messageThreadId ?? null,
    text,
    email: email || '',
    customerName: customerName || '',
    createdAt,
    expiresAt: createdAt + timeoutMs,
    status: 'pending'
  };
}

module.exports = {
  initPendingContext,
  getTimeoutMs,
  buildPendingRecord,
  savePendingOrder,
  updatePendingOrder,
  removePendingOrder,
  listExpiredPendingOrders,
  claimPendingForExpiry,
  orderKey,
  startLocalExpiryPoller
};
