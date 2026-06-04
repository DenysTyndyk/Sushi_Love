'use strict';

const { loadLocalEnv } = require('./loadEnv');
loadLocalEnv();

const STORE_NAME = 'pending-orders';

/** @type {Map<string, object>} */
const memoryStore = new Map();

/** @type {Map<string, NodeJS.Timeout>} */
const memoryTimers = new Map();

function orderKey(chatId, messageId) {
  return `${chatId}:${messageId}`;
}

function getTimeoutMs() {
  const minutes = Number(process.env.ORDER_PENDING_TIMEOUT_MINUTES || 10);
  if (!Number.isFinite(minutes) || minutes <= 0) return 10 * 60 * 1000;
  return Math.floor(minutes * 60 * 1000);
}

function getStore() {
  // Without Blobs context (local functions:serve) use in-memory + setTimeout.
  if (!process.env.NETLIFY_BLOBS_CONTEXT) {
    return null;
  }
  try {
    const { getStore: netlifyGetStore } = require('@netlify/blobs');
    return netlifyGetStore(STORE_NAME);
  } catch {
    return null;
  }
}

function scheduleMemoryExpiry(key, record, onExpire) {
  const existing = memoryTimers.get(key);
  if (existing) clearTimeout(existing);
  const delay = Math.max(0, record.expiresAt - Date.now());
  const timer = setTimeout(() => {
    memoryTimers.delete(key);
    onExpire(record).catch((err) => {
      console.error(
        JSON.stringify({
          component: 'pending-orders',
          level: 'error',
          status: 'memory_expiry_failed',
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
  const store = getStore();
  if (store) {
    await store.setJSON(key, record);
    return;
  }
  memoryStore.set(key, record);
  if (typeof onExpire === 'function') {
    scheduleMemoryExpiry(key, record, async (rec) => {
      const current = memoryStore.get(key);
      if (!current || current.status !== 'pending') return;
      await onExpire(rec);
      memoryStore.delete(key);
    });
  }
}

async function updatePendingOrder(chatId, messageId, patch) {
  const key = orderKey(chatId, messageId);
  const store = getStore();
  if (store) {
    const existing = await store.get(key, { type: 'json' });
    if (!existing) return null;
    const next = { ...existing, ...patch };
    await store.setJSON(key, next);
    return next;
  }
  const existing = memoryStore.get(key);
  if (!existing) return null;
  const next = { ...existing, ...patch };
  memoryStore.set(key, next);
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
  const store = getStore();
  if (store) {
    await store.delete(key);
    return;
  }
  memoryStore.delete(key);
  const timer = memoryTimers.get(key);
  if (timer) {
    clearTimeout(timer);
    memoryTimers.delete(key);
  }
}

async function listExpiredPendingOrders() {
  const now = Date.now();
  const expired = [];
  const store = getStore();
  if (store) {
    const { blobs } = await store.list();
    for (const blob of blobs) {
      const record = await store.get(blob.key, { type: 'json' });
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
  for (const [key, record] of memoryStore.entries()) {
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
  const store = getStore();
  if (store) {
    const fresh = await store.get(key, { type: 'json' });
    if (
      !fresh ||
      fresh.status !== 'pending' ||
      Number(fresh.expiresAt) > Date.now()
    ) {
      return null;
    }
    const claimed = { ...fresh, status: 'expiring' };
    await store.setJSON(key, claimed);
    return claimed;
  }
  const fresh = memoryStore.get(key);
  if (
    !fresh ||
    fresh.status !== 'pending' ||
    Number(fresh.expiresAt) > Date.now()
  ) {
    return null;
  }
  const claimed = { ...fresh, status: 'expiring' };
  memoryStore.set(key, claimed);
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
    chatId,
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
  getTimeoutMs,
  buildPendingRecord,
  savePendingOrder,
  updatePendingOrder,
  removePendingOrder,
  listExpiredPendingOrders,
  claimPendingForExpiry,
  orderKey
};
