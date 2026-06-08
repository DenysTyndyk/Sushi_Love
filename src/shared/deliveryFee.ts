export const DELIVERY_FEE_PLN = 10;
export const DELIVERY_MIN_SUBTOTAL_PLN = 80;

export function isDeliveryAvailable(subtotal: number): boolean {
  return Number(subtotal) >= DELIVERY_MIN_SUBTOTAL_PLN;
}
