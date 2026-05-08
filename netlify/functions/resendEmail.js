/**
 * Транзакційні листи через Resend
 * https://resend.com/docs/api-reference/emails/send-email
 */
exports.sendTransactionalEmail = async ({ to, subject, text }) => {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
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
    return { ok: false, skipped: false, status: res.status, body };
  }
  return { ok: true, skipped: false, body };
};
