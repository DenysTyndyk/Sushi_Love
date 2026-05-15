const { LABEL_EMAIL } = require('./constants');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const formatOrderType = (value, lang) => {
  if (value === 'pickup') {
    return lang === 'uk' ? 'Самовивіз' : lang === 'en' ? 'Pickup' : 'Odbior osobisty';
  }
  return lang === 'uk' ? 'Доставка' : lang === 'en' ? 'Delivery' : 'Dostawa';
};

const formatPayment = (value, lang) => {
  if (value === 'card') {
    return lang === 'uk' ? 'Карта' : lang === 'en' ? 'Card' : 'Karta';
  }
  return lang === 'uk' ? 'Готівка' : lang === 'en' ? 'Cash' : 'Gotówka';
};

const formatTimeLine = (timeMode, preferredTime, lang) => {
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
};

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const telegramApiBase = process.env.TELEGRAM_API_BASE || 'https://api.telegram.org';

  if (!token || !chatId) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server configuration error' })
    };
  }

  try {
    const payload = JSON.parse(event.body || '{}');
    const {
      name = '',
      phone = '',
      email = '',
      privacyAccepted,
      orderType = 'delivery',
      paymentMethod = 'cash',
      timeMode = 'asap',
      address = '',
      preferredTime = '',
      comment = '',
      cashAmount,
      lang = 'pl',
      cart = [],
      total = 0,
      currency = 'PLN'
    } = payload;

    if (!privacyAccepted) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Privacy consent required' })
      };
    }

    const emailTrim = String(email || '').trim().toLowerCase();
    if (!emailTrim || !EMAIL_RE.test(emailTrim)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Valid email is required' })
      };
    }

    if (!name.trim() || !phone.trim() || !Array.isArray(cart) || cart.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid order payload' })
      };
    }

    if (orderType === 'delivery' && !address.trim()) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Address is required for delivery' })
      };
    }

    if (timeMode === 'scheduled' && !String(preferredTime || '').trim()) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Time is required when scheduling' })
      };
    }

    const orderTotal = Number(total);
    let cashTendered = null;
    let cashChange = null;

    if (paymentMethod === 'cash') {
      const rawCash = String(cashAmount ?? '').trim().replace(',', '.');
      if (!rawCash) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Cash amount required' })
        };
      }
      cashTendered = Number(rawCash);
      if (!Number.isFinite(cashTendered) || cashTendered <= 0) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Cash amount required' })
        };
      }
      if (cashTendered < orderTotal - 0.001) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Cash amount must cover order total' })
        };
      }
      cashChange = Math.round((cashTendered - orderTotal) * 100) / 100;
    }

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
      `👤 Imię: ${name.trim()}`,
      `📞 Telefon: ${phone.trim()}`,
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
      messageParts.push(`🏠 Adres: ${address.trim()}`);
    }
    if (comment.trim()) {
      messageParts.push(`📝 Komentarz: ${comment.trim()}`);
    }

    messageParts.push(
      '',
      '🛒 Koszyk:',
      lines,
      '',
      `💰 Razem: ${Number(total).toFixed(2)} ${currency}`
    );

    const messageText = messageParts.join('\n');

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
      return {
        statusCode: 502,
        body: JSON.stringify({
          error: 'telegram_failed',
          detail: detail || 'Telegram API request failed'
        })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
