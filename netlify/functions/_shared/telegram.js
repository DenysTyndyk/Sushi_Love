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
  if (data === 'eta_45') return 45;
  if (data === 'eta_60') return 60;
  if (data === 'eta_90') return 90;
  return null;
}

module.exports = {
  TG_TEXT_LIMIT,
  tgApi,
  readJsonResponse,
  appendWithinTelegramLimit,
  getHeader,
  parseEtaMinutes
};
