const { createProxyMiddleware } = require('http-proxy-middleware');

/**
 * Локально: netlify functions:serve слухає порт 9999, CRA — 3000.
 * Запити на /.netlify/functions/* проксуємо на локальний сервер функцій.
 */
module.exports = function setupProxy(app) {
  app.use(
    '/.netlify/functions',
    createProxyMiddleware({
      target: 'http://127.0.0.1:9999',
      changeOrigin: true
    })
  );
};
