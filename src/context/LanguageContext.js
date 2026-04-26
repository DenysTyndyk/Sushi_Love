import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { LANGS, translations } from '../i18n/translations';

const STORAGE_KEY = 'sushi-love-lang';

const LanguageContext = createContext(null);

const getNested = (obj, path) => {
  const keys = path.split('.');
  let cur = obj;
  for (const k of keys) {
    if (cur == null || typeof cur !== 'object') return undefined;
    cur = cur[k];
  }
  return cur;
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && LANGS.includes(saved)) return saved;
    } catch {}
    return 'pl';
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {}
  }, [lang]);

  const setLang = useCallback((next) => {
    if (LANGS.includes(next)) setLangState(next);
  }, []);

  const t = useCallback(
    (path) => {
      const fromLang = getNested(translations[lang], path);
      if (fromLang !== undefined && fromLang !== null) return fromLang;
      const fallback = getNested(translations.pl, path);
      if (fallback !== undefined && fallback !== null) return fallback;
      return path;
    },
    [lang]
  );

  const categoryLabel = useCallback(
    (categoryKey) => translations[lang]?.categories?.[categoryKey] ?? categoryKey,
    [lang]
  );

  const value = useMemo(
    () => ({ lang, setLang, t, categoryLabel }),
    [lang, setLang, t, categoryLabel]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return ctx;
};
