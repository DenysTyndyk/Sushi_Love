exports.LABEL_EMAIL = '📧 Email:';
exports.LABEL_NAME = '👤 Imię:';
exports.LABEL_ORDER_TYPE = '📦 Typ:';

exports.MARKER_WAIT_ETA_DELIVERY = '⏳ ОБЕРІТЬ ЧАС ДОСТАВКИ';
exports.MARKER_WAIT_ETA_PICKUP = '⏳ ОБЕРІТЬ ЧАС САМОВИВОЗУ';
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

exports.extractOrderType = (text) => {
  const typ = exports.extractLineValue(text, exports.LABEL_ORDER_TYPE);
  if (!typ) return 'delivery';
  const lower = typ.toLowerCase();
  if (
    lower.includes('odbior') ||
    lower.includes('pickup') ||
    lower.includes('самовивіз')
  ) {
    return 'pickup';
  }
  return 'delivery';
};

exports.waitEtaMarker = (orderType) =>
  orderType === 'pickup'
    ? exports.MARKER_WAIT_ETA_PICKUP
    : exports.MARKER_WAIT_ETA_DELIVERY;

exports.isWaitingForEta = (text) =>
  String(text || '').includes(exports.MARKER_WAIT_ETA_DELIVERY) ||
  String(text || '').includes(exports.MARKER_WAIT_ETA_PICKUP);

exports.extractScheduledWhen = (text) => {
  const lines = String(text || '').split('\n');
  const line = lines.find(
    (l) =>
      l.includes('⏰ Termin:') ||
      (l.includes('⏰ Time:') && /\d{2}\.\d{2}\.\d{4}/.test(l)) ||
      (l.includes('⏰ Час:') && /\d{2}\.\d{2}\.\d{4}/.test(l))
  );
  if (!line) return '';
  const idx = line.indexOf(':');
  if (idx === -1) return '';
  return line.slice(idx + 1).trim();
};

exports.isScheduledOrder = (text) => Boolean(exports.extractScheduledWhen(text));
