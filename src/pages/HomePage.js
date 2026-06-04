import React, { useCallback, useMemo, useState } from 'react';
import {
  getCategoryImage,
  getMenuForLocale,
  MENU_CATEGORY_KEYS
} from '../DaneMenu/menuUtils';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import Footer from '../components/Footer';
import NavLink from '../components/NavLink';
import LanguageSwitcher from '../components/LanguageSwitcher';
import CategoryHero from '../components/menu/CategoryHero';
import MenuTabs from '../components/menu/MenuTabs';
import MenuList from '../components/menu/MenuList';

const HomePage = () => {
  const [activeCategory, setActiveCategory] = useState(MENU_CATEGORY_KEYS[0]);
  const [variantChoice, setVariantChoice] = useState({});
  const { addToCart, cartItemsCount } = useCart();
  const { lang, t, categoryLabel, categorySectionTitle } = useLanguage();
  const menuData = useMemo(() => getMenuForLocale(lang), [lang]);
  const categoryImage = getCategoryImage(activeCategory);
  const categoryKeys = useMemo(() => Object.keys(menuData), [menuData]);

  const handleVariantSelect = useCallback((itemId, key) => {
    setVariantChoice((prev) => ({ ...prev, [itemId]: key }));
  }, []);

  const handleAddToCart = useCallback(
    (item, categoryKey, opts) => {
      addToCart(item, categoryKey, opts);
    },
    [addToCart]
  );

  return (
    <div className="app-container">
      <section
        className="hero-banner"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/Banner.jpg)`
        }}
      >
        <div className="hero-overlay" />
        <div className="logo-divider">
          <img src="/logo.png" alt="Sushi Love Logo" className="floating-logo" />
        </div>
      </section>

      <section id="menu" className="menu-section">
        <nav className="site-nav" aria-label={t('nav.mainAria')}>
          <LanguageSwitcher />
          <NavLink to="/koszyk" className="cart-nav-link">
            {t('nav.cart')}
            {cartItemsCount > 0 && (
              <span className="cart-badge">{cartItemsCount}</span>
            )}
          </NavLink>
        </nav>

        <h1 className="sr-only">{t('home.h1Title')}</h1>

        <div className="section-title">
          <span className="line" />
          <h2>{t('home.menuTitle')}</h2>
          <span className="line" />
        </div>

        <MenuTabs
          categories={categoryKeys}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
          categoryLabel={categoryLabel}
        />

        <div className="menu-list fade-in">
          <CategoryHero
            src={categoryImage}
            alt={categorySectionTitle(activeCategory)}
          />
          <h3 className="menu-category-title">{categorySectionTitle(activeCategory)}</h3>
          <MenuList
            items={menuData[activeCategory]}
            activeCategory={activeCategory}
            variantChoice={variantChoice}
            onVariantSelect={handleVariantSelect}
            onAddToCart={handleAddToCart}
            addToCartLabel={t('home.addToCart')}
          />
        </div>

        {activeCategory === 'Napoje' ? (
          <p className="menu-category-note">{t('home.drinksDepositNote')}</p>
        ) : null}

        <p className="cart-hint">
          {t('home.cartHintBefore')}{' '}
          <NavLink to="/koszyk">{t('home.cartHintLink')}</NavLink>.
        </p>
      </section>

      <section id="contact" className="contact-section">
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
                <a
                  href="https://www.instagram.com/sushi_love_czestochowa?igsh=N3d4dHNoZWNya3g4"
                  className="contact-btn instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('home.contactInstagram')}
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

      <section id="map" className="map-section">
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

        <div className="opening-hours">
          <h3 className="opening-hours__title">{t('home.hoursTitle')}</h3>
          <ul className="opening-hours__list">
            {(t('home.hours') || []).map((row) => (
              <li key={row.day} className="opening-hours__row">
                <span className="opening-hours__day">{row.day}</span>
                <span className="opening-hours__time">{row.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <details className="seo-about-subtle">
        <summary>{t('home.seoAboutSummary')}</summary>
        {(t('home.seoIntro') || []).map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </details>

      <Footer />
    </div>
  );
};

export default HomePage;
