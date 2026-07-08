const categories = {
  pl: {
    Zestawy: 'Zestawy',
    Futomak: 'Futomak',
    'Futomak z serową czapeczką': 'Futomak z serową czapeczką',
    Philadelphia: 'Philadelphia',
    Kalifornia: 'Kalifornia',
    Uramak: 'Uramak',
    Hosomak: 'Hosomak',
    'Premium rolki': 'Premium rolki',
    'Sushi Burger': 'Sushi Burger',
    Nigiri: 'Nigiri',
    'Przystawki / Inne': 'Przystawki / Inne',
    Desery: 'Desery',
    Napoje: 'Napoje'
  },
  en: {
    Zestawy: 'Sets',
    Futomak: 'Futomaki',
    'Futomak z serową czapeczką': 'Cheese cap futomaki',
    Philadelphia: 'Philadelphia',
    Kalifornia: 'California',
    Uramak: 'Uramaki',
    Hosomak: 'Hosomaki',
    'Premium rolki': 'Premium rolls',
    'Sushi Burger': 'Sushi burger',
    Nigiri: 'Nigiri',
    'Przystawki / Inne': 'Starters / Other',
    Desery: 'Desserts',
    Napoje: 'Drinks'
  },
  uk: {
    Zestawy: 'Сети',
    Futomak: 'Футомакі',
    'Futomak z serową czapeczką': 'Футомак із сирною шапкою',
    Philadelphia: 'Філадельфія',
    Kalifornia: 'Каліфорнія',
    Uramak: 'Урамакі',
    Hosomak: 'Хосомакі',
    'Premium rolki': 'Преміум роли',
    'Sushi Burger': 'Суші-бургер',
    Nigiri: 'Нігірі',
    'Przystawki / Inne': 'Закуски / Інше',
    Desery: 'Десерти',
    Napoje: 'Напої'
  }
};

const categorySectionTitles = {
  pl: { Hosomak: 'Hosomak 6 szt' },
  en: { Hosomak: 'Hosomaki 6 pcs' },
  uk: { Hosomak: 'Хосомакі 6 шт' }
};

