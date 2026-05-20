'use strict';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateOrderPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return { ok: false, error: 'Invalid order payload' };
  }

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
    return { ok: false, error: 'Privacy consent required' };
  }

  const emailTrim = String(email || '').trim().toLowerCase();
  if (!emailTrim || !EMAIL_RE.test(emailTrim)) {
    return { ok: false, error: 'Valid email is required' };
  }

  if (!String(name).trim() || !String(phone).trim() || !Array.isArray(cart) || cart.length === 0) {
    return { ok: false, error: 'Invalid order payload' };
  }

  if (orderType === 'delivery' && !String(address || '').trim()) {
    return { ok: false, error: 'Address is required for delivery' };
  }

  if (timeMode === 'scheduled' && !String(preferredTime || '').trim()) {
    return { ok: false, error: 'Time is required when scheduling' };
  }

  const orderTotal = Number(total);
  let cashTendered = null;
  let cashChange = null;

  if (paymentMethod === 'cash') {
    const rawCash = String(cashAmount ?? '').trim().replace(',', '.');
    if (!rawCash) {
      return { ok: false, error: 'Cash amount required' };
    }
    cashTendered = Number(rawCash);
    if (!Number.isFinite(cashTendered) || cashTendered <= 0) {
      return { ok: false, error: 'Cash amount required' };
    }
    if (cashTendered < orderTotal - 0.001) {
      return { ok: false, error: 'Cash amount must cover order total' };
    }
    cashChange = Math.round((cashTendered - orderTotal) * 100) / 100;
  }

  return {
    ok: true,
    data: {
      name: String(name).trim(),
      phone: String(phone).trim(),
      emailTrim,
      orderType,
      paymentMethod,
      timeMode,
      address: String(address || '').trim(),
      preferredTime,
      comment: String(comment || '').trim(),
      lang,
      cart,
      total: orderTotal,
      currency,
      cashTendered,
      cashChange
    }
  };
}

module.exports = { validateOrderPayload, EMAIL_RE };
