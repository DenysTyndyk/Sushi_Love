import React from 'react';
import NavLink from './NavLink';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="main-footer">
      <div className="footer-content">
        <div className="footer-logo">
          <img src="/logo.png" alt={t('footer.logoAlt')} />
          <p className="footer-brand">Sushi Love</p>
        </div>
        <nav className="footer-nav" aria-label={t('footer.navAria')}>
          <NavLink to="/#menu">{t('footer.navMenu')}</NavLink>
          <NavLink to="/koszyk">{t('footer.navCart')}</NavLink>
          <NavLink to="/#contact">{t('footer.navContact')}</NavLink>
          <NavLink to="/#map">{t('footer.navMap')}</NavLink>
        </nav>
        <div className="footer-info">
          <p>📍 Aleja Najświętszej Maryi Panny 10, Częstochowa</p>
          <p>
            <a href="tel:+48664454433">📞 +48 664 454 433</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
