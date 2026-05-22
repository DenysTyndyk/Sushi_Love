const categories = {
  pl: {
    Zestawy: 'Zestawy',
    Futomak: 'Futomak',
    Philadelphia: 'Philadelphia',
    Kalifornia: 'Kalifornia',
    Uramak: 'Uramak',
    Hosomak: 'Hosomak',
    'Premium rolki': 'Premium rolki',
    'Sushi Burger': 'Sushi Burger',
    Nigiri: 'Nigiri',
    'Przystawki / Inne': 'Przystawki / Inne',
    Napoje: 'Napoje'
  },
  en: {
    Zestawy: 'Sets',
    Futomak: 'Futomaki',
    Philadelphia: 'Philadelphia',
    Kalifornia: 'California',
    Uramak: 'Uramaki',
    Hosomak: 'Hosomaki',
    'Premium rolki': 'Premium rolls',
    'Sushi Burger': 'Sushi burger',
    Nigiri: 'Nigiri',
    'Przystawki / Inne': 'Starters / Other',
    Napoje: 'Drinks'
  },
  uk: {
    Zestawy: 'Сети',
    Futomak: 'Футомакі',
    Philadelphia: 'Філадельфія',
    Kalifornia: 'Каліфорнія',
    Uramak: 'Урамакі',
    Hosomak: 'Хосомакі',
    'Premium rolki': 'Преміум роли',
    'Sushi Burger': 'Суші-бургер',
    Nigiri: 'Нігірі',
    'Przystawki / Inne': 'Закуски / Інше',
    Napoje: 'Напої'
  }
};

