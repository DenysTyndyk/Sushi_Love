import React, { useMemo, useState } from 'react';
import { findMenuItemById } from '../DaneMenu/menuUtils';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import Footer from '../components/Footer';
import NavLink from '../components/NavLink';
import LanguageSwitcher from '../components/LanguageSwitcher';

const { validateOrderPayload } = require('../shared/orderValidation');

const ORDER_ERROR_KEYS = {
  'Privacy consent required': 'cart.errorPrivacy',
  'Valid email is required': 'cart.errorInvalidEmail',
  'Cash amount required': 'cart.errorCashAmount',
  'Cash amount must cover order total': 'cart.errorCashAmountMin',
  'Address is required for delivery': 'cart.errorAddressRequired',
  'Time is required when scheduling': 'cart.errorTimeRequired',
  'Invalid order payload': 'cart.errorInvalidPayload'
};

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
  const [formData, setFormData] = useState({
    orderType: 'delivery',
    paymentMethod: 'cash',
    timeMode: 'asap',
    name: '',
    phone: '',
    email: '',
    privacyAccepted: false,
    address: '',
    preferredTime: '',
    comment: '',
    cashAmount: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const orderEndpoint =
    process.env.REACT_APP_ORDER_ENDPOINT || '/.netlify/functions/create-order';

  const lineLabel = (item) => {
    const base = findMenuItemById(lang, item.id);
    if (base?.variantOptions?.length) {
      const key = String(item.id).split('__')[1];
      const opt = base.variantOptions.find((o) => o.key === key);
      if (opt) return `${base.name} — ${opt.label}`;
    }
    return base?.name ?? item.name ?? item.id;
  };

  const linePriceLabel = (item) => {
    const base = findMenuItemById(lang, item.id);
    if (base?.variantOptions?.length) {
      const key = String(item.id).split('__')[1];
      const opt = base.variantOptions.find((o) => o.key === key);
      if (opt) return opt.price;
    }
    return item.priceLabel ?? base?.price;
  };

  const cartLines = useMemo(
    () =>
      cart.map((item) => ({
        id: item.id,
        name: lineLabel(item),
        price: item.priceValue,
        quantity: item.quantity
      })),
    [cart, lang]
  );

  const onInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === 'timeMode' && value === 'asap') {
        next.preferredTime = '';
      }
      if (name === 'paymentMethod' && value !== 'cash') {
        next.cashAmount = '';
      }
      return next;
    });
  };

  const sendTelegram = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setSubmitState('idle');
    setErrorMessage('');

    const payload = {
      orderType: formData.orderType,
      paymentMethod: formData.paymentMethod,
      timeMode: formData.timeMode,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      privacyAccepted: formData.privacyAccepted,
      address: formData.address,
      preferredTime: formData.preferredTime,
      comment: formData.comment,
      cashAmount:
        formData.paymentMethod === 'cash' ? formData.cashAmount : undefined,
      lang,
      cart: cartLines,
      total: Number(cartTotal.toFixed(2)),
      currency: 'PLN'
    };

    const validation = validateOrderPayload(payload);
    if (!validation.ok) {
      setSubmitState('error');
      const errorKey = ORDER_ERROR_KEYS[validation.error];
      setErrorMessage(errorKey ? t(errorKey) : t('cart.alertError'));
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(orderEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      let data = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        setSubmitState('error');
        if (response.status === 404) {
          setErrorMessage(t('cart.errorEndpoint404'));
          return;
        }
        if (
          response.status === 500 &&
          data?.error === 'Server configuration error'
        ) {
          setErrorMessage(t('cart.errorServerConfig'));
          return;
        }
        if (response.status === 502) {
          const base = t('cart.errorTelegram');
          const detail =
            typeof data?.detail === 'string' && data.detail.trim()
              ? data.detail.trim()
              : '';
          setErrorMessage(detail ? `${base} ${detail}` : base);
          return;
        }
        if (response.status === 400) {
          const errorKey =
            typeof data?.error === 'string' ? ORDER_ERROR_KEYS[data.error] : null;
          if (errorKey) {
            setErrorMessage(t(errorKey));
            return;
          }
        }
        setErrorMessage(t('cart.alertError'));
        return;
      }

      setSubmitState('success');
      setFormData({
        orderType: 'delivery',
        paymentMethod: 'cash',
        timeMode: 'asap',
        name: '',
        phone: '',
        email: '',
        privacyAccepted: false,
        address: '',
        preferredTime: '',
        comment: '',
        cashAmount: ''
      });
      clearCart();
    } catch (error) {
      setSubmitState('error');
      setErrorMessage(t('cart.alertNetwork'));
    } finally {
      setIsSubmitting(false);
    }
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

        {cart.length > 0 && submitState !== 'success' && (
          <div className="cart-checkout">
            <h3 className="cart-checkout-title">{t('cart.checkoutTitle')}</h3>
            <p className="cart-checkout-desc">{t('cart.checkoutDesc')}</p>
            <form className="contact-form" onSubmit={sendTelegram}>
              <label>
                {t('cart.deliveryTypeLabel')}
                <select name="orderType" value={formData.orderType} onChange={onInputChange}>
                  <option value="delivery">{t('cart.deliveryTypeDelivery')}</option>
                  <option value="pickup">{t('cart.deliveryTypePickup')}</option>
                </select>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={onInputChange}
                placeholder={t('cart.namePlaceholder')}
                required
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={onInputChange}
                placeholder={t('cart.phonePlaceholder')}
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={onInputChange}
                placeholder={t('cart.emailPlaceholder')}
                autoComplete="email"
                required
              />
              <label className="cart-privacy-row">
                <input
                  type="checkbox"
                  name="privacyAccepted"
                  checked={formData.privacyAccepted}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      privacyAccepted: e.target.checked
                    }))
                  }
                />
                <span>{t('cart.privacyCheckbox')}</span>
              </label>
              {formData.orderType === 'delivery' && (
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={onInputChange}
                  placeholder={t('cart.addressPlaceholder')}
                  required
                />
              )}
              <label>
                {t('cart.paymentLabel')}
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={onInputChange}
                >
                  <option value="cash">{t('cart.paymentCash')}</option>
                  <option value="card">{t('cart.paymentCard')}</option>
                </select>
              </label>
              {formData.paymentMethod === 'cash' && (
                <label>
                  {t('cart.cashAmountLabel')}
                  <input
                    type="number"
                    name="cashAmount"
                    value={formData.cashAmount}
                    onChange={onInputChange}
                    placeholder={t('cart.cashAmountPlaceholder')}
                    min={cartTotal > 0 ? cartTotal : 0.01}
                    step="0.01"
                    inputMode="decimal"
                  />
                </label>
              )}
              <label>
                {t('cart.timeModeLabel')}
                <select name="timeMode" value={formData.timeMode} onChange={onInputChange}>
                  <option value="asap">{t('cart.timeModeAsap')}</option>
                  <option value="scheduled">{t('cart.timeModeScheduled')}</option>
                </select>
              </label>
              {formData.timeMode === 'scheduled' && (
                <input
                  type="text"
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={onInputChange}
                  placeholder={t('cart.timeScheduledPlaceholder')}
                  required
                />
              )}
              <textarea
                name="comment"
                value={formData.comment}
                onChange={onInputChange}
                placeholder={t('cart.commentPlaceholder')}
                rows={3}
              />
              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? t('cart.submitting') : t('cart.submit')}
              </button>
            </form>
            {submitState === 'error' && errorMessage && (
              <p className="cart-checkout-desc" role="alert">
                {errorMessage}
              </p>
            )}
          </div>
        )}
        {submitState === 'success' && (
          <div className="cart-checkout">
            <h3 className="cart-checkout-title">{t('cart.successTitle')}</h3>
            <p className="cart-checkout-desc">{t('cart.successEmailHint')}</p>
            <p className="cart-checkout-desc">{t('cart.phoneCta')}</p>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default CartPage;
