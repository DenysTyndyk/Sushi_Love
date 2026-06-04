'use strict';

const { loadLocalEnv } = require('./_shared/loadEnv');
loadLocalEnv();

const { expirePendingOrders } = require('./_shared/expirePending');

/** Netlify scheduled function: auto-reject orders with no admin action within timeout. */
exports.handler = async () => {
  const result = await expirePendingOrders();
  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true, ...result })
  };
};