const pl = {
  categories: categories.pl,
  categorySectionTitles: categorySectionTitles.pl,
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
    hoursTitle: 'Godziny otwarcia',
    hours: [
      { day: 'Poniedziałek', time: '12:00 – 21:00' },
      { day: 'Wtorek', time: '12:00 – 21:00' },
      { day: 'Środa', time: '12:00 – 21:00' },
      { day: 'Czwartek', time: '12:00 – 21:00' },
      { day: 'Piątek', time: '11:00 – 22:00' },
      { day: 'Sobota', time: '11:00 – 22:00' },
      { day: 'Niedziela', time: '12:00 – 21:00' }
    ],
    drinksDepositNote:
      'Cena napojów nie zawiera kaucji zwrotnej w wysokości 0,50 zł',
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
    subtotal: 'Produkty:',
    bottleDeposit: 'Kaucja za butelki (0,50 zł/szt.):',
    deliveryFee: 'Dostawa:',
    total: 'Do zapłaty:',
    checkoutTitle: 'Dane kontaktowe',
    checkoutDesc:
      'Podaj dane kontaktowe — oddzwonimy w celu potwierdzenia. Na e-mail wyślemy potwierdzenie po akceptacji zamówienia przez restaurację.',
    deliveryTypeLabel: 'Sposób odbioru',
    deliveryTypeDelivery: 'Dostawa',
    deliveryTypePickup: 'Odbiór osobisty',
    deliveryMinimumHint: 'Minimalna suma dla dostawy to 80 PLN.',
    paymentLabel: 'Płatność',
    paymentCard: 'Karta',
    paymentCash: 'Gotówka',
    cashAmountLabel: 'Z jakiej kwoty wydać resztę?',
    cashAmountPlaceholder: 'Kwota gotówki (np. 100)',
    timeModeLabel: 'Czas realizacji',
    timeModeAsap: 'Jak najszybciej',
    timeModeScheduled: 'Konkretny termin',
    timeScheduledDateLabel: 'Dzień realizacji',
    timeScheduledTimeLabel: 'Godzina',
    timeScheduledPlaceholder: '13:00–20:00 (np. 19:30)',
    timeCallBanner:
      'Dla dostawy po godzinie 20:00 zadzwoń — potwierdzimy, czy możemy zrealizować zamówienie:',
    emailPlaceholder: 'E-mail (do potwierdzenia zamówienia)',
    privacyCheckbox:
      'Akceptuję przetwarzanie danych osobowych niezbędne do realizacji zamówienia (RODO).',
    namePlaceholder: 'Twoje imię',
    phonePlaceholder: 'Numer telefonu',
    addressPlaceholder: 'Adres dostawy',
    streetNumberPlaceholder: 'Numer budynku',
    apartmentNumberPlaceholder: 'Numer mieszkania (opcjonalnie)',
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
      'Na podany adres e-mail wyślemy potwierdzenie po zaakceptowaniu zamówienia wraz z szacowanym czasem realizacji. Jeśli w ciągu 10 minut nie otrzymasz wiadomości, prosimy o kontakt telefoniczny.',
    successEmailSpamHint:
      'Jeśli nie widzisz wiadomości, sprawdź poprawność podanego adresu e-mail oraz folder spam lub oferty.',
    phoneCta: 'Zadzwoń: +48 664 454 433',
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
    errorTimeDateRequired: 'Wybierz dzień realizacji zamówienia.',
    errorTimeOutOfRange:
      'Wybierz poprawny dzień i godzinę (13:00–20:00 online, w godzinach otwarcia restauracji).',
    errorTimeCallRequired:
      'Dla godziny po 20:00 zadzwoń, aby potwierdzić zamówienie.',
    closedBanner:
      'Zamówienia online są możliwe tylko w godzinach otwarcia (pn–cz i nd 12:00–21:00, pt–sb 11:00–22:00). Teraz restauracja jest zamknięta.',
    errorRestaurantClosed:
      'Restauracja jest teraz zamknięta. Zamówienia online przyjmujemy tylko w godzinach otwarcia.',
    errorInvalidPayload: 'Uzupełnij wszystkie wymagane pola zamówienia.',
    errorCartPricing:
      'Ceny w koszyku nie zgadzają się z menu. Odśwież stronę i spróbuj ponownie.',
    errorDeliveryMinimum: 'Minimalna suma dla dostawy to 80 PLN.'
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
  categorySectionTitles: categorySectionTitles.en,
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
    hoursTitle: 'Opening hours',
    hours: [
      { day: 'Monday', time: '12:00 – 21:00' },
      { day: 'Tuesday', time: '12:00 – 21:00' },
      { day: 'Wednesday', time: '12:00 – 21:00' },
      { day: 'Thursday', time: '12:00 – 21:00' },
      { day: 'Friday', time: '11:00 – 22:00' },
      { day: 'Saturday', time: '11:00 – 22:00' },
      { day: 'Sunday', time: '12:00 – 21:00' }
    ],
    drinksDepositNote:
      'Drink prices do not include a returnable deposit of PLN 0.50',
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
    subtotal: 'Items:',
    bottleDeposit: 'Bottle deposit (PLN 0.50 each):',
    deliveryFee: 'Delivery:',
    total: 'Total due:',
    checkoutTitle: 'Contact details',
    checkoutDesc:
      'Leave your contact details — we will call to confirm. We will email confirmation after the restaurant accepts your order.',
    deliveryTypeLabel: 'Order type',
    deliveryTypeDelivery: 'Delivery',
    deliveryTypePickup: 'Pickup',
    deliveryMinimumHint: 'Minimum order for delivery is 80 PLN.',
    paymentLabel: 'Payment',
    paymentCard: 'Card',
    paymentCash: 'Cash',
    cashAmountLabel: 'Cash amount (for change)',
    cashAmountPlaceholder: 'Cash you will pay (e.g. 100)',
    timeModeLabel: 'Time',
    timeModeAsap: 'As soon as possible',
    timeModeScheduled: 'Specific date & time',
    timeScheduledDateLabel: 'Date',
    timeScheduledTimeLabel: 'Time',
    timeScheduledPlaceholder: '13:00–20:00 (e.g. 19:30)',
    timeCallBanner:
      'For delivery after 8:00 PM, please call so we can confirm we can fulfil your order:',
    emailPlaceholder: 'Email (for order confirmation)',
    privacyCheckbox:
      'I accept processing of personal data necessary to fulfil this order (GDPR).',
    namePlaceholder: 'Your name',
    phonePlaceholder: 'Phone number',
    addressPlaceholder: 'Delivery address',
    streetNumberPlaceholder: 'Building number',
    apartmentNumberPlaceholder: 'Apartment number (optional)',
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
      'We will email you a confirmation after the restaurant accepts the order, including an estimated ready time. If you do not receive confirmation within 10 minutes, please call us.',
    successEmailSpamHint:
      'If you do not see the email, check that your address is correct and look in your spam or junk folder.',
    phoneCta: 'Call us: +48 664 454 433',
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
    errorTimeDateRequired: 'Please select the order date.',
    errorTimeOutOfRange:
      'Choose a valid date and time (1:00–8:00 PM online, within opening hours).',
    errorTimeCallRequired:
      'For times after 8:00 PM, please call to confirm your order.',
    closedBanner:
      'Online orders are only accepted during opening hours (Mon–Thu & Sun 12:00–9:00 PM, Fri–Sat 11:00 AM–10:00 PM). We are closed now.',
    errorRestaurantClosed:
      'The restaurant is closed now. Online orders are only accepted during opening hours.',
    errorInvalidPayload: 'Please fill in all required order fields.',
    errorCartPricing:
      'Cart prices do not match the menu. Refresh the page and try again.',
    errorDeliveryMinimum: 'Minimum order for delivery is 80 PLN.'
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
  categorySectionTitles: categorySectionTitles.uk,
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
    hoursTitle: 'Години роботи',
    hours: [
      { day: 'Понеділок', time: '12:00 – 21:00' },
      { day: 'Вівторок', time: '12:00 – 21:00' },
      { day: 'Середа', time: '12:00 – 21:00' },
      { day: 'Четвер', time: '12:00 – 21:00' },
      { day: "П'ятниця", time: '11:00 – 22:00' },
      { day: 'Субота', time: '11:00 – 22:00' },
      { day: 'Неділя', time: '12:00 – 21:00' }
    ],
    drinksDepositNote:
      'Ціни на напої не включають зворотний застав у розмірі 0,50 zł',
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
    subtotal: 'Продукти:',
    bottleDeposit: 'Застава за пляшки (0,50 zł/шт.):',
    deliveryFee: 'Доставка:',
    total: 'До сплати:',
    checkoutTitle: 'Контактні дані',
    checkoutDesc:
      'Залиште контакти — передзвонимо для підтвердження. На email надішлемо підтвердження після прийняття замовлення закладом.',
    deliveryTypeLabel: 'Тип замовлення',
    deliveryTypeDelivery: 'Доставка',
    deliveryTypePickup: 'Самовивіз',
    deliveryMinimumHint: 'Мінімальна сума для доставки — 80 PLN.',
    paymentLabel: 'Оплата',
    paymentCard: 'Карта',
    paymentCash: 'Готівка',
    cashAmountLabel: 'З якої суми дати решту?',
    cashAmountPlaceholder: 'Сума готівкою (напр. 100)',
    timeModeLabel: 'Час',
    timeModeAsap: 'Якомога швидше',
    timeModeScheduled: 'Конкретний день і час',
    timeScheduledDateLabel: 'День',
    timeScheduledTimeLabel: 'Година',
    timeScheduledPlaceholder: '13:00–20:00 (наприклад, 19:30)',
    timeCallBanner:
      'Для доставки після 20:00 зателефонуйте — підтвердимо, чи можемо виконати замовлення:',
    emailPlaceholder: 'Email (для підтвердження замовлення)',
    privacyCheckbox:
      'Погоджуюсь на обробку персональних даних, необхідну для виконання замовлення (GDPR/RODO).',
    namePlaceholder: 'Ваше ім’я',
    phonePlaceholder: 'Номер телефону',
    addressPlaceholder: 'Адреса доставки',
    streetNumberPlaceholder: 'Номер будинку',
    apartmentNumberPlaceholder: 'Номер квартири (необовʼязково)',
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
      'На вказаний email надішлемо підтвердження після прийняття замовлення та орієнтовний час готовності. Якщо протягом 10 хвилин підтвердження не надійде, просимо зателефонувати нам.',
    successEmailSpamHint:
      'Якщо листа немає — перевір правильність email і теку «Спам» або «Небажана пошта».',
    phoneCta: 'Телефон: +48 664 454 433',
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
    errorTimeDateRequired: 'Обери день замовлення.',
    errorTimeOutOfRange:
      'Обери коректний день і час (13:00–20:00 онлайн, у межах годин роботи).',
    errorTimeCallRequired:
      'Для часу після 20:00 зателефонуйте, щоб підтвердити замовлення.',
    closedBanner:
      'Онлайн-замовлення лише в години роботи (пн–чт і нд 12:00–21:00, пт–сб 11:00–22:00). Зараз ресторан закритий.',
    errorRestaurantClosed:
      'Зараз ресторан закритий. Онлайн-замовлення приймаємо лише в години роботи.',
    errorInvalidPayload: 'Заповни всі обовʼязкові поля замовлення.',
    errorCartPricing:
      'Ціни в кошику не збігаються з меню. Онови сторінку та спробуй ще раз.',
    errorDeliveryMinimum: 'Мінімальна сума для доставки — 80 PLN.'
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
