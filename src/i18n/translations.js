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
    checkoutDesc: 'Zostaw numer — oddzwonimy, aby potwierdzić zamówienie.',
    namePlaceholder: 'Twoje imię',
    phonePlaceholder: 'Numer telefonu',
    submit: 'Wyślij zamówienie',
    telegramEmpty: 'Koszyk pusty',
    telegramNew: 'Nowe zamówienie!',
    telegramName: 'Imię',
    telegramPhone: 'Tel',
    telegramCart: 'Koszyk',
    telegramTotal: 'Razem',
    alertOk: 'Dziękujemy! Oddzwonimy w ciągu 5 minut.',
    alertError: 'Wystąpił błąd. Prosimy o kontakt telefoniczny.',
    alertNetwork: 'Błąd połączenia. Spróbuj później.'
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
    checkoutDesc: 'Leave your number — we will call back to confirm your order.',
    namePlaceholder: 'Your name',
    phonePlaceholder: 'Phone number',
    submit: 'Send order',
    telegramEmpty: 'Cart empty',
    telegramNew: 'New order!',
    telegramName: 'Name',
    telegramPhone: 'Phone',
    telegramCart: 'Cart',
    telegramTotal: 'Total',
    alertOk: 'Thank you! We will call you back within 5 minutes.',
    alertError: 'Something went wrong. Please call us.',
    alertNetwork: 'Connection error. Please try again later.'
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
    checkoutDesc: 'Залиште номер — передзвонимо для підтвердження замовлення.',
    namePlaceholder: 'Ваше ім’я',
    phonePlaceholder: 'Номер телефону',
    submit: 'Надіслати замовлення',
    telegramEmpty: 'Кошик порожній',
    telegramNew: 'Нове замовлення!',
    telegramName: 'Ім’я',
    telegramPhone: 'Тел',
    telegramCart: 'Кошик',
    telegramTotal: 'Разом',
    alertOk: 'Дякуємо! Ми передзвонимо протягом 5 хвилин.',
    alertError: 'Сталася помилка. Будь ласка, зателефонуйте нам.',
    alertNetwork: 'Помилка з’єднання. Спробуйте пізніше.'
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
