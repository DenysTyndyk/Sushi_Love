'use strict';

const { MARKER_REJECTED } = require('../constants');
const { tgApi, readJsonResponse, appendWithinTelegramLimit } = require('./telegram');
const { sendTransactionalEmail } = require('./resend');
const { log } = require('./log');
const {
  buildCustomerRejectionEmail,
  formatResendFailure
} = require('./customerEmail');

const AUTO_REJECT_WHO = '⏱️ Авто (10 хв без відповіді)';

function buildRejectSuffix(who) {
  return `\n\n${MARKER_REJECTED}${who ? ` (${who})` : ''}`;
}

async function rejectOrderAndNotifyCustomer({
  token,
  chatId,
  messageId,
  text,
  messageThreadId,
  emailTo,
  customerName,
  who = '',
  correlationId = '',
  reason = 'manual'
}) {
  const threadPayload =
    messageThreadId != null ? { message_thread_id: messageThreadId } : {};

  if (String(text || '').includes(MARKER_REJECTED)) {
    return { ok: true, skipped: true, reason: 'already_rejected' };
  }

  const suffix = buildRejectSuffix(who);
  const newText = appendWithinTelegramLimit(text, suffix);

  const editRes = await tgApi(token, 'editMessageText', {
    chat_id: chatId,
    message_id: messageId,
    ...threadPayload,
    text: newText,
    reply_markup: { inline_keyboard: [] }
  });
  const editData = await readJsonResponse(editRes);

  if (!editRes.ok) {
    await tgApi(token, 'editMessageReplyMarkup', {
      chat_id: chatId,
      message_id: messageId,
      ...threadPayload,
      reply_markup: { inline_keyboard: [] }
    });
    return {
      ok: false,
      detail: editData.description || 'Failed to update Telegram message'
    };
  }

  if (emailTo) {
    const subject =
      process.env.RESEND_SUBJECT_REJECTED ||
      'Sushi Love — zamówienie anulowane / замовлення не прийнято';

    const mail = await sendTransactionalEmail({
      to: emailTo,
      subject,
      text: buildCustomerRejectionEmail({ name: customerName })
    });

    log('order-reject', mail.ok ? 'info' : 'error', {
      correlationId,
      status: mail.skipped
        ? 'email_skipped'
        : mail.ok
          ? 'email_sent'
          : 'email_failed',
      messageId,
      chatId,
      reason
    });

    if (!mail.ok && !mail.skipped) {
      await tgApi(token, 'sendMessage', {
        chat_id: chatId,
        text: formatResendFailure(mail, emailTo)
      });
    }

    if (mail.skipped) {
      await tgApi(token, 'sendMessage', {
        chat_id: chatId,
        text:
          '⚠️ Resend не налаштовано — клієнт не отримав листа про відмову.'
      });
    }
  }

  return { ok: true, skipped: false };
}

module.exports = {
  AUTO_REJECT_WHO,
  buildRejectSuffix,
  rejectOrderAndNotifyCustomer
};
