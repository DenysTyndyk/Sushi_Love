import {
  DELIVERY_FEE_PLN,
  isDeliveryAvailable
} from './deliveryFee';
import { getScheduledTimeStatus, isRestaurantOpen } from './orderTimeRules';
import { validateAndPriceCart } from './menuCatalog';

export {
  DELIVERY_FEE_PLN,
  DELIVERY_MIN_SUBTOTAL_PLN,
  isDeliveryAvailable
} from './deliveryFee';
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
    streetNumber = '',
    apartmentNumber = '',
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

  const cartSubtotalClaim =
    p.subtotal != null ? Number(p.subtotal) : Number(total);
  const cartPricing = validateAndPriceCart(cart, cartSubtotalClaim, String(lang));
  if (!cartPricing.ok) {
    return { ok: false, error: ValidationError.CART_PRICING };
  }

  if (orderType === 'delivery' && !isDeliveryAvailable(cartPricing.total)) {
    return { ok: false, error: ValidationError.DELIVERY_MINIMUM };
  }

  if (
    orderType === 'delivery' &&
    (!String(address || '').trim() || !String(streetNumber || '').trim())
  ) {
    return { ok: false, error: ValidationError.ADDRESS };
  }

  if (!isRestaurantOpen()) {
    return { ok: false, error: ValidationError.RESTAURANT_CLOSED };
  }

  if (timeMode === 'scheduled' && !String(preferredTime || '').trim()) {
    return { ok: false, error: ValidationError.TIME };
  }

  if (timeMode === 'scheduled') {
    const timeStatus = getScheduledTimeStatus(String(preferredTime));
    if (timeStatus === 'invalid' || timeStatus === 'out_of_range') {
      return { ok: false, error: ValidationError.TIME_OUT_OF_RANGE };
    }
    if (timeStatus === 'call_required') {
      return { ok: false, error: ValidationError.TIME_CALL_REQUIRED };
    }
  }

  const deliveryFee = orderType === 'delivery' ? DELIVERY_FEE_PLN : 0;
  const orderTotal =
    Math.round((cartPricing.total + deliveryFee) * 100) / 100;
  const claimedTotal = Math.round(Number(total) * 100) / 100;

  if (!Number.isFinite(claimedTotal) || Math.abs(orderTotal - claimedTotal) > 0.001) {
    return { ok: false, error: ValidationError.CART_PRICING };
  }
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
      streetNumber: String(streetNumber || '').trim(),
      apartmentNumber: String(apartmentNumber || '').trim(),
      preferredTime,
      comment: String(comment || '').trim(),
      extras: normalizeExtras(p),
      lang: String(lang),
      cart: cartPricing.cart,
      subtotal: cartPricing.total,
      deliveryFee,
      total: orderTotal,
      currency,
      cashTendered,
      cashChange
    }
  };
}

export type { ValidationErrorCode };
