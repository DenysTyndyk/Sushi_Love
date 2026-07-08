export const BOTTLE_DEPOSIT_PLN = 0.5;

export function isDrinkLineId(id: string): boolean {
  const base = String(id || '').split('__')[0];
  return base.startsWith('drink-') && !base.startsWith('drink-h-');
}

export function countDrinkUnits(
  cart: ReadonlyArray<{ id: string; quantity: number }>
): number {
  let units = 0;
  for (const line of cart) {
    if (!isDrinkLineId(line.id)) continue;
    const qty = Math.floor(Number(line.quantity));
    if (Number.isFinite(qty) && qty > 0) {
      units += qty;
    }
  }
  return units;
}

export function calculateBottleDepositPln(
  cart: ReadonlyArray<{ id: string; quantity: number }>
): number {
  const units = countDrinkUnits(cart);
  if (units <= 0) return 0;
  return Math.round(units * BOTTLE_DEPOSIT_PLN * 100) / 100;
}
