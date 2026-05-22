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
    comment,
    extras,
    cart,
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
    messageParts.push(`🏠 Adres: ${address}`);
  }
  const extrasLine = formatExtrasLine(extras, lang);
  if (extrasLine) {
    messageParts.push(extrasLine);
  }
  if (comment.trim()) {
    messageParts.push(`📝 Komentarz: ${comment.trim()}`);
  }

  messageParts.push('', '🛒 Koszyk:', lines, '', `💰 Razem: ${Number(total).toFixed(2)} ${currency}`);

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

  if (!tgResponse.ok) {
    let detail = '';
    try {
      const errJson = await tgResponse.json();
      detail = errJson.description || String(errJson.error_code || '');
    } catch {
      try {
        detail = await tgResponse.text();
      } catch {
        detail = '';
      }
    }
    return { ok: false, detail: detail || 'Telegram API request failed' };
  }

  return { ok: true };
}

module.exports = {
  formatOrderType,
  formatPayment,
  formatTimeLine,
  formatExtrasLine,
  buildOrderTelegramMessage,
  sendOrderMessage
};
