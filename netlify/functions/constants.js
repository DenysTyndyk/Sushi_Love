/** Спільні мітки для create-order та telegram-webhook (парсинг повідомлення). */
exports.LABEL_EMAIL = '📧 Email:';
exports.LABEL_NAME = '👤 Imię:';

exports.MARKER_WAIT_ETA = '⏳ ОБЕРІТЬ ЧАС ДОСТАВКИ';
exports.MARKER_CONFIRMED = '✅ ЗАМОВЛЕННЯ ПІДТВЕРДЖЕНО';
exports.MARKER_REJECTED = '❌ ЗАМОВЛЕННЯ ВІДХИЛЕНО';

exports.extractLineValue = (text, labelPrefix) => {
  const lines = String(text || '').split('\n');
  const line = lines.find((l) => l.includes(labelPrefix));
  if (!line) return '';
  const idx = line.indexOf(':');
  if (idx === -1) return '';
  return line.slice(idx + 1).trim();
};
