'use strict';

const { loadLocalEnv } = require('./_shared/loadEnv');
loadLocalEnv();

const { initPendingContext } = require('./_shared/pendingOrders');
const { expirePendingOrders } = require('./_shared/expirePending');

exports.handler = async (event) => {
  initPendingContext(event);
  const result = await expirePendingOrders();
  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true, ...result })
  };
};
