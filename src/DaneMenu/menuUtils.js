import menuByLang from './menuByLang.json';

export const MENU_CATEGORY_KEYS = Object.keys(menuByLang.pl);

export const CATEGORY_IMAGES = {
  Futomak: '/imgs/Rolls/Futomak.jpg',
  Philadelphia: '/imgs/PhilaRolls/PhilaClassic.jpg',
  Kalifornia: '/imgs/Rolls/Kalifornia.jpg',
  Uramak: '/imgs/Rolls/Uramak.jpg'
};

export function getCategoryImage(categoryKey) {
  return CATEGORY_IMAGES[categoryKey] ?? null;
}

export function getMenuForLocale(locale) {
  return menuByLang[locale] ?? menuByLang.pl;
}

export function menuItemBaseId(itemId) {
  const s = String(itemId ?? '');
  const sep = s.indexOf('__');
  return sep === -1 ? s : s.slice(0, sep);
}

export function findMenuItemById(locale, itemId) {
  const baseId = menuItemBaseId(itemId);
  const menu = getMenuForLocale(locale);
  for (const cat of Object.keys(menu)) {
    const row = menu[cat].find((i) => i.id === baseId);
    if (row) return row;
  }
  return null;
}
