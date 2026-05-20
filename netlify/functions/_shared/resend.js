'use strict';

const { log } = require('./log');

function normalizeFrom(from) {
  if (!from) return from;
  const trimmed = String(from).trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

async function sendTransactionalEmail({ to, subject, text }) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = normalizeFrom(process.env.RESEND_FROM);
  if (!apiKey || !from || !to) {
    return { ok: false, skipped: true, reason: 'missing_resend_config_or_to' };
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      text
    })
  });

  let body = '';
  try {
    body = await res.text();
  } catch {
    body = '';
  }

  if (!res.ok) {
    log('resend', 'error', {
      status: 'send_failed',
      httpStatus: res.status,
      to,
      snippet: String(body).slice(0, 200)
    });
    return { ok: false, skipped: false, status: res.status, body };
  }
  log('resend', 'info', { status: 'sent', to });
  return { ok: true, skipped: false, body };
}

module.exports = { sendTransactionalEmail, normalizeFrom };
