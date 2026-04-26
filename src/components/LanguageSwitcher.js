import React from 'react';
import { LANGS } from '../i18n/translations';
import { useLanguage } from '../context/LanguageContext';

const LanguageSwitcher = ({ className = '' }) => {
  const { lang, setLang, t } = useLanguage();

  return (
    <div
      className={`language-switcher ${className}`.trim()}
      role="group"
      aria-label={t('lang.label')}
    >
      {LANGS.map((code) => (
        <button
          key={code}
          type="button"
          className={`lang-btn ${lang === code ? 'lang-btn--active' : ''}`}
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
        >
          {t(`lang.${code}`)}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
