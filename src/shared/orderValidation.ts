import {
  ValidationError,
  type OrderExtras,
  type OrderPayload,
  type ValidationErrorCode,
  type ValidationResult
} from '../types';

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MAX_EXTRA_PORTIONS = 20;

function normalizeExtraQty(value: unknown): number {
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.min(n, MAX_EXTRA_PORTIONS);
}

function normalizeExtras(p: OrderPayload): OrderExtras {
  return {
    extraWasabi: normalizeExtraQty(p.extraWasabi),
    extraChopsticks: normalizeExtraQty(p.extraChopsticks),
    extraSoy: normalizeExtraQty(p.extraSoy),
    extraGinger: normalizeExtraQty(p.extraGinger)
  };
}

export function validateOrderPayload(payload: unknown): ValidationResult {
  if (!payload || typeof payload !== 'object') {
    return { ok: false, error: ValidationError.INVALID_PAYLOAD };
  }

  const p = payload as OrderPayload;

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
  } = p;

  if (!privacyAccepted) {
    return { ok: false, error: ValidationError.PRIVACY };
  }

  const emailTrim = String(email || '')
    .trim()
    .toLowerCase();
  if (!emailTrim || !EMAIL_RE.test(emailTrim)) {
    return { ok: false, error: ValidationError.EMAIL };
  }

  if (
    !String(name).trim() ||
    !String(phone).trim() ||
    !Array.isArray(cart) ||
    cart.length === 0
  ) {
    return { ok: false, error: ValidationError.INVALID_PAYLOAD };
  }

  if (orderType === 'delivery' && !String(address || '').trim()) {
    return { ok: false, error: ValidationError.ADDRESS };
  }

  if (timeMode === 'scheduled' && !String(preferredTime || '').trim()) {
    return { ok: false, error: ValidationError.TIME };
  }

  const orderTotal = Number(total);
  let cashTendered: number | null = null;
  let cashChange: number | null = null;

  if (paymentMethod === 'cash') {
    const rawCash = String(cashAmount ?? '')
      .trim()
      .replace(',', '.');
    if (!rawCash) {
      return { ok: false, error: ValidationError.CASH_REQUIRED };
    }
    cashTendered = Number(rawCash);
    if (!Number.isFinite(cashTendered) || cashTendered <= 0) {
      return { ok: false, error: ValidationError.CASH_REQUIRED };
    }
    if (cashTendered < orderTotal - 0.001) {
      return { ok: false, error: ValidationError.CASH_COVER };
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
      extras: normalizeExtras(p),
      lang: String(lang),
      cart,
      total: orderTotal,
      currency,
      cashTendered,
      cashChange
    }
  };
}

export type { ValidationErrorCode };
