const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function setupProxy(app) {
  app.use(
    '/.netlify/functions',
    createProxyMiddleware({
      target: 'http://127.0.0.1:9999',
      changeOrigin: true
    })
  );
};
