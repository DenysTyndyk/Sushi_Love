'use strict';

const TG_TEXT_LIMIT = 4096;

function telegramApiBase() {
  return process.env.TELEGRAM_API_BASE || 'https://api.telegram.org';
}

async function tgApi(token, method, body) {
  return fetch(`${telegramApiBase()}/bot${token}/${method}`, {
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

function appendWithinTelegramLimit(base, suffix) {
  const b = String(base || '');
  const s = String(suffix || '');
  if (b.length + s.length <= TG_TEXT_LIMIT) {
    return b + s;
  }
  const ellipsis = '\n…';
  const headroom = TG_TEXT_LIMIT - s.length - ellipsis.length;
  if (headroom < 1) {
    return s.slice(0, TG_TEXT_LIMIT);
  }
  const trimmed = b.length > headroom ? `${b.slice(0, headroom)}${ellipsis}` : b;
  return (trimmed + s).slice(0, TG_TEXT_LIMIT);
}

function etaKeyboardMarkup() {
  return {
    inline_keyboard: [
      [
        { text: '45 хв', callback_data: 'eta_45' },
        { text: '1 год', callback_data: 'eta_60' },
        { text: '1,5 год', callback_data: 'eta_90' }
      ]
    ]
  };
}

async function showEtaPrompt({ token, chatId, messageId, text, threadPayload, waitMarker }) {
  const waitBlock = `\n\n${waitMarker}`;
  const newText = appendWithinTelegramLimit(text, waitBlock);
  const keyboard = etaKeyboardMarkup();

  const editRes = await tgApi(token, 'editMessageText', {
    chat_id: chatId,
    message_id: messageId,
    ...threadPayload,
    text: newText,
    reply_markup: keyboard
  });
  const editData = await readJsonResponse(editRes);

  if (editRes.ok) {
    return { ok: true, mode: 'text_and_markup' };
  }

  if (isMessageNotModified(editData.description)) {
    return { ok: true, mode: 'unchanged' };
  }

  const markupRes = await tgApi(token, 'editMessageReplyMarkup', {
    chat_id: chatId,
    message_id: messageId,
    ...threadPayload,
    reply_markup: keyboard
  });
  const markupData = await readJsonResponse(markupRes);

  if (markupRes.ok || isMessageNotModified(markupData.description)) {
    return { ok: true, mode: 'markup_only' };
  }

  return {
    ok: false,
    detail: editData.description || markupData.description || 'Failed to show ETA buttons'
  };
}

function getHeader(headers, name) {
  if (!headers) return '';
  const lower = name.toLowerCase();
  const key = Object.keys(headers).find((k) => k.toLowerCase() === lower);
  return key ? String(headers[key]) : '';
}

function parseEtaMinutes(data) {
  if (data === 'eta_45') return 45;
  if (data === 'eta_60') return 60;
  if (data === 'eta_90') return 90;
  return null;
}

function isMessageNotModified(detail) {
  return String(detail || '').toLowerCase().includes('message is not modified');
}

module.exports = {
  TG_TEXT_LIMIT,
  tgApi,
  readJsonResponse,
  appendWithinTelegramLimit,
  getHeader,
  parseEtaMinutes,
  isMessageNotModified,
  etaKeyboardMarkup,
  showEtaPrompt
};
