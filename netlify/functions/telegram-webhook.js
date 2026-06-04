'use strict';

const { loadLocalEnv } = require('./_shared/loadEnv');
loadLocalEnv();

const {
  LABEL_EMAIL,
  LABEL_NAME,
  MARKER_WAIT_ETA,
  MARKER_CONFIRMED,
  MARKER_REJECTED,
  extractLineValue
} = require('./constants');

const {
  tgApi,
  readJsonResponse,
  appendWithinTelegramLimit,
  getHeader,
  parseEtaMinutes
} = require('./_shared/telegram');

const { sendTransactionalEmail } = require('./_shared/resend');
const { log } = require('./_shared/log');
const {
  formatEtaUk,
  formatResendFailure,
  extractOrderSummary,
  buildCustomerEmail
} = require('./_shared/customerEmail');
const {
  updatePendingOrder,
  removePendingOrder
} = require('./_shared/pendingOrders');
const { rejectOrderAndNotifyCustomer } = require('./_shared/orderReject');

exports.handler = async (event) => {
  const { randomUUID } = require('crypto');
  const correlationId = randomUUID();

  if (event.httpMethod === 'GET' || event.httpMethod === 'HEAD') {
    return { statusCode: 200, body: 'ok' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET;

  if (!token) {
    log('telegram-webhook', 'error', {
      correlationId,
      status: 'config_missing'
    });
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server configuration error' })
    };
  }

  if (webhookSecret) {
    const sent = getHeader(event.headers, 'x-telegram-bot-api-secret-token');
    if (sent !== webhookSecret) {
      log('telegram-webhook', 'warn', {
        correlationId,
        status: 'unauthorized_webhook'
      });
      return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
    }
  }

  let rawBody = event.body || '{}';
  if (event.isBase64Encoded) {
    rawBody = Buffer.from(rawBody, 'base64').toString('utf8');
  }

  let update;
  try {
    update = JSON.parse(rawBody);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const cq = update.callback_query;
  if (!cq) {
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  }

  log('telegram-webhook', 'info', {
    correlationId,
    status: 'callback',
    callbackData: cq.data,
    callbackQueryId: cq.id,
    fromId: cq.from?.id,
    messageId: cq.message?.message_id,
    chatId: cq.message?.chat?.id
  });

  const adminIdsRaw = process.env.TELEGRAM_ADMIN_IDS;
  if (adminIdsRaw && String(adminIdsRaw).trim()) {
    const allowed = new Set(
      String(adminIdsRaw)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    );
    const uid = String(cq.from?.id ?? '');
    if (!allowed.has(uid)) {
      await tgApi(token, 'answerCallbackQuery', {
        callback_query_id: cq.id,
        text: 'Немає прав для цієї дії.',
        show_alert: true
      });
      return { statusCode: 200, body: JSON.stringify({ ok: true }) };
    }
  }

  const data = cq.data;
  const msg = cq.message;
  if (!msg || msg.chat?.id == null || msg.message_id == null) {
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  }

  const chatId = msg.chat.id;
  const messageId = msg.message_id;
  const text = msg.text || msg.caption || '';
  const threadPayload =
    msg.message_thread_id != null ? { message_thread_id: msg.message_thread_id } : {};

  const who =
    cq.from?.first_name ||
    cq.from?.username ||
    (cq.from?.id != null ? String(cq.from.id) : '');

  const isEta = parseEtaMinutes(data) != null;
  const isAccept = data === 'accept';
  const isReject = data === 'reject';

  if (!isAccept && !isReject && !isEta) {
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  }

  if (text.includes(MARKER_CONFIRMED) || text.includes(MARKER_REJECTED)) {
    await tgApi(token, 'answerCallbackQuery', {
      callback_query_id: cq.id,
      text: 'Це замовлення вже оброблено.'
    });
    log('telegram-webhook', 'info', {
      correlationId,
      status: 'duplicate_callback_skipped',
      messageId,
      chatId
    });
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  }

  if (isEta) {
    if (!text.includes(MARKER_WAIT_ETA)) {
      await tgApi(token, 'answerCallbackQuery', {
        callback_query_id: cq.id,
        text: 'Спочатку натисніть «Прийняти».',
        show_alert: true
      });
      return { statusCode: 200, body: JSON.stringify({ ok: true }) };
    }

    const minutes = parseEtaMinutes(data);
    const emailTo = extractLineValue(text, LABEL_EMAIL);
    const customerName = extractLineValue(text, LABEL_NAME);
    const orderSummary = extractOrderSummary(text);

    if (!emailTo) {
      await tgApi(token, 'answerCallbackQuery', {
        callback_query_id: cq.id,
        text: 'У повідомленні немає email (старе замовлення?).',
        show_alert: true
      });
      return { statusCode: 200, body: JSON.stringify({ ok: true }) };
    }

    const suffix = `\n\n${MARKER_CONFIRMED}. Орієнтовна доставка: ${formatEtaUk(minutes)}.${
      who ? ` (${who})` : ''
    }`;
    const newText = appendWithinTelegramLimit(text, suffix);

    let editRes = await tgApi(token, 'editMessageText', {
      chat_id: chatId,
      message_id: messageId,
      ...threadPayload,
      text: newText,
      reply_markup: { inline_keyboard: [] }
    });
    let editData = await readJsonResponse(editRes);

    if (!editRes.ok) {
      await tgApi(token, 'editMessageReplyMarkup', {
        chat_id: chatId,
        message_id: messageId,
        ...threadPayload,
        reply_markup: { inline_keyboard: [] }
      });
      await tgApi(token, 'answerCallbackQuery', {
        callback_query_id: cq.id,
        text: (editData.description || 'Не вдалося оновити повідомлення').slice(0, 200),
        show_alert: true
      });
      return { statusCode: 200, body: JSON.stringify({ ok: true }) };
    }

    await tgApi(token, 'answerCallbackQuery', { callback_query_id: cq.id });

    await removePendingOrder(chatId, messageId);

    log('telegram-webhook', 'info', {
      correlationId,
      status: 'order_confirmed',
      messageId,
      chatId,
      minutes,
      callbackQueryId: cq.id
    });

    const subject =
      process.env.RESEND_SUBJECT_CONFIRMED ||
      'Sushi Love — замовлення підтверджено / zamówienie potwierdzone';

    const mail = await sendTransactionalEmail({
      to: emailTo,
      subject,
      text: buildCustomerEmail({ name: customerName, minutes, orderSummary })
    });

    log('telegram-webhook', mail.ok ? 'info' : 'error', {
      correlationId,
      status: mail.skipped ? 'email_skipped' : mail.ok ? 'email_sent' : 'email_failed',
      messageId,
      toDomain: emailTo.split('@')[1] || 'unknown'
    });

    if (!mail.ok && !mail.skipped) {
      await tgApi(token, 'sendMessage', {
        chat_id: chatId,
        text: formatResendFailure(mail, emailTo)
      });
    }

    if (mail.skipped && emailTo) {
      await tgApi(token, 'sendMessage', {
        chat_id: chatId,
        text:
          '⚠️ Resend не налаштовано (RESEND_API_KEY / RESEND_FROM). Клієнт не отримав листа.'
      });
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  }

  if (isReject) {
    const emailTo = extractLineValue(text, LABEL_EMAIL);
    const customerName = extractLineValue(text, LABEL_NAME);

    const result = await rejectOrderAndNotifyCustomer({
      token,
      chatId,
      messageId,
      text,
      messageThreadId: msg.message_thread_id,
      emailTo,
      customerName,
      who,
      correlationId,
      reason: 'manual'
    });

    if (!result.ok && !result.skipped) {
      await tgApi(token, 'answerCallbackQuery', {
        callback_query_id: cq.id,
        text: (result.detail || 'Не вдалося оновити повідомлення').slice(0, 200),
        show_alert: true
      });
      return { statusCode: 200, body: JSON.stringify({ ok: true }) };
    }

    await removePendingOrder(chatId, messageId);
    await tgApi(token, 'answerCallbackQuery', { callback_query_id: cq.id });

    log('telegram-webhook', 'info', {
      correlationId,
      status: 'order_rejected',
      messageId,
      chatId,
      hasEmail: Boolean(emailTo)
    });

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  }

  if (isAccept) {
    if (text.includes(MARKER_WAIT_ETA)) {
      await tgApi(token, 'answerCallbackQuery', {
        callback_query_id: cq.id,
        text: 'Оберіть час доставки кнопками нижче.',
        show_alert: false
      });
      return { statusCode: 200, body: JSON.stringify({ ok: true }) };
    }

    const waitBlock = `\n\n${MARKER_WAIT_ETA}`;
    const newText = appendWithinTelegramLimit(text, waitBlock);

    const editRes = await tgApi(token, 'editMessageText', {
      chat_id: chatId,
      message_id: messageId,
      ...threadPayload,
      text: newText,
      reply_markup: {
        inline_keyboard: [
          [
            { text: '45 хв', callback_data: 'eta_45' },
            { text: '1 год', callback_data: 'eta_60' },
            { text: '1,5 год', callback_data: 'eta_90' }
          ]
        ]
      }
    });
    const editData = await readJsonResponse(editRes);

    if (!editRes.ok) {
      await tgApi(token, 'answerCallbackQuery', {
        callback_query_id: cq.id,
        text: (editData.description || 'Не вдалося показати вибір часу. Перевірте довжину замовлення або redeploy функції telegram-webhook.').slice(
          0,
          200
        ),
        show_alert: true
      });
      return { statusCode: 200, body: JSON.stringify({ ok: true }) };
    }

    await tgApi(token, 'answerCallbackQuery', { callback_query_id: cq.id });

    await updatePendingOrder(chatId, messageId, { status: 'waiting_eta' });

    log('telegram-webhook', 'info', {
      correlationId,
      status: 'accept_eta_prompt_shown',
      messageId,
      chatId
    });

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  }

  return { statusCode: 200, body: JSON.stringify({ ok: true }) };
};
