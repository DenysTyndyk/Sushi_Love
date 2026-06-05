import React, {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent
} from 'react';
import { findMenuItemById } from '../DaneMenu/menuUtils';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import {
  getScheduledTimeStatus,
  isRestaurantOpen
} from '../shared/orderTimeRules';
import { DELIVERY_FEE_PLN, validateOrderPayload } from '../shared/orderValidation';
import Footer from '../components/Footer';
import NavLink from '../components/NavLink';
import LanguageSwitcher from '../components/LanguageSwitcher';
import {
  ValidationError,
  type CartLine,
  type OrderFormData,
  type ValidationErrorCode
} from '../types';

const ORDER_ERROR_KEYS: Record<ValidationErrorCode, string> = {
  [ValidationError.PRIVACY]: 'cart.errorPrivacy',
  [ValidationError.EMAIL]: 'cart.errorInvalidEmail',
  [ValidationError.CASH_REQUIRED]: 'cart.errorCashAmount',
  [ValidationError.CASH_COVER]: 'cart.errorCashAmountMin',
  [ValidationError.ADDRESS]: 'cart.errorAddressRequired',
  [ValidationError.TIME]: 'cart.errorTimeRequired',
  [ValidationError.TIME_OUT_OF_RANGE]: 'cart.errorTimeOutOfRange',
  [ValidationError.TIME_CALL_REQUIRED]: 'cart.errorTimeCallRequired',
  [ValidationError.RESTAURANT_CLOSED]: 'cart.errorRestaurantClosed',
  [ValidationError.INVALID_PAYLOAD]: 'cart.errorInvalidPayload',
  [ValidationError.CART_PRICING]: 'cart.errorCartPricing'
};

const initialFormData: OrderFormData = {
  orderType: 'delivery',
  paymentMethod: 'cash',
  timeMode: 'asap',
  name: '',
  phone: '',
  email: '',
  privacyAccepted: false,
  address: '',
  streetNumber: '',
  apartmentNumber: '',
  preferredTime: '',
  comment: '',
  cashAmount: '',
  extraWasabi: 0,
  extraChopsticks: 0,
  extraSoy: 0,
  extraGinger: 0
};

const MAX_EXTRA_PORTIONS = 20;

const EXTRA_FIELDS = [
  'extraWasabi',
  'extraChopsticks',
  'extraSoy',
  'extraGinger'
] as const;

type ExtraField = (typeof EXTRA_FIELDS)[number];
type SubmitState = 'idle' | 'success' | 'error';

