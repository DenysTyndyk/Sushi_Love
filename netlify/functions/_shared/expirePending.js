'use strict';

const { randomUUID } = require('crypto');
const { log } = require('./log');
const {
  getAutoRejectWho,
  rejectOrderAndNotifyCustomer
} = require('./orderReject');

async function expirePendingOrders() {
  const {
    listExpiredPendingOrders,
    claimPendingForExpiry,
    removePendingOrder,
    orderKey
  } = require('./pendingOrders');

  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    log('expire-pending', 'error', { status: 'config_missing' });
    return { processed: 0, error: 'missing_token' };
  }

  const correlationId = randomUUID();
  const expired = await listExpiredPendingOrders();
  let processed = 0;

  for (const { key, record } of expired) {
    const claimKey = key || orderKey(record.chatId, record.messageId);
    const claimed = await claimPendingForExpiry(claimKey, record);
    if (!claimed) continue;

    const result = await rejectOrderAndNotifyCustomer({
      token,
      chatId: claimed.chatId,
      messageId: claimed.messageId,
      text: claimed.text,
      messageThreadId: claimed.messageThreadId,
      emailTo: claimed.email,
      customerName: claimed.customerName,
      who: getAutoRejectWho(),
      correlationId,
      reason: 'auto_timeout'
    });

    await removePendingOrder(claimed.chatId, claimed.messageId);

    if (result.ok) {
      processed += 1;
      log('expire-pending', 'info', {
        correlationId,
        status: result.skipped ? 'already_rejected' : 'order_auto_rejected',
        messageId: claimed.messageId,
        chatId: claimed.chatId
      });
    } else {
      log('expire-pending', 'error', {
        correlationId,
        status: 'auto_reject_failed',
        messageId: claimed.messageId,
        detail: String(result.detail || '').slice(0, 200)
      });
    }
  }

  return { processed, checked: expired.length };
}

module.exports = { expirePendingOrders };
