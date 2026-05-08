const telegramApiBase = process.env.TELEGRAM_API_BASE || 'https://api.telegram.org';

const {
  LABEL_EMAIL,
  LABEL_NAME,
  MARKER_WAIT_ETA,
  MARKER_CONFIRMED,
  MARKER_REJECTED,
  extractLineValue
} = require('./constants');

const { sendTransactionalEmail } = require('./resendEmail');

const TG_TEXT_LIMIT = 4096;

async function tgApi(token, method, body) {
  return fetch(`${telegramApiBase}/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
}

async function readJsonResponse(res) {
  try {
    return await res.json();
  } catch {
    return {};
  }
}

/** Додає суфікс так, щоб повний текст не перевищив ліміт Telegram (інакше editMessageText падає). */
function appendWithinTelegramLimit(base, suffix) {
  const b = String(base || '');
  const s = String(suffix || '');
  if (b.length + s.length <= TG_TEXT_LIMIT) {
    return b + s;
  }
  const headroom = TG_TEXT_LIMIT - s.length - 30;
  if (headroom < 80) {
    return `${b.slice(0, TG_TEXT_LIMIT - 40)}…`;
  }
  return `${b.slice(0, headroom)}\n…\n${s}`.slice(0, TG_TEXT_LIMIT);
}

function getHeader(headers, name) {
  if (!headers) return '';
  const lower = name.toLowerCase();
  const key = Object.keys(headers).find((k) => k.toLowerCase() === lower);
  return key ? String(headers[key]) : '';
}

function parseEtaMinutes(data) {
  if (data === 'eta_20') return 20;
  if (data === 'eta_30') return 30;
  if (data === 'eta_45') return 45;
  return null;
}

function extractOrderSummary(text) {
  const lines = String(text || '').split('\n');
  const cartStart = lines.findIndex((line) => line.trim() === '🛒 Koszyk:');
  if (cartStart === -1) return '';
  const totalIndex = lines.findIndex((line, idx) => idx > cartStart && line.startsWith('💰 Razem:'));
  const itemLines = lines
    .slice(cartStart + 1, totalIndex === -1 ? undefined : totalIndex)
    .map((l) => l.trim())
    .filter(Boolean);
  const totalLine = totalIndex !== -1 ? lines[totalIndex].trim() : '';
  if (!itemLines.length && !totalLine) return '';
  return [...itemLines, totalLine].filter(Boolean).join('\n');
}

function buildCustomerEmail({ name, minutes, orderSummary }) {
  const n = name || 'Клієнте';
  const orderBlock = orderSummary
    ? `\n\nTwoje zamówienie:\n${orderSummary}\n\n---\n\nВаше замовлення:\n${orderSummary}\n`
    : '';
  return (
    `Witaj / Вітаємо, ${n}!\n\n` +
    `Twoje zamówienie zostało potwierdzone przez restaurację Sushi Love.\n` +
    `Szacowany czas dostawy: ok. ${minutes} min.` +
    orderBlock +
    `\n` +
    `---\n` +
    `Ваше замовлення підтверджено рестораном Sushi Love.\n` +
    `Орієнтовний час доставки: ~${minutes} хв.\n\n` +
    `Dziękujemy! / Дякуємо!`
  );
}

function buildCustomerRejectionEmail({ name }) {
  const n = name || 'Клієнте';
  return (
    `Witaj / Вітаємо, ${n}!\n\n` +
    `Niestety nie możemy zrealizować tego zamówienia w restauracji Sushi Love.\n` +
    `Zamówienie nie zostanie przygotowane ani dostarczone. Przepraszamy za utrudnienia.\n` +
    `W razie pytań skontaktuj się z nami telefonicznie lub przez stronę.\n\n` +
    `---\n` +
    `На жаль, ресторан Sushi Love не зможе виконати це замовлення.\n` +
    `Замовлення не буде приготоване й не буде доставлене. Приносимо вибачення за незручності.\n` +
    `За потреби зв’яжіться з нами за телефоном або через сайт.\n\n` +
    `Zespół Sushi Love / Команда Sushi Love`
  );
}

exports.handler = async (event) => {
  if (event.httpMethod === 'GET' || event.httpMethod === 'HEAD') {
    return { statusCode: 200, body: 'ok' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET;

  if (!token) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server configuration error' })
    };
  }

  if (webhookSecret) {
    const sent = getHeader(event.headers, 'x-telegram-bot-api-secret-token');
    if (sent !== webhookSecret) {
      return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
    }
  }

  let rawBody = event.body || '{}';
  if (event.isBase64Encoded) {
    rawBody = Buffer.from(rawBody, 'base64').toString('utf8');
  }

  let update;
  try {
    update = JSON.parse(rawBody);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const cq = update.callback_query;
  if (!cq) {
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  }

  console.log('[telegram-webhook] callback', {
    data: cq.data,
    fromId: cq.from?.id,
    messageId: cq.message?.message_id,
    chatId: cq.message?.chat?.id
  });

  const adminIdsRaw = process.env.TELEGRAM_ADMIN_IDS;
  if (adminIdsRaw && String(adminIdsRaw).trim()) {
    const allowed = new Set(
      String(adminIdsRaw)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    );
    const uid = String(cq.from?.id ?? '');
    if (!allowed.has(uid)) {
      await tgApi(token, 'answerCallbackQuery', {
        callback_query_id: cq.id,
        text: 'Немає прав для цієї дії.',
        show_alert: true
      });
      return { statusCode: 200, body: JSON.stringify({ ok: true }) };
    }
  }

  const data = cq.data;
  const msg = cq.message;
  if (!msg || msg.chat?.id == null || msg.message_id == null) {
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  }

  const chatId = msg.chat.id;
  const messageId = msg.message_id;
  const text = msg.text || msg.caption || '';
  /** У форумних супергрупах без thread_id editMessageText часто падає. */
  const threadPayload =
    msg.message_thread_id != null ? { message_thread_id: msg.message_thread_id } : {};

  const who =
    cq.from?.first_name ||
    cq.from?.username ||
    (cq.from?.id != null ? String(cq.from.id) : '');

  const isEta = parseEtaMinutes(data) != null;
  const isAccept = data === 'accept';
  const isReject = data === 'reject';

  if (!isAccept && !isReject && !isEta) {
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  }

  if (text.includes(MARKER_CONFIRMED) || text.includes(MARKER_REJECTED)) {
    await tgApi(token, 'answerCallbackQuery', {
      callback_query_id: cq.id,
      text: 'Це замовлення вже оброблено.'
    });
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  }

  if (isEta) {
    if (!text.includes(MARKER_WAIT_ETA)) {
      await tgApi(token, 'answerCallbackQuery', {
        callback_query_id: cq.id,
        text: 'Спочатку натисніть «Прийняти».',
        show_alert: true
      });
      return { statusCode: 200, body: JSON.stringify({ ok: true }) };
    }

    const minutes = parseEtaMinutes(data);
    const emailTo = extractLineValue(text, LABEL_EMAIL);
    const customerName = extractLineValue(text, LABEL_NAME);
    const orderSummary = extractOrderSummary(text);

    if (!emailTo) {
      await tgApi(token, 'answerCallbackQuery', {
        callback_query_id: cq.id,
        text: 'У повідомленні немає email (старе замовлення?).',
        show_alert: true
      });
      return { statusCode: 200, body: JSON.stringify({ ok: true }) };
    }

    const suffix = `\n\n${MARKER_CONFIRMED}. Орієнтовна доставка: ~${minutes} хв.${
      who ? ` (${who})` : ''
    }`;
    const newText = appendWithinTelegramLimit(text, suffix);

    let editRes = await tgApi(token, 'editMessageText', {
      chat_id: chatId,
      message_id: messageId,
      ...threadPayload,
      text: newText,
      reply_markup: { inline_keyboard: [] }
    });
    let editData = await readJsonResponse(editRes);

    if (!editRes.ok) {
      await tgApi(token, 'editMessageReplyMarkup', {
        chat_id: chatId,
        message_id: messageId,
        ...threadPayload,
        reply_markup: { inline_keyboard: [] }
      });
      await tgApi(token, 'answerCallbackQuery', {
        callback_query_id: cq.id,
        text: (editData.description || 'Не вдалося оновити повідомлення').slice(0, 200),
        show_alert: true
      });
      return { statusCode: 200, body: JSON.stringify({ ok: true }) };
    }

    await tgApi(token, 'answerCallbackQuery', { callback_query_id: cq.id });

    const subject =
      process.env.RESEND_SUBJECT_CONFIRMED ||
      'Sushi Love — замовлення підтверджено / zamówienie potwierdzone';

    const mail = await sendTransactionalEmail({
      to: emailTo,
      subject,
      text: buildCustomerEmail({ name: customerName, minutes, orderSummary })
    });

    if (!mail.ok && !mail.skipped) {
      await tgApi(token, 'sendMessage', {
        chat_id: chatId,
        text: `⚠️ Не вдалося надіслати email клієнту (${emailTo}). Перевірте Resend API та RESEND_FROM.`
      });
    }

    if (mail.skipped && emailTo) {
      await tgApi(token, 'sendMessage', {
        chat_id: chatId,
        text:
          '⚠️ Resend не налаштовано (RESEND_API_KEY / RESEND_FROM). Клієнт не отримав листа.'
      });
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  }

  if (isReject) {
    const emailTo = extractLineValue(text, LABEL_EMAIL);
    const customerName = extractLineValue(text, LABEL_NAME);

    const suffix = `\n\n${MARKER_REJECTED}${who ? ` (${who})` : ''}`;
    const newText = appendWithinTelegramLimit(text, suffix);

    const editRes = await tgApi(token, 'editMessageText', {
      chat_id: chatId,
      message_id: messageId,
      ...threadPayload,
      text: newText,
      reply_markup: { inline_keyboard: [] }
    });
    const editData = await readJsonResponse(editRes);

    if (!editRes.ok) {
      await tgApi(token, 'editMessageReplyMarkup', {
        chat_id: chatId,
        message_id: messageId,
        ...threadPayload,
        reply_markup: { inline_keyboard: [] }
      });
      await tgApi(token, 'answerCallbackQuery', {
        callback_query_id: cq.id,
        text: (editData.description || 'Не вдалося оновити повідомлення').slice(0, 200),
        show_alert: true
      });
      return { statusCode: 200, body: JSON.stringify({ ok: true }) };
    }

    await tgApi(token, 'answerCallbackQuery', { callback_query_id: cq.id });

    if (emailTo) {
      const subject =
        process.env.RESEND_SUBJECT_REJECTED ||
        'Sushi Love — zamówienie anulowane / замовлення не прийнято';

      const mail = await sendTransactionalEmail({
        to: emailTo,
        subject,
        text: buildCustomerRejectionEmail({ name: customerName })
      });

      if (!mail.ok && !mail.skipped) {
        await tgApi(token, 'sendMessage', {
          chat_id: chatId,
          text: `⚠️ Не вдалося надіслати email про відмову клієнту (${emailTo}). Перевірте Resend.`
        });
      }

      if (mail.skipped) {
        await tgApi(token, 'sendMessage', {
          chat_id: chatId,
          text:
            '⚠️ Resend не налаштовано — клієнт не отримав листа про відмову.'
        });
      }
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  }

  if (isAccept) {
    if (text.includes(MARKER_WAIT_ETA)) {
      await tgApi(token, 'answerCallbackQuery', {
        callback_query_id: cq.id,
        text: 'Оберіть час доставки кнопками нижче.',
        show_alert: false
      });
      return { statusCode: 200, body: JSON.stringify({ ok: true }) };
    }

    const waitBlock = `\n\n${MARKER_WAIT_ETA}`;
    const newText = appendWithinTelegramLimit(text, waitBlock);

    const editRes = await tgApi(token, 'editMessageText', {
      chat_id: chatId,
      message_id: messageId,
      ...threadPayload,
      text: newText,
      reply_markup: {
        inline_keyboard: [
          [
            { text: '20 хв', callback_data: 'eta_20' },
            { text: '30 хв', callback_data: 'eta_30' },
            { text: '45 хв', callback_data: 'eta_45' }
          ]
        ]
      }
    });
    const editData = await readJsonResponse(editRes);

    if (!editRes.ok) {
      await tgApi(token, 'answerCallbackQuery', {
        callback_query_id: cq.id,
        text: (editData.description || 'Не вдалося показати вибір часу. Перевірте довжину замовлення або redeploy функції telegram-webhook.').slice(
          0,
          200
        ),
        show_alert: true
      });
      return { statusCode: 200, body: JSON.stringify({ ok: true }) };
    }

    await tgApi(token, 'answerCallbackQuery', { callback_query_id: cq.id });
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  }

  return { statusCode: 200, body: JSON.stringify({ ok: true }) };
};
