import menuByLang from './menuByLang.json';
import type { Lang, MenuByLang, MenuItem, MenuRow, MenuSection } from '../types';

export const MENU_CATEGORY_KEYS = Object.keys(
  (menuByLang as MenuByLang).pl
);

export const CATEGORY_IMAGES: Partial<Record<string, string>> = {
  Futomak: '/imgs/Rolls/Futomak.jpg',
  Philadelphia: '/imgs/PhilaRolls/PhilaClassic.jpg',
  Kalifornia: '/imgs/Rolls/Kalifornia.jpg',
  Uramak: '/imgs/Rolls/Uramak.jpg'
};

export function getCategoryImage(categoryKey: string): string | null {
  return CATEGORY_IMAGES[categoryKey] ?? null;
}

export function getMenuForLocale(locale: Lang | string) {
  const menu = menuByLang as MenuByLang;
  if (locale === 'pl' || locale === 'en' || locale === 'uk') {
    return menu[locale];
  }
  return menu.pl;
}

export function menuItemBaseId(itemId: string | number | null | undefined): string {
  const s = String(itemId ?? '');
  const sep = s.indexOf('__');
  return sep === -1 ? s : s.slice(0, sep);
}

export function isMenuSection(row: MenuRow): row is MenuSection {
  return 'kind' in row && row.kind === 'section';
}

export function findMenuItemById(
  locale: Lang | string,
  itemId: string
): MenuItem | null {
  const baseId = menuItemBaseId(itemId);
  const menu = getMenuForLocale(locale);
  for (const cat of Object.keys(menu)) {
    const row = menu[cat].find((i) => !isMenuSection(i) && i.id === baseId);
    if (row && !isMenuSection(row)) {
      return row;
    }
  }
  return null;
}
