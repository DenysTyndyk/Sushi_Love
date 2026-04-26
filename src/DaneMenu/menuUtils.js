import menuByLang from './menuByLang.json';

export const MENU_CATEGORY_KEYS = Object.keys(menuByLang.pl);

export function getMenuForLocale(locale) {
  return menuByLang[locale] ?? menuByLang.pl;
}

export function findMenuItemById(locale, itemId) {
  const menu = getMenuForLocale(locale);
  for (const cat of Object.keys(menu)) {
    const row = menu[cat].find((i) => i.id === itemId);
    if (row) return row;
  }
  return null;
}