const pl = {
  categories: categories.pl,
  nav: {
    mainAria: 'Główna nawigacja',
    cart: 'Koszyk'
  },
  home: {
    h1Title: 'Sushi Love — Sushi w Częstochowie',
    menuTitle: 'Karta Menu',
    addToCart: 'Do koszyka',
    cartHintBefore: 'Aby sfinalizować zamówienie, przejdź do',
    cartHintLink: 'koszyka',
    contactTitle: 'Zamówienie i Kontakt',
    contactSubtitle: 'Zadzwoń lub napisz',
    contactDesc: 'Jesteśmy dostępni codziennie w godzinach pracy',
    contactInstagram: '📷 Instagram',
    orderFormHint: 'Formularz zamówienia z koszykiem:',
    orderFormLink: 'strona koszyka',
    mapTitle: 'Znajdź nas',
    mapIframeTitle: 'Lokalizacja Sushi Love',
    drinksDepositNote:
      'Cena napojów nie zawiera kaucji zwrotnej w wysokości 0,59 zł',
    seoAboutSummary: 'Sushi Love — sushi Częstochowa',
    seoIntro: [
      'Najlepsze sushi w Częstochowie — na miejscu, na wynos i z dostawą (delivery). Aleja Najświętszej Maryi Panny 10.',
      'Menu online: zestawy, futomaki, philadelphia, kalifornia, uramaki, nigiri, sushi burger. Zamów przez koszyk lub zadzwoń +48 664 454 433.'
    ]
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
    cashAmountLabel: 'Z jakiej kwoty wydać resztę?',
    cashAmountPlaceholder: 'Kwota gotówki (np. 100)',
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
    extrasTitle: 'Dodatki (gratis)',
    extrasPortionsHint: 'Liczba porcji (0 = nie dodawać)',
    extraWasabi: 'Wasabi',
    extraChopsticks: 'Pałeczki',
    extraSoy: 'Sos sojowy',
    extraGinger: 'Imbir',
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
    errorInvalidEmail: 'Podaj prawidłowy adres e-mail.',
    errorCashAmount: 'Podaj kwotę gotówki od klienta.',
    errorCashAmountMin: 'Kwota gotówki musi być nie mniejsza niż suma zamówienia.',
    errorAddressRequired: 'Podaj adres dostawy.',
    errorTimeRequired: 'Podaj godzinę realizacji zamówienia.',
    errorInvalidPayload: 'Uzupełnij wszystkie wymagane pola zamówienia.'
  },
  footer: {
    logoAlt: 'Logo Sushi Love',
    navAria: 'Stopka — nawigacja',
    navMenu: 'Menu',
    navCart: 'Koszyk',
    navContact: 'Kontakt',
    navMap: 'Mapa'
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
    h1Title: 'Sushi Love — Sushi in Częstochowa',
    menuTitle: 'Menu',
    addToCart: 'Add to cart',
    cartHintBefore: 'To complete your order, go to the',
    cartHintLink: 'cart',
    contactTitle: 'Order & Contact',
    contactSubtitle: 'Call or message us',
    contactDesc: 'We are available every day during business hours',
    contactInstagram: '📷 Instagram',
    orderFormHint: 'Order form with cart:',
    orderFormLink: 'cart page',
    mapTitle: 'Find us',
    mapIframeTitle: 'Sushi Love location',
    drinksDepositNote:
      'Drink prices do not include a returnable deposit of PLN 0.59',
    seoAboutSummary: 'Sushi Love — sushi Częstochowa',
    seoIntro: [
      'The best sushi in Częstochowa — dine in, takeaway and delivery. Aleja Najświętszej Maryi Panny 10.',
      'Online menu: sets, futomaki, philadelphia, california, uramaki, nigiri, sushi burger. Order via cart or call +48 664 454 433.'
    ]
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
    cashAmountLabel: 'Cash amount (for change)',
    cashAmountPlaceholder: 'Cash you will pay (e.g. 100)',
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
    extrasTitle: 'Extras (free)',
    extrasPortionsHint: 'Number of portions (0 = none)',
    extraWasabi: 'Wasabi',
    extraChopsticks: 'Chopsticks',
    extraSoy: 'Soy sauce',
    extraGinger: 'Ginger',
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
    errorInvalidEmail: 'Please enter a valid email address.',
    errorCashAmount: 'Enter the cash amount you will pay.',
    errorCashAmountMin: 'Cash amount must be at least the order total.',
    errorAddressRequired: 'Please enter a delivery address.',
    errorTimeRequired: 'Please enter the preferred time.',
    errorInvalidPayload: 'Please fill in all required order fields.'
  },
  footer: {
    logoAlt: 'Sushi Love logo',
    navAria: 'Footer navigation',
    navMenu: 'Menu',
    navCart: 'Cart',
    navContact: 'Contact',
    navMap: 'Map'
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
    h1Title: 'Sushi Love — Суші в Ченстохові',
    menuTitle: 'Меню',
    addToCart: 'У кошик',
    cartHintBefore: 'Щоб оформити замовлення, перейдіть до',
    cartHintLink: 'кошика',
    contactTitle: 'Замовлення та контакти',
    contactSubtitle: 'Подзвоніть або напишіть',
    contactDesc: 'Ми на зв’язку щодня в робочий час',
    contactInstagram: '📷 Instagram',
    orderFormHint: 'Форма замовлення з кошиком:',
    orderFormLink: 'сторінка кошика',
    mapTitle: 'Як нас знайти',
    mapIframeTitle: 'Локація Sushi Love',
    drinksDepositNote:
      'Ціни на напої не включають зворотний застав у розмірі 0,59 zł',
    seoAboutSummary: 'Sushi Love — суші Ченстохова',
    seoIntro: [
      'Суші в Ченстохові — у закладі, на винос і з доставкою. Aleja Najświętszej Maryi Panny 10.',
      'Меню: сети, футомакі, філадельфія, каліфорнія, урамакі, нігірі, суші-бургер. Замовлення через кошик або +48 664 454 433.'
    ]
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
    cashAmountLabel: 'З якої суми дати решту?',
    cashAmountPlaceholder: 'Сума готівкою (напр. 100)',
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
    extrasTitle: 'Додатково (безкоштовно)',
    extrasPortionsHint: 'Кількість порцій (0 = не додавати)',
    extraWasabi: 'Васабі',
    extraChopsticks: 'Палички',
    extraSoy: 'Соєвий соус',
    extraGinger: 'Імбир',
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
    errorInvalidEmail: 'Вкажи коректний email.',
    errorCashAmount: 'Вкажи суму готівкою.',
    errorCashAmountMin: 'Сума готівкою не може бути меншою за суму замовлення.',
    errorAddressRequired: 'Вкажи адресу доставки.',
    errorTimeRequired: 'Вкажи бажаний час замовлення.',
    errorInvalidPayload: 'Заповни всі обовʼязкові поля замовлення.'
  },
  footer: {
    logoAlt: 'Логотип Sushi Love',
    navAria: 'Навігація в підвалі',
    navMenu: 'Меню',
    navCart: 'Кошик',
    navContact: 'Контакти',
    navMap: 'Карта'
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
