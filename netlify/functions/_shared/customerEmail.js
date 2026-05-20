'use strict';

function formatEtaPl(minutes) {
  if (minutes === 45) return 'ok. 45 min.';
  if (minutes === 60) return 'ok. 1 godz.';
  if (minutes === 90) return 'ok. 1,5 godz.';
  return `ok. ${minutes} min.`;
}

function formatEtaUk(minutes) {
  if (minutes === 45) return '~45 хв';
  if (minutes === 60) return '~1 год';
  if (minutes === 90) return '~1,5 год';
  return `~${minutes} хв`;
}

function formatResendFailure(mail, emailTo) {
  let detail = '';
  if (mail.body) {
    try {
      const parsed = JSON.parse(mail.body);
      detail = parsed.message || parsed.error || mail.body;
    } catch {
      detail = mail.body;
    }
  }
  const status = mail.status != null ? `HTTP ${mail.status}` : '';
  const lines = [
    `⚠️ Не вдалося надіслати email клієнту (${emailTo}).`,
    status,
    detail ? `Resend: ${String(detail).slice(0, 500)}` : 'Перевірте RESEND_API_KEY та RESEND_FROM у Netlify.',
    'FROM має бути на @sushilove-czestochowa.pl (після verify домену).'
  ].filter(Boolean);
  return lines.join('\n');
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
    `Szacowany czas dostawy: ${formatEtaPl(minutes)}` +
    orderBlock +
    `\n` +
    `---\n` +
    `Ваше замовлення підтверджено рестораном Sushi Love.\n` +
    `Орієнтовний час доставки: ${formatEtaUk(minutes)}.\n\n` +
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

module.exports = {
  formatEtaPl,
  formatEtaUk,
  formatResendFailure,
  extractOrderSummary,
  buildCustomerEmail,
  buildCustomerRejectionEmail
};
