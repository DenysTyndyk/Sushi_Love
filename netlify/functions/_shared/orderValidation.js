"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/shared/orderValidation.ts
var orderValidation_exports = {};
__export(orderValidation_exports, {
  EMAIL_RE: () => EMAIL_RE,
  validateOrderPayload: () => validateOrderPayload
});
module.exports = __toCommonJS(orderValidation_exports);

// src/types/index.ts
var ValidationError = {
  INVALID_PAYLOAD: "Invalid order payload",
  PRIVACY: "Privacy consent required",
  EMAIL: "Valid email is required",
  ADDRESS: "Address is required for delivery",
  TIME: "Time is required when scheduling",
  CASH_REQUIRED: "Cash amount required",
  CASH_COVER: "Cash amount must cover order total"
};

// src/shared/orderValidation.ts
var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var MAX_EXTRA_PORTIONS = 20;
function normalizeExtraQty(value) {
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.min(n, MAX_EXTRA_PORTIONS);
}
function normalizeExtras(p) {
  return {
    extraWasabi: normalizeExtraQty(p.extraWasabi),
    extraChopsticks: normalizeExtraQty(p.extraChopsticks),
    extraSoy: normalizeExtraQty(p.extraSoy),
    extraGinger: normalizeExtraQty(p.extraGinger)
  };
}
function validateOrderPayload(payload) {
  if (!payload || typeof payload !== "object") {
    return { ok: false, error: ValidationError.INVALID_PAYLOAD };
  }
  const p = payload;
  const {
    name = "",
    phone = "",
    email = "",
    privacyAccepted,
    orderType = "delivery",
    paymentMethod = "cash",
    timeMode = "asap",
    address = "",
    preferredTime = "",
    comment = "",
    cashAmount,
    lang = "pl",
    cart = [],
    total = 0,
    currency = "PLN"
  } = p;
  if (!privacyAccepted) {
    return { ok: false, error: ValidationError.PRIVACY };
  }
  const emailTrim = String(email || "").trim().toLowerCase();
  if (!emailTrim || !EMAIL_RE.test(emailTrim)) {
    return { ok: false, error: ValidationError.EMAIL };
  }
  if (!String(name).trim() || !String(phone).trim() || !Array.isArray(cart) || cart.length === 0) {
    return { ok: false, error: ValidationError.INVALID_PAYLOAD };
  }
  if (orderType === "delivery" && !String(address || "").trim()) {
    return { ok: false, error: ValidationError.ADDRESS };
  }
  if (timeMode === "scheduled" && !String(preferredTime || "").trim()) {
    return { ok: false, error: ValidationError.TIME };
  }
  const orderTotal = Number(total);
  let cashTendered = null;
  let cashChange = null;
  if (paymentMethod === "cash") {
    const rawCash = String(cashAmount ?? "").trim().replace(",", ".");
    if (!rawCash) {
      return { ok: false, error: ValidationError.CASH_REQUIRED };
    }
    cashTendered = Number(rawCash);
    if (!Number.isFinite(cashTendered) || cashTendered <= 0) {
      return { ok: false, error: ValidationError.CASH_REQUIRED };
    }
    if (cashTendered < orderTotal - 1e-3) {
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
      address: String(address || "").trim(),
      preferredTime,
      comment: String(comment || "").trim(),
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  EMAIL_RE,
  validateOrderPayload
});
