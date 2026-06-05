'use strict';

function getTimeoutMs() {
  const minutes = Number(process.env.ORDER_PENDING_TIMEOUT_MINUTES || 10);
  if (!Number.isFinite(minutes) || minutes <= 0) return 10 * 60 * 1000;
  return Math.floor(minutes * 60 * 1000);
}

module.exports = { getTimeoutMs };
