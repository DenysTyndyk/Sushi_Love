'use strict';

const { LABEL_EMAIL } = require('../constants');

function formatOrderType(value, lang) {
  if (value === 'pickup') {
    return lang === 'uk' ? 'Самовивіз' : lang === 'en' ? 'Pickup' : 'Odbior osobisty';
  }
  return lang === 'uk' ? 'Доставка' : lang === 'en' ? 'Delivery' : 'Dostawa';
}

function formatPayment(value, lang) {
  if (value === 'card') {
    return lang === 'uk' ? 'Карта' : lang === 'en' ? 'Card' : 'Karta';
  }
  return lang === 'uk' ? 'Готівка' : lang === 'en' ? 'Cash' : 'Gotówka';
}

function formatExtrasLine(extras, lang) {
  if (!extras) return null;
  const labels = {
    extraWasabi:
      lang === 'uk' ? 'васабі' : lang === 'en' ? 'wasabi' : 'wasabi',
    extraChopsticks:
      lang === 'uk' ? 'палички' : lang === 'en' ? 'chopsticks' : 'pałeczki',
    extraSoy:
      lang === 'uk'
        ? 'соєвий соус'
        : lang === 'en'
          ? 'soy sauce'
          : 'sos sojowy',
    extraGinger:
      lang === 'uk' ? 'імбир' : lang === 'en' ? 'ginger' : 'imbir'
  };
  const picked = Object.keys(labels)
    .filter((key) => Number(extras[key]) > 0)
    .map((key) => `${labels[key]} ×${Number(extras[key])}`);
  if (picked.length === 0) return null;
  const title =
    lang === 'uk' ? '🥢 Додатково' : lang === 'en' ? '🥢 Extras' : '🥢 Dodatki';
  return `${title}: ${picked.join(', ')}`;
}

function formatTimeLine(timeMode, preferredTime, lang) {
  if (timeMode === 'scheduled' && String(preferredTime || '').trim()) {
    const t = String(preferredTime).trim();
    return lang === 'uk'
      ? `⏰ Czas: ${t}`
      : lang === 'en'
        ? `⏰ Time: ${t}`
        : `⏰ Godzina: ${t}`;
  }
  if (lang === 'uk') return '⏰ Czas: якомога швидше';
  if (lang === 'en') return '⏰ Time: as soon as possible';
  return '⏰ Czas: jak najszybciej';
}

function buildOrderTelegramMessage(data) {
  const {
    name,
    phone,
    emailTrim,
    orderType,
    paymentMethod,
    timeMode,
    preferredTime,
    lang,
    cashTendered,
    cashChange,
    address,
    streetNumber,
    apartmentNumber,
    comment,
    extras,
    cart,
    subtotal,
    deliveryFee,
    total,
    currency
  } = data;

  const lines = cart
    .map((item) => {
      const lineName = String(item.name || item.id || 'Item');
      const lineQty = Number(item.quantity || 0);
      const linePrice = Number(item.price || 0);
      return `• ${lineName} x${lineQty} = ${(lineQty * linePrice).toFixed(2)} ${currency}`;
    })
    .join('\n');

  const messageParts = [
    '🚀 Nowe zamówienie',
    `👤 Imię: ${name}`,
    `📞 Telefon: ${phone}`,
    `${LABEL_EMAIL} ${emailTrim}`,
    `📦 Typ: ${formatOrderType(orderType, lang)}`,
    `💳 Płatność: ${formatPayment(paymentMethod, lang)}`,
    formatTimeLine(timeMode, preferredTime, lang)
  ];

  if (paymentMethod === 'cash' && cashTendered != null) {
    messageParts.push(
      `💵 Gotówka od klienta: ${cashTendered.toFixed(2)} ${currency} (reszta: ${cashChange.toFixed(2)} ${currency})`
    );
  }

  if (orderType === 'delivery') {
    const fullAddress = [
      address,
      streetNumber ? `nr ${streetNumber}` : '',
      apartmentNumber ? `m. ${apartmentNumber}` : ''
    ]
      .filter(Boolean)
      .join(', ');
    messageParts.push(`🏠 Adres: ${fullAddress}`);
  }
  const extrasLine = formatExtrasLine(extras, lang);
  if (extrasLine) {
    messageParts.push(extrasLine);
  }
  if (comment.trim()) {
    messageParts.push(`📝 Komentarz: ${comment.trim()}`);
  }

  messageParts.push('', '🛒 Koszyk:', lines);

  if (orderType === 'delivery' && Number(deliveryFee) > 0) {
    messageParts.push(`🚚 Dostawa: ${Number(deliveryFee).toFixed(2)} ${currency}`);
  }

  if (subtotal != null && orderType === 'delivery' && Number(deliveryFee) > 0) {
    messageParts.push(`📦 Produkty: ${Number(subtotal).toFixed(2)} ${currency}`);
  }

  messageParts.push('', `💰 Razem: ${Number(total).toFixed(2)} ${currency}`);

  return messageParts.join('\n');
}

async function sendOrderMessage({ token, chatId, messageText }) {
  const telegramApiBase = process.env.TELEGRAM_API_BASE || 'https://api.telegram.org';
  const tgResponse = await fetch(`${telegramApiBase}/bot${token}/sendMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chat_id: String(chatId).trim(),
      text: messageText,
      reply_markup: {
        inline_keyboard: [
          [
            { text: '✅ Прийняти', callback_data: 'accept' },
            { text: '❌ Відхилити', callback_data: 'reject' }
          ]
        ]
      }
    })
  });

  let tgJson = null;
  try {
    tgJson = await tgResponse.json();
  } catch {
    tgJson = null;
  }

  if (!tgResponse.ok) {
    const detail =
      tgJson?.description || String(tgJson?.error_code || '') || 'Telegram API request failed';
    return { ok: false, detail };
  }

  const messageId = tgJson?.result?.message_id ?? null;
  const messageThreadId = tgJson?.result?.message_thread_id ?? null;

  return { ok: true, messageId, messageThreadId };
}

module.exports = {
  formatOrderType,
  formatPayment,
  formatTimeLine,
  formatExtrasLine,
  buildOrderTelegramMessage,
  sendOrderMessage
};
