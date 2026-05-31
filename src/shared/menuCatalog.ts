import menuByLang from '../DaneMenu/menuByLang.json';
import type {
  Lang,
  MenuByLang,
  MenuItem,
  MenuRow,
  MenuSection,
  OrderCartLine
} from '../types';

const menu = menuByLang as MenuByLang;

export const MAX_CART_LINES = 100;
export const MAX_LINE_QTY = 99;

export function parseMenuPrice(priceText: string): number {
  const [firstPart] = priceText.split('/');
  const numericPrice = parseFloat(
    firstPart.replace(/[^\d.,]/g, '').replace(',', '.')
  );
  return Number.isFinite(numericPrice) ? numericPrice : NaN;
}

function menuItemBaseId(itemId: string): string {
  const sep = itemId.indexOf('__');
  return sep === -1 ? itemId : itemId.slice(0, sep);
}

function variantKeyFromLineId(itemId: string): string | null {
  const sep = itemId.indexOf('__');
  return sep === -1 ? null : itemId.slice(sep + 2);
}

function isMenuSection(row: MenuRow): row is MenuSection {
  return 'kind' in row && row.kind === 'section';
}

function resolveLang(locale: string): Lang {
  if (locale === 'en' || locale === 'uk') return locale;
  return 'pl';
}

function findMenuItem(locale: string, itemId: string): MenuItem | null {
  const lang = resolveLang(locale);
  const baseId = menuItemBaseId(itemId);
  const categories = menu[lang];

  for (const cat of Object.keys(categories)) {
    const row = categories[cat].find((i) => !isMenuSection(i) && i.id === baseId);
    if (row && !isMenuSection(row)) {
      return row;
    }
  }
  return null;
}

export function resolveCartLineUnitPrice(lineId: string, lang: string): number | null {
  const item = findMenuItem(lang, lineId);
  if (!item) return null;

  const variantKey = variantKeyFromLineId(lineId);
  if (variantKey) {
    const opt = item.variantOptions?.find((o) => o.key === variantKey);
    if (!opt) return null;
    const price = parseMenuPrice(opt.price);
    return Number.isFinite(price) ? price : null;
  }

  if (item.variantOptions?.length) {
    return null;
  }

  const price = parseMenuPrice(item.price);
  return Number.isFinite(price) ? price : null;
}

export function resolveCartLineName(lineId: string, lang: string): string | null {
  const item = findMenuItem(lang, lineId);
  if (!item) return null;

  const variantKey = variantKeyFromLineId(lineId);
  if (variantKey) {
    const opt = item.variantOptions?.find((o) => o.key === variantKey);
    if (!opt) return null;
    return `${item.name} — ${opt.label}`;
  }

  if (item.variantOptions?.length) return null;
  return item.name;
}

export type CartPriceFailureReason =
  | 'invalid_item'
  | 'invalid_quantity'
  | 'total_mismatch'
  | 'cart_too_large';

export type CartPriceValidationResult =
  | { ok: true; cart: OrderCartLine[]; total: number }
  | { ok: false; reason: CartPriceFailureReason };

export function validateAndPriceCart(
  rawCart: unknown,
  claimedTotal: unknown,
  lang: string
): CartPriceValidationResult {
  if (!Array.isArray(rawCart) || rawCart.length === 0) {
    return { ok: false, reason: 'invalid_item' };
  }
  if (rawCart.length > MAX_CART_LINES) {
    return { ok: false, reason: 'cart_too_large' };
  }

  let computedTotal = 0;
  const cart: OrderCartLine[] = [];

  for (const line of rawCart) {
    if (!line || typeof line !== 'object') {
      return { ok: false, reason: 'invalid_item' };
    }

    const id = String((line as { id?: unknown }).id ?? '').trim();
    const qty = Math.floor(Number((line as { quantity?: unknown }).quantity));

    if (!id || !Number.isFinite(qty) || qty < 1 || qty > MAX_LINE_QTY) {
      return { ok: false, reason: 'invalid_quantity' };
    }

    const unitPrice = resolveCartLineUnitPrice(id, lang);
    const name = resolveCartLineName(id, lang);
    if (unitPrice == null || name == null) {
      return { ok: false, reason: 'invalid_item' };
    }

    computedTotal += unitPrice * qty;
    cart.push({ id, name, price: unitPrice, quantity: qty });
  }

  const computedRounded = Math.round(computedTotal * 100) / 100;
  const claimedRounded = Math.round(Number(claimedTotal) * 100) / 100;

  if (!Number.isFinite(claimedRounded) || Math.abs(computedRounded - claimedRounded) > 0.001) {
    return { ok: false, reason: 'total_mismatch' };
  }

  return { ok: true, cart, total: computedRounded };
}
