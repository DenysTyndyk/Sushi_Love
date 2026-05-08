const categories = {
  pl: {
    Zestawy: 'Zestawy',
    Philadelphia: 'Philadelphia',
    'Kalifornia / Burger': 'Kalifornia / Burger',
    'Przystawki / Inne': 'Przystawki / Inne'
  },
  en: {
    Zestawy: 'Sets',
    Philadelphia: 'Philadelphia',
    'Kalifornia / Burger': 'California / Burger',
    'Przystawki / Inne': 'Starters / Other'
  },
  uk: {
    Zestawy: 'Сети',
    Philadelphia: 'Філадельфія',
    'Kalifornia / Burger': 'Каліфорнія / Бургер',
    'Przystawki / Inne': 'Закуски / Інше'
  }
};

const pl = {
  categories: categories.pl,
  nav: {
    mainAria: 'Główna nawigacja',
    cart: 'Koszyk'
  },
  home: {
    menuTitle: 'Karta Menu',
    addToCart: 'Do koszyka',
    cartHintBefore: 'Aby sfinalizować zamówienie, przejdź do',
    cartHintLink: 'koszyka',
    contactTitle: 'Zamówienie i Kontakt',
    contactSubtitle: 'Zadzwoń lub napisz',
    contactDesc: 'Jesteśmy dostępni codziennie w godzinach pracy',
    orderFormHint: 'Formularz zamówienia z koszykiem:',
    orderFormLink: 'strona koszyka',
    mapTitle: 'Znajdź nas',
    mapIframeTitle: 'Lokalizacja Sushi Love'
  },
  cart: {
    back: '← Powrót do menu',
    title: 'Koszyk',
    orderSummary: 'Twoje zamówienie',
    clear: 'Wyczyść',
    empty: 'Koszyk jest pusty.',
    toMenu: 'Przejdź do menu',
    total: 'Razem:',
    checkoutTitle: 'Dane kontaktowe',
    checkoutDesc:
      'Podaj dane kontaktowe — oddzwonimy w celu potwierdzenia. Na e-mail wyślemy potwierdzenie po akceptacji zamówienia przez restaurację.',
    deliveryTypeLabel: 'Sposób odbioru',
    deliveryTypeDelivery: 'Dostawa',
    deliveryTypePickup: 'Odbiór osobisty',
    paymentLabel: 'Płatność',
    paymentCard: 'Karta',
    paymentCash: 'Gotówka',
    timeModeLabel: 'Czas realizacji',
    timeModeAsap: 'Jak najszybciej',
    timeModeScheduled: 'Konkretna godzina',
    timeScheduledPlaceholder: 'Godzina (np. 19:30)',
    emailPlaceholder: 'E-mail (do potwierdzenia zamówienia)',
    privacyCheckbox:
      'Akceptuję przetwarzanie danych osobowych niezbędne do realizacji zamówienia (RODO).',
    namePlaceholder: 'Twoje imię',
    phonePlaceholder: 'Numer telefonu',
    addressPlaceholder: 'Adres dostawy',
    commentPlaceholder: 'Komentarz do zamówienia (opcjonalnie)',
    submit: 'Wyślij zamówienie',
    submitting: 'Wysyłanie...',
    successTitle: 'Dziękujemy! Zamówienie wysłane.',
    successEmailHint:
      'Na podany adres e-mail wyślemy potwierdzenie po zaakceptowaniu zamówienia wraz z szacowanym czasem dostawy.',
    phoneCta: 'Lub zadzwoń: +48 664 454 433',
    telegramEmpty: 'Koszyk pusty',
    telegramNew: 'Nowe zamówienie!',
    telegramName: 'Imię',
    telegramPhone: 'Tel',
    telegramCart: 'Koszyk',
    telegramTotal: 'Razem',
    alertOk: 'Dziękujemy! Oddzwonimy w ciągu 5 minut.',
    alertError: 'Wystąpił błąd. Prosimy o kontakt telefoniczny.',
    alertNetwork: 'Błąd połączenia. Spróbuj później.',
    errorEndpoint404:
      'Brak endpointu zamówień. Uruchom projekt przez npm run dev (Netlify Dev) albo opublikuj stronę na Netlify.',
    errorServerConfig:
      'Błąd konfiguracji serwera: ustaw TELEGRAM_BOT_TOKEN i TELEGRAM_CHAT_ID w Netlify (Environment variables).',
    errorTelegram:
      'Nie udało się wysłać wiadomości do Telegrama. Sprawdź token bota i chat_id.',
    errorPrivacy: 'Zaznacz zgodę na przetwarzanie danych (wymagane).',
    errorInvalidEmail: 'Podaj prawidłowy adres e-mail.'
  },
  footer: {
    logoAlt: 'Logo Sushi Love'
  },
  lang: {
    pl: 'PL',
    en: 'EN',
    uk: 'UA',
    label: 'Język'
  }
};

