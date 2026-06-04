'use strict';

const { loadLocalEnv } = require('./_shared/loadEnv');
loadLocalEnv();

const { validateOrderPayload } = require('./_shared/orderValidation');
const { log } = require('./_shared/log');
const { buildOrderTelegramMessage, sendOrderMessage } = require('./_shared/orderTelegram');
const {
  buildPendingRecord,
  savePendingOrder
} = require('./_shared/pendingOrders');
const { expirePendingOrders } = require('./_shared/expirePending');

exports.handler = async (event) => {
  const { randomUUID } = require('crypto');
  const correlationId = randomUUID();

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    log('create-order', 'error', {
      correlationId,
      status: 'config_missing',
      reason: 'telegram_not_configured'
    });
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server configuration error' })
    };
  }

  try {
    const payload = JSON.parse(event.body || '{}');
    const validation = validateOrderPayload(payload);

    if (!validation.ok) {
      log('create-order', 'info', {
        correlationId,
        status: 'validation_failed',
        error: validation.error
      });
      return {
        statusCode: 400,
        body: JSON.stringify({ error: validation.error })
      };
    }

    const messageText = buildOrderTelegramMessage(validation.data);
    log('create-order', 'info', {
      correlationId,
      status: 'validated',
      emailDomain: validation.data.emailTrim.split('@')[1] || 'unknown'
    });

    const tg = await sendOrderMessage({
      token,
      chatId,
      messageText
    });

    if (!tg.ok) {
      log('create-order', 'error', {
        correlationId,
        status: 'telegram_failed',
        detail: String(tg.detail || '').slice(0, 200)
      });
      return {
        statusCode: 502,
        body: JSON.stringify({
          error: 'telegram_failed',
          detail: tg.detail || 'Telegram API request failed'
        })
      };
    }

    if (tg.messageId != null) {
      const pending = buildPendingRecord({
        chatId: String(chatId).trim(),
        messageId: tg.messageId,
        messageThreadId: tg.messageThreadId,
        text: messageText,
        email: validation.data.emailTrim,
        customerName: validation.data.name
      });
      await savePendingOrder(pending, async (record) => {
        await expirePendingOrders();
      });
      log('create-order', 'info', {
        correlationId,
        status: 'pending_registered',
        messageId: tg.messageId,
        expiresAt: pending.expiresAt,
        timeoutMinutes: Math.round((pending.expiresAt - pending.createdAt) / 60000),
        storage: process.env.NETLIFY_BLOBS_CONTEXT ? 'blobs' : 'memory'
      });
    }

    log('create-order', 'info', {
      correlationId,
      status: 'telegram_sent',
      messageId: tg.messageId ?? null
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true })
    };
  } catch {
    log('create-order', 'error', {
      correlationId,
      status: 'exception'
    });
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
