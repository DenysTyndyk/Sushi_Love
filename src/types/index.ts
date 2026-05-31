export type Lang = 'pl' | 'en' | 'uk';

export type OrderType = 'delivery' | 'pickup';
export type PaymentMethod = 'cash' | 'card';
export type TimeMode = 'asap' | 'scheduled';

export interface VariantOption {
  key: string;
  label: string;
  price: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: string;
  desc?: string;
  image?: string;
  variantOptions?: VariantOption[];
}

export interface MenuSection {
  id: string;
  name: string;
  kind: 'section';
}

export type MenuRow = MenuItem | MenuSection;

export type MenuByCategory = Record<string, MenuRow[]>;
export type MenuByLang = Record<Lang, MenuByCategory>;

export interface CartLine {
  id: string;
  name: string;
  priceLabel: string;
  priceValue: number;
  quantity: number;
}

export interface OrderCartLine {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface OrderExtras {
  extraWasabi: number;
  extraChopsticks: number;
  extraSoy: number;
  extraGinger: number;
}

export interface OrderFormData extends OrderExtras {
  orderType: OrderType;
  paymentMethod: PaymentMethod;
  timeMode: TimeMode;
  name: string;
  phone: string;
  email: string;
  privacyAccepted: boolean;
  address: string;
  streetNumber: string;
  apartmentNumber: string;
  preferredTime: string;
  comment: string;
  cashAmount: string;
}

export interface OrderPayload {
  orderType?: OrderType;
  paymentMethod?: PaymentMethod;
  timeMode?: TimeMode;
  name?: string;
  phone?: string;
  email?: string;
  privacyAccepted?: boolean;
  address?: string;
  streetNumber?: string;
  apartmentNumber?: string;
  preferredTime?: string;
  comment?: string;
  cashAmount?: string | number;
  extraWasabi?: number;
  extraChopsticks?: number;
  extraSoy?: number;
  extraGinger?: number;
  lang?: Lang | string;
  cart?: OrderCartLine[];
  total?: number;
  currency?: string;
}

export interface ValidatedOrder {
  name: string;
  phone: string;
  emailTrim: string;
  orderType: OrderType;
  paymentMethod: PaymentMethod;
  timeMode: TimeMode;
  address: string;
  streetNumber: string;
  apartmentNumber: string;
  preferredTime: string;
  comment: string;
  extras: OrderExtras;
  lang: string;
  cart: OrderCartLine[];
  total: number;
  currency: string;
  cashTendered: number | null;
  cashChange: number | null;
}

export type ValidationResult =
  | { ok: true; data: ValidatedOrder }
  | { ok: false; error: ValidationErrorCode };

export const ValidationError = {
  INVALID_PAYLOAD: 'Invalid order payload',
  PRIVACY: 'Privacy consent required',
  EMAIL: 'Valid email is required',
  ADDRESS: 'Address is required for delivery',
  TIME: 'Time is required when scheduling',
  CASH_REQUIRED: 'Cash amount required',
  CASH_COVER: 'Cash amount must cover order total',
  CART_PRICING: 'Cart items or total do not match menu prices'
} as const;

export type ValidationErrorCode =
  (typeof ValidationError)[keyof typeof ValidationError];

export interface AddToCartOptions {
  variantKey?: string;
}

export interface CartContextValue {
  cart: CartLine[];
  cartItemsCount: number;
  cartTotal: number;
  addToCart: (
    item: MenuItem,
    category: string,
    opts?: AddToCartOptions
  ) => void;
  increaseItem: (itemId: string) => void;
  decreaseItem: (itemId: string) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
}
