import React, { useMemo, useState } from 'react';
import { getMenuForLocale, MENU_CATEGORY_KEYS } from '../DaneMenu/menuUtils';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import Footer from '../components/Footer';
import NavLink from '../components/NavLink';
import LanguageSwitcher from '../components/LanguageSwitcher';

const HomePage = () => {
  const [activeCategory, setActiveCategory] = useState(MENU_CATEGORY_KEYS[0]);
  const { addToCart, cartItemsCount } = useCart();
  const { lang, t, categoryLabel } = useLanguage();
  const menuData = useMemo(() => getMenuForLocale(lang), [lang]);

  return (
    <div className="app-container">
      <section className="hero-banner">
        <div className="hero-overlay" />
        <div className="logo-divider">
          <img src="/logo.png" alt="Sushi Love Logo" className="floating-logo" />
        </div>
      </section>

      <section className="menu-section">
        <nav className="site-nav" aria-label={t('nav.mainAria')}>
          <LanguageSwitcher />
          <NavLink to="/koszyk" className="cart-nav-link">
            {t('nav.cart')}
            {cartItemsCount > 0 && (
              <span className="cart-badge">{cartItemsCount}</span>
            )}
          </NavLink>
        </nav>

        <div className="section-title">
          <span className="line" />
          <h2>{t('home.menuTitle')}</h2>
          <span className="line" />
        </div>

        <div className="category-tabs">
          {Object.keys(menuData).map((cat) => (
            <button
              key={cat}
              type="button"
              className={activeCategory === cat ? 'tab-btn active' : 'tab-btn'}
              onClick={() => setActiveCategory(cat)}
            >
              {categoryLabel(cat)}
            </button>
          ))}
        </div>

        <div className="menu-list fade-in">
          {menuData[activeCategory].map((item) => (
            <div key={item.id} className="menu-item">
              <div className="item-info">
                <h4>{item.name}</h4>
                <p>{item.desc}</p>
              </div>
              <div className="item-actions">
                <div className="item-price">{item.price}</div>
                <button
                  type="button"
                  className="add-btn"
                  onClick={() => addToCart(item, activeCategory)}
                >
                  {t('home.addToCart')}
                </button>
              </div>
            </div>
          ))}
        </div>

        <p className="cart-hint">
          {t('home.cartHintBefore')}{' '}
          <NavLink to="/koszyk">{t('home.cartHintLink')}</NavLink>.
        </p>
      </section>

      <section className="contact-section">
        <div className="section-title">
          <span className="line" />
          <h2>{t('home.contactTitle')}</h2>
          <span className="line" />
        </div>

        <div className="contact-container">
          <div className="contact-grid contact-grid--single">
            <div className="contact-methods">
              <h3>{t('home.contactSubtitle')}</h3>
              <p>{t('home.contactDesc')}</p>
              <div className="button-group">
                <a href="tel:+48664454433" className="contact-btn phone">
                  📞 +48 664 454 433
                </a>
                <a href="https://wa.me/48664454433" className="contact-btn whatsapp">
                  💬 WhatsApp
                </a>
                <a href="https://t.me/your_username" className="contact-btn telegram">
                  ✈️ Telegram
                </a>
              </div>
              <p className="contact-order-hint">
                {t('home.orderFormHint')}{' '}
                <NavLink to="/koszyk">{t('home.orderFormLink')}</NavLink>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="map-section">
        <div className="section-title">
          <span className="line" />
          <h2>{t('home.mapTitle')}</h2>
          <span className="line" />
        </div>
        <div className="map-frame">
          <div className="map-inner-border">
            <iframe
              title={t('home.mapIframeTitle')}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2521.144410056157!2d19.121178277253335!3d50.812046395350325!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4710b5c992246381%3A0xa2dd76336420f45e!2sAleja%20Naj%C5%9Bwi%C4%99tszej%20Maryi%20Panny%2010%2C%2042-200%20Cz%C4%99stochowa!5e0!3m2!1suk!2spl!4v1714060000000!5m2!1suk!2spl"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
