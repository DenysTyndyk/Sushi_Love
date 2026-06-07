'use strict';

const { loadLocalEnv } = require('./_shared/loadEnv');
loadLocalEnv();

const { validateOrderPayload } = require('./_shared/orderValidation');
const { log } = require('./_shared/log');
const { buildOrderTelegramMessage, sendOrderMessage } = require('./_shared/orderTelegram');

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

    log('create-order', 'info', {
      correlationId,
      status: 'telegram_sent',
      messageId: tg.messageId ?? null
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true })
    };
  } catch (err) {
    log('create-order', 'error', {
      correlationId,
      status: 'exception',
      detail: String(err?.message || err).slice(0, 200)
    });
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