const en = {
  categories: categories.en,
  nav: {
    mainAria: 'Main navigation',
    cart: 'Cart'
  },
  home: {
    menuTitle: 'Menu',
    addToCart: 'Add to cart',
    cartHintBefore: 'To complete your order, go to the',
    cartHintLink: 'cart',
    contactTitle: 'Order & Contact',
    contactSubtitle: 'Call or message us',
    contactDesc: 'We are available every day during business hours',
    orderFormHint: 'Order form with cart:',
    orderFormLink: 'cart page',
    mapTitle: 'Find us',
    mapIframeTitle: 'Sushi Love location'
  },
  cart: {
    back: '← Back to menu',
    title: 'Cart',
    orderSummary: 'Your order',
    clear: 'Clear',
    empty: 'Your cart is empty.',
    toMenu: 'Browse menu',
    total: 'Total:',
    checkoutTitle: 'Contact details',
    checkoutDesc:
      'Leave your contact details — we will call to confirm. We will email confirmation after the restaurant accepts your order.',
    deliveryTypeLabel: 'Order type',
    deliveryTypeDelivery: 'Delivery',
    deliveryTypePickup: 'Pickup',
    paymentLabel: 'Payment',
    paymentCard: 'Card',
    paymentCash: 'Cash',
    timeModeLabel: 'Time',
    timeModeAsap: 'As soon as possible',
    timeModeScheduled: 'Specific time',
    timeScheduledPlaceholder: 'Time (e.g. 19:30)',
    emailPlaceholder: 'Email (for order confirmation)',
    privacyCheckbox:
      'I accept processing of personal data necessary to fulfil this order (GDPR).',
    namePlaceholder: 'Your name',
    phonePlaceholder: 'Phone number',
    addressPlaceholder: 'Delivery address',
    commentPlaceholder: 'Order comment (optional)',
    submit: 'Send order',
    submitting: 'Sending...',
    successTitle: 'Thank you! Your order has been sent.',
    successEmailHint:
      'We will email you a confirmation after the restaurant accepts the order, including an estimated delivery time.',
    phoneCta: 'Or call us: +48 664 454 433',
    telegramEmpty: 'Cart empty',
    telegramNew: 'New order!',
    telegramName: 'Name',
    telegramPhone: 'Phone',
    telegramCart: 'Cart',
    telegramTotal: 'Total',
    alertOk: 'Thank you! We will call you back within 5 minutes.',
    alertError: 'Something went wrong. Please call us.',
    alertNetwork: 'Connection error. Please try again later.',
    errorEndpoint404:
      'Order endpoint not found. Run npm run dev (Netlify Dev) or deploy the site to Netlify.',
    errorServerConfig:
      'Server misconfiguration: set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in Netlify Environment variables.',
    errorTelegram:
      'Could not send the message to Telegram. Check the bot token and chat_id.',
    errorPrivacy: 'Please accept the privacy / data processing consent.',
    errorInvalidEmail: 'Please enter a valid email address.'
  },
  footer: {
    logoAlt: 'Sushi Love logo'
  },
  lang: {
    pl: 'PL',
    en: 'EN',
    uk: 'UA',
    label: 'Language'
  }
};