function apiErrorKey(error: string): string | null {
  if (error in ORDER_ERROR_KEYS) {
    return ORDER_ERROR_KEYS[error as ValidationErrorCode];
  }
  return null;
}

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
  const [formData, setFormData] = useState<OrderFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [restaurantOpen, setRestaurantOpen] = useState(() => isRestaurantOpen());

  useEffect(() => {
    const tick = () => setRestaurantOpen(isRestaurantOpen());
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  const orderEndpoint =
    process.env.REACT_APP_ORDER_ENDPOINT || '/.netlify/functions/create-order';

  const lineLabel = (item: CartLine): string => {
    const base = findMenuItemById(lang, item.id);
    if (base?.variantOptions?.length) {
      const key = String(item.id).split('__')[1];
      const opt = base.variantOptions.find((o) => o.key === key);
      if (opt) return `${base.name} — ${opt.label}`;
    }
    return base?.name ?? item.name ?? item.id;
  };

  const linePriceLabel = (item: CartLine): string => {
    const base = findMenuItemById(lang, item.id);
    if (base?.variantOptions?.length) {
      const key = String(item.id).split('__')[1];
      const opt = base.variantOptions.find((o) => o.key === key);
      if (opt) return opt.price;
    }
    return item.priceLabel ?? base?.price ?? '';
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

  const deliveryFee =
    formData.orderType === 'delivery' ? DELIVERY_FEE_PLN : 0;

  const orderTotal = useMemo(
    () => Number((cartTotal + deliveryFee).toFixed(2)),
    [cartTotal, deliveryFee]
  );

  const scheduledTimeStatus = useMemo(() => {
    if (formData.timeMode !== 'scheduled') return 'idle' as const;
    return getScheduledTimeStatus(formData.preferredTime);
  }, [formData.timeMode, formData.preferredTime]);

  const scheduledTimeBlocked =
    scheduledTimeStatus === 'call_required' ||
    scheduledTimeStatus === 'out_of_range' ||
    scheduledTimeStatus === 'invalid';

  const checkoutBlocked = !restaurantOpen || scheduledTimeBlocked;

  const onExtraChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const digits = value.replace(/\D/g, '');
    const raw = digits === '' ? 0 : Math.floor(Number(digits));
    const qty = Number.isFinite(raw)
      ? Math.min(MAX_EXTRA_PORTIONS, Math.max(0, raw))
      : 0;
    setFormData((prev) => ({
      ...prev,
      [name]: qty
    }));
  };

  const adjustExtra = (field: ExtraField, delta: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: Math.min(
        MAX_EXTRA_PORTIONS,
        Math.max(0, prev[field] + delta)
      )
    }));
  };

  const onInputChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value } as OrderFormData;
      if (name === 'timeMode' && value === 'asap') {
        next.preferredTime = '';
      }
      if (name === 'paymentMethod' && value !== 'cash') {
        next.cashAmount = '';
      }
      return next;
    });
  };

  const sendTelegram = async (e: FormEvent) => {
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
      streetNumber: formData.streetNumber,
      apartmentNumber: formData.apartmentNumber,
      preferredTime: formData.preferredTime,
      comment: formData.comment,
      cashAmount:
        formData.paymentMethod === 'cash' ? formData.cashAmount : undefined,
      extraWasabi: formData.extraWasabi,
      extraChopsticks: formData.extraChopsticks,
      extraSoy: formData.extraSoy,
      extraGinger: formData.extraGinger,
      lang,
      cart: cartLines,
      subtotal: Number(cartTotal.toFixed(2)),
      total: orderTotal,
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

      let data: { error?: string; detail?: string } | null = null;
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
            typeof data?.error === 'string' ? apiErrorKey(data.error) : null;
          if (errorKey) {
            setErrorMessage(t(errorKey));
            return;
          }
        }
        setErrorMessage(t('cart.alertError'));
        return;
      }

      setSubmitState('success');
      setFormData(initialFormData);
      clearCart();
    } catch {
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
                      <button
                        type="button"
                        className="cart-qty-btn cart-qty-btn--minus"
                        onClick={() => decreaseItem(item.id)}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="cart-qty-value">{item.quantity}</span>
                      <button
                        type="button"
                        className="cart-qty-btn cart-qty-btn--plus"
                        onClick={() => increaseItem(item.id)}
                        aria-label="Increase quantity"
                      >
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
              <div className="cart-summary">
                <div className="cart-summary__row">
                  <span>{t('cart.subtotal')}</span>
                  <strong>{cartTotal.toFixed(2)} PLN</strong>
                </div>
                {formData.orderType === 'delivery' && (
                  <div className="cart-summary__row">
                    <span>{t('cart.deliveryFee')}</span>
                    <strong>{deliveryFee.toFixed(2)} PLN</strong>
                  </div>
                )}
                <div className="cart-summary__row cart-summary__row--total">
                  <span>{t('cart.total')}</span>
                  <strong>{orderTotal.toFixed(2)} PLN</strong>
                </div>
              </div>
            </>
          )}
        </div>

        {cart.length > 0 && submitState !== 'success' && (
          <div className="cart-checkout">
            <h3 className="cart-checkout-title">{t('cart.checkoutTitle')}</h3>
            <p className="cart-checkout-desc">{t('cart.checkoutDesc')}</p>
            {!restaurantOpen && (
              <div className="cart-closed-banner" role="status">
                <p>{t('cart.closedBanner')}</p>
              </div>
            )}
            <form className="contact-form" onSubmit={sendTelegram}>
              <label>
                {t('cart.deliveryTypeLabel')}
                <select
                  name="orderType"
                  value={formData.orderType}
                  onChange={onInputChange}
                >
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
                <>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={onInputChange}
                    placeholder={t('cart.addressPlaceholder')}
                    required
                  />
                  <div className="cart-address-row">
                    <input
                      type="text"
                      name="streetNumber"
                      value={formData.streetNumber}
                      onChange={onInputChange}
                      placeholder={t('cart.streetNumberPlaceholder')}
                      required
                    />
                    <input
                      type="text"
                      name="apartmentNumber"
                      value={formData.apartmentNumber}
                      onChange={onInputChange}
                      placeholder={t('cart.apartmentNumberPlaceholder')}
                    />
                  </div>
                </>
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
                    min={orderTotal > 0 ? orderTotal : 0.01}
                    step="0.01"
                    inputMode="decimal"
                  />
                </label>
              )}
              <label>
                {t('cart.timeModeLabel')}
                <select
                  name="timeMode"
                  value={formData.timeMode}
                  onChange={onInputChange}
                >
                  <option value="asap">{t('cart.timeModeAsap')}</option>
                  <option value="scheduled">{t('cart.timeModeScheduled')}</option>
                </select>
              </label>
              {formData.timeMode === 'scheduled' && (
                <>
                  <input
                    type="text"
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={onInputChange}
                    placeholder={t('cart.timeScheduledPlaceholder')}
                    required
                    aria-invalid={scheduledTimeBlocked}
                  />
                  {scheduledTimeStatus === 'call_required' && (
                    <div className="cart-time-call-banner" role="status">
                      <p>{t('cart.timeCallBanner')}</p>
                      <a href="tel:+48664454433" className="cart-time-call-banner__phone">
                        +48 664 454 433
                      </a>
                    </div>
                  )}
                  {(scheduledTimeStatus === 'out_of_range' ||
                    scheduledTimeStatus === 'invalid') &&
                    formData.preferredTime.trim() && (
                      <p className="cart-time-hint cart-time-hint--error" role="alert">
                        {t('cart.errorTimeOutOfRange')}
                      </p>
                    )}
                </>
              )}
              <fieldset className="cart-extras">
                <legend>{t('cart.extrasTitle')}</legend>
                <p className="cart-extras-hint">{t('cart.extrasPortionsHint')}</p>
                <div className="cart-extras-grid">
                  {EXTRA_FIELDS.map((field) => (
                    <label key={field} className="cart-extras-item">
                      <span className="cart-extras-item__label">{t(`cart.${field}`)}</span>
                      <span className="cart-extras-stepper">
                        <button
                          type="button"
                          className="cart-extras-stepper__btn"
                          onClick={() => adjustExtra(field, -1)}
                          aria-label={`Decrease ${t(`cart.${field}`)}`}
                        >
                          −
                        </button>
                        <input
                          type="text"
                          name={field}
                          className="cart-extras-stepper__input"
                          value={formData[field] === 0 ? '' : formData[field]}
                          onChange={onExtraChange}
                          inputMode="numeric"
                          pattern="[0-9]*"
                          placeholder="0"
                          aria-label={t(`cart.${field}`)}
                        />
                        <button
                          type="button"
                          className="cart-extras-stepper__btn cart-extras-stepper__btn--plus"
                          onClick={() => adjustExtra(field, 1)}
                          aria-label={`Increase ${t(`cart.${field}`)}`}
                        >
                          +
                        </button>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <textarea
                name="comment"
                value={formData.comment}
                onChange={onInputChange}
                placeholder={t('cart.commentPlaceholder')}
                rows={3}
              />
              <button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting || checkoutBlocked}
              >
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
