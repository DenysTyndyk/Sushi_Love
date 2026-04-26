import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="main-footer">
      <div className="footer-content">
        <div className="footer-logo">
          <img src="/logo.png" alt={t('footer.logoAlt')} />
          <h3>Sushi Love</h3>
        </div>
        <div className="footer-info">
          <p>📍 Aleja Najświętszej Maryi Panny 10, Częstochowa</p>
          <p>📞 +48 664 454 433</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