const uk = {
  categories: categories.uk,
  nav: {
    mainAria: 'Головна навігація',
    cart: 'Кошик'
  },
  home: {
    menuTitle: 'Меню',
    addToCart: 'У кошик',
    cartHintBefore: 'Щоб оформити замовлення, перейдіть до',
    cartHintLink: 'кошика',
    contactTitle: 'Замовлення та контакти',
    contactSubtitle: 'Подзвоніть або напишіть',
    contactDesc: 'Ми на зв’язку щодня в робочий час',
    orderFormHint: 'Форма замовлення з кошиком:',
    orderFormLink: 'сторінка кошика',
    mapTitle: 'Як нас знайти',
    mapIframeTitle: 'Локація Sushi Love'
  },
  cart: {
    back: '← Назад до меню',
    title: 'Кошик',
    orderSummary: 'Ваше замовлення',
    clear: 'Очистити',
    empty: 'Кошик порожній.',
    toMenu: 'До меню',
    total: 'Разом:',
    checkoutTitle: 'Контактні дані',
    checkoutDesc:
      'Залиште контакти — передзвонимо для підтвердження. На email надішлемо підтвердження після прийняття замовлення закладом.',
    deliveryTypeLabel: 'Тип замовлення',
    deliveryTypeDelivery: 'Доставка',
    deliveryTypePickup: 'Самовивіз',
    paymentLabel: 'Оплата',
    paymentCard: 'Карта',
    paymentCash: 'Готівка',
    timeModeLabel: 'Час',
    timeModeAsap: 'Якомога швидше',
    timeModeScheduled: 'Конкретний час',
    timeScheduledPlaceholder: 'Час (наприклад, 19:30)',
    emailPlaceholder: 'Email (для підтвердження замовлення)',
    privacyCheckbox:
      'Погоджуюсь на обробку персональних даних, необхідну для виконання замовлення (GDPR/RODO).',
    namePlaceholder: 'Ваше ім’я',
    phonePlaceholder: 'Номер телефону',
    addressPlaceholder: 'Адреса доставки',
    commentPlaceholder: 'Коментар до замовлення (необовʼязково)',
    submit: 'Надіслати замовлення',
    submitting: 'Надсилаємо...',
    successTitle: 'Дякуємо! Замовлення надіслано.',
    successEmailHint:
      'На вказаний email надішлемо підтвердження після прийняття замовлення та орієнтовний час доставки.',
    phoneCta: 'Або зателефонуйте: +48 664 454 433',
    telegramEmpty: 'Кошик порожній',
    telegramNew: 'Нове замовлення!',
    telegramName: 'Ім’я',
    telegramPhone: 'Тел',
    telegramCart: 'Кошик',
    telegramTotal: 'Разом',
    alertOk: 'Дякуємо! Ми передзвонимо протягом 5 хвилин.',
    alertError: 'Сталася помилка. Будь ласка, зателефонуйте нам.',
    alertNetwork: 'Помилка з’єднання. Спробуйте пізніше.',
    errorEndpoint404:
      'Не знайдено адресу для замовлень. Запусти npm run dev (Netlify Dev) або задеплой сайт на Netlify.',
    errorServerConfig:
      'Налаштування сервера: додай TELEGRAM_BOT_TOKEN і TELEGRAM_CHAT_ID у Netlify (Environment variables).',
    errorTelegram:
      'Не вдалося надіслати в Telegram. Перевір токен бота та chat_id.',
    errorPrivacy: 'Потрібна згода на обробку даних.',
    errorInvalidEmail: 'Вкажи коректний email.'
  },
  footer: {
    logoAlt: 'Логотип Sushi Love'
  },
  lang: {
    pl: 'PL',
    en: 'EN',
    uk: 'UA',
    label: 'Мова'
  }
};

export const translations = { pl, en, uk };

export const LANGS = ['pl', 'en', 'uk'];
