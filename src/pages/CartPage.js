import React from 'react';
import { findMenuItemById } from '../DaneMenu/menuUtils';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import Footer from '../components/Footer';
import NavLink from '../components/NavLink';
import LanguageSwitcher from '../components/LanguageSwitcher';

const CartPage = () => {
  const {
    cart,
    cartItemsCount,
    cartTotal,
    increaseItem,
    decreaseItem,
    removeItem,
    clearCart
  } = useCart();
  const { lang, t } = useLanguage();

  const lineLabel = (item) =>
    findMenuItemById(lang, item.id)?.name ?? item.name ?? item.id;

  const linePriceLabel = (item) =>
    findMenuItemById(lang, item.id)?.price ?? item.priceLabel;

  const sendTelegram = (e) => {
    e.preventDefault();

    const token = 'ТВІЙ_ТОКЕН_З_BOTFATHER';
    const chatId = 'ТВІЙ_ID_З_USERINFOBOT';

    const name = e.target[0].value;
    const phone = e.target[1].value;
    const cartSummary = cart.length
      ? cart
          .map(
            (item) =>
              `• ${lineLabel(item)} x${item.quantity} = ${item.priceValue * item.quantity} PLN`
          )
          .join('%0A')
      : t('cart.telegramEmpty');

    const message =
      `🚀 *${t('cart.telegramNew')}*%0A👤 ${t('cart.telegramName')}: ${name}%0A📞 ${t('cart.telegramPhone')}: ${phone}%0A%0A🛒 *${t('cart.telegramCart')}:*%0A${cartSummary}%0A%0A💰 *${t('cart.telegramTotal')}:* ${cartTotal.toFixed(2)} PLN`;
    const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${message}&parse_mode=Markdown`;

    fetch(url)
      .then((res) => {
        if (res.ok) {
          alert(t('cart.alertOk'));
          e.target.reset();
          clearCart();
        } else {
          alert(t('cart.alertError'));
        }
      })
      .catch(() => alert(t('cart.alertNetwork')));
  };

  return (
    <div className="app-container cart-page">
      <header className="cart-page-header">
        <div className="cart-page-header-main">
          <NavLink to="/" className="back-to-menu">
            {t('cart.back')}
          </NavLink>
          <h1 className="cart-page-title">{t('cart.title')}</h1>
        </div>
        <LanguageSwitcher className="language-switcher--compact" />
      </header>

      <section className="cart-page-section">
        <div className="cart-panel cart-panel--page">
          <div className="cart-header">
            <h2>
              {t('cart.orderSummary')} ({cartItemsCount})
            </h2>
            {cart.length > 0 && (
              <button type="button" className="cart-clear-btn" onClick={clearCart}>
                {t('cart.clear')}
              </button>
            )}
          </div>

          {cart.length === 0 ? (
            <div className="cart-empty-block">
              <p className="cart-empty">{t('cart.empty')}</p>
              <NavLink to="/" className="submit-btn cart-empty-cta">
                {t('cart.toMenu')}
              </NavLink>
            </div>
          ) : (
            <>
              <div className="cart-list">
                {cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-info">
                      <h4>{lineLabel(item)}</h4>
                      <p>{linePriceLabel(item)}</p>
                    </div>
                    <div className="cart-controls">
                      <button type="button" onClick={() => decreaseItem(item.id)}>
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => increaseItem(item.id)}>
                        +
                      </button>
                    </div>
                    <div className="cart-item-total">
                      {(item.priceValue * item.quantity).toFixed(2)} PLN
                    </div>
                    <button
                      type="button"
                      className="remove-item-btn"
                      onClick={() => removeItem(item.id)}
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
              <div className="cart-total">
                {t('cart.total')} <strong>{cartTotal.toFixed(2)} PLN</strong>
              </div>
            </>
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-checkout">
            <h3 className="cart-checkout-title">{t('cart.checkoutTitle')}</h3>
            <p className="cart-checkout-desc">{t('cart.checkoutDesc')}</p>
            <form className="contact-form" onSubmit={sendTelegram}>
              <input type="text" placeholder={t('cart.namePlaceholder')} required />
              <input type="tel" placeholder={t('cart.phonePlaceholder')} required />
              <button type="submit" className="submit-btn">
                {t('cart.submit')}
              </button>
            </form>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default CartPage;
