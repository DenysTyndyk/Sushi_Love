# Sushi Love — Częstochowa

Сайт ресторану [sushilove-czestochowa.pl](https://sushilove-czestochowa.pl): меню, кошик, оформлення замовлень у Telegram та листи клієнтам через Resend.

---

## Зміст

1. [Можливості](#можливості)
2. [Архітектура та потік замовлення](#архітектура-та-потік-замовлення)
3. [Стек](#стек)
4. [Вимоги](#вимоги)
5. [Локальна розробка](#локальна-розробка)
6. [Змінні середовища](#змінні-середовища)
7. [Тестування замовлень](#тестування-замовлень)
8. [Оновлення меню](#оновлення-меню)
9. [Інтернаціоналізація (UI)](#інтернаціоналізація-ui)
10. [Деплой на Netlify](#деплой-на-netlify)
11. [Налаштування Telegram-бота](#налаштування-telegram-бота)
12. [Налаштування Resend (email)](#налаштування-resend-email)
13. [Безпека](#безпека)
14. [Структура проєкту](#структура-проєкту)
15. [Скрипти npm](#скрипти-npm)
16. [Усунення проблем](#усунення-проблем)

---

## Можливості

- **Меню** з категоріями, фото та варіантами порцій (наприклад, креветки 6/9 шт.)
- **Три мови інтерфейсу та меню:** PL, EN, UK
- **Кошик** зі збереженням у `localStorage`
- **Оформлення замовлення:** доставка / самовивіз, готівка / картка, якнайшвидше або на конкретний час
- **Безкоштовні додатки:** васабі, палички, соєвий соус, імбир (кількість порцій)
- **Замовлення → Telegram:** повідомлення в чат з кнопками «Прийняти / Відхилити / ETA 45·60·90 хв»
- **Після прийняття** — лист клієнту на email через Resend
- **Авто-відхилення** — якщо адмін не натиснув «Прийняти» / «Відхилити» протягом 10 хв, замовлення скасовується автоматично (лист клієнту + оновлення в Telegram)
- **SEO / FOUC:** статичний fallback у `public/index.html`, клас `app-ready` після гідрації React

---

## Архітектура та потік замовлення

```
Клієнт (браузер)
    │
    │  POST /.netlify/functions/create-order
    ▼
create-order.js
    ├─ validateOrderPayload (shared TS → esbuild bundle)
    │     ├─ валідація полів форми
    │     └─ validateAndPriceCart — ціни з menuByLang.json (серверна перевірка)
    └─ sendOrderMessage → Telegram Bot API
              │
              ▼
        Чат персоналу (inline-кнопки)
              │
              │  POST /.netlify/functions/telegram-webhook  (callback від Telegram)
              ▼
        telegram-webhook.js
              ├─ перевірка secret token (якщо налаштовано)
              ├─ перевірка TELEGRAM_ADMIN_IDS (якщо налаштовано)
              ├─ оновлення повідомлення в Telegram
              └─ sendTransactionalEmail → Resend API

create-order також зберігає «очікуюче» замовлення в Netlify Blobs.
Якщо за 10 хв ніхто не натиснув «Прийняти» / «Відхилити», scheduled-функція
`expire-pending-orders` (кожну хвилину) автоматично відхиляє замовлення,
оновлює повідомлення в Telegram і надсилає лист клієнту (Resend).
```

**Важливо:** логіка валідації замовлення єдина для фронтенду та бекенду. Джерело правди — `src/shared/orderValidation.ts`, яке збирається в `netlify/functions/_shared/orderValidation.js` через esbuild (`npm run build:shared`).

---

## Стек

| Шар | Технологія |
|-----|------------|
| Frontend | React 18 (Create React App), TypeScript (частково), CSS |
| Хостинг | Netlify (статика + serverless functions) |
| Functions | `create-order`, `telegram-webhook`, `expire-pending-orders` (cron), `_shared/` |
| Інтеграції | Telegram Bot API, Resend |
| Меню | `scripts/build-menu.mjs` → `src/DaneMenu/menuByLang.json` |

---

## Вимоги

- **Node.js** 18+ (рекомендовано LTS)
- **npm** 9+
- Обліковий запис **Netlify** (деплой)
- **Telegram-бот** ([@BotFather](https://t.me/BotFather))
- **Resend** ([resend.com](https://resend.com)) — для листів клієнтам після прийняття замовлення

---

## Локальна розробка

### 1. Клонування та залежності

```bash
git clone <repo-url>
cd SushiLove
npm install
```

### 2. Локальні секрети

Створи файл **`.env`** у корені проєкту (він у `.gitignore` і **ніколи не комітиться**):

```env
# Мінімум для надсилання замовлень у Telegram:
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=

# Для webhook (кнопки Accept/Reject) та email — див. розділ «Змінні середовища»
```

> **Не додавай реальні ключі в Git, скріншоти, README чи чати.** Значення зберігай лише в `.env` локально та в Netlify → Site configuration → Environment variables.

### 3. Запуск (рекомендовано)

```bash
npm run dev
```

| Сервіс | URL / порт |
|--------|------------|
| React (CRA) | http://localhost:3000 |
| Netlify Functions | порт **9999** |
| Проксі | `src/setupProxy.js` перенаправляє `/.netlify/functions/*` → `:9999` |

### 4. Альтернативні команди

| Команда | Що запускає |
|---------|-------------|
| `npm run dev` | Frontend + functions (рекомендовано для замовлень) |
| `npm run dev:netlify` | Netlify CLI dev на `:8888` (єдиний порт для всього) |
| `npm start` | Тільки React — **functions не працюють**, замовлення дадуть 404 |

### 5. Docker (опційно)

`Dockerfile` і `docker-compose.yml` запускають лише `npm start` (frontend без functions). Для повного локального тесту замовлень використовуй `npm run dev`.

---

## Змінні середовища

Усі секрети задаються **тільки** через:
- локальний файл `.env` (розробка)
- **Netlify → Environment variables** (production / preview)

Нижче — **назви** змінних і призначення. Конкретні значення отримуй у відповідних сервісах (BotFather, Resend dashboard, Netlify UI).

### Обов'язкові для замовлень (Telegram)

| Змінна | Призначення |
|--------|-------------|
| `TELEGRAM_BOT_TOKEN` | Токен бота від [@BotFather](https://t.me/BotFather) |
| `TELEGRAM_CHAT_ID` | ID чату або групи, куди надходять замовлення |

### Рекомендовані (безпека webhook)

| Змінна | Призначення |
|--------|-------------|
| `TELEGRAM_WEBHOOK_SECRET` | Довільний секретний рядок; Telegram надсилає його в заголовку `X-Telegram-Bot-Api-Secret-Token`. **Настійно рекомендується в production.** |
| `TELEGRAM_ADMIN_IDS` | Список Telegram user ID через кому — хто може натискати кнопки Accept/Reject/ETA. Якщо не задано, обмеження не застосовується. |

### Email (Resend)

| Змінна | Призначення |
|--------|-------------|
| `RESEND_API_KEY` | API-ключ з [Resend dashboard](https://resend.com) |
| `RESEND_FROM` | Відправник у форматі `Ім'я <email@verified-domain>` — домен має бути верифікований у Resend |

### Опційні

| Змінна | Призначення |
|--------|-------------|
| `RESEND_SUBJECT_CONFIRMED` | Тема листа «замовлення прийнято» |
| `RESEND_SUBJECT_REJECTED` | Тема листа «замовлення відхилено» |
| `TELEGRAM_API_BASE` | Базовий URL Telegram API (за замовчуванням офіційний; для нестандартних середовищ) |
| `ORDER_PENDING_TIMEOUT_MINUTES` | Через скільки хвилин без реакції адміна замовлення авто-відхиляється (за замовчуванням **10**). Для тесту локально постав **1** у `.env` і **перезапусти** `npm run dev`. |
| `REACT_APP_ORDER_ENDPOINT` | URL endpoint замовлень для CRA (за замовчуванням `/.netlify/functions/create-order`) |
| `REACT_APP_CART_STORAGE_KEY` | Ключ `localStorage` для кошика |
| `REACT_APP_LANGUAGE_STORAGE_KEY` | Ключ `localStorage` для мови |

### Production: Resend

Після зміни env-змінних на Netlify потрібен **redeploy**, інакше functions продовжать працювати зі старими значеннями.

`RESEND_FROM` у production має використовувати **верифікований домен ресторану**, а не тестову адресу Resend.

---

## Тестування замовлень

### Що можна перевірити локально (`npm run dev`)

| Сценарій | Працює локально? |
|----------|------------------|
| Перегляд меню, кошик, форма | Так |
| Надсилання замовлення в Telegram | Так — якщо в `.env` задані `TELEGRAM_BOT_TOKEN` і `TELEGRAM_CHAT_ID` |
| Серверна перевірка цін | Так — function використовує той самий bundle з меню |
| Кнопки Accept/Reject у Telegram | **Ні** — потрібен публічний HTTPS URL для webhook |
| Email клієнту через Resend | Лише якщо webhook доступний з інтернету (деплой або тунель) |

### Що потребує деплою (або тунелю)

Telegram надсилає callback лише на **публічний HTTPS** endpoint:

```
https://<YOUR_DOMAIN>/.netlify/functions/telegram-webhook
```

Для локальної відладки webhook можна використати ngrok / Cloudflare Tunnel, але для постійної роботи достатньо деплою на Netlify.

### Швидка перевірка валідації цін (без Telegram)

Після змін у `src/shared/`:

```bash
npm run build:shared
node -e "const { validateOrderPayload } = require('./netlify/functions/_shared/orderValidation'); console.log(validateOrderPayload({ name:'T', phone:'1', email:'a@b.com', privacyAccepted:true, orderType:'pickup', paymentMethod:'card', cart:[{id:'set-1',quantity:1,price:0.01}], total:0.01 }));"
```

Очікуваний результат: `{ ok: false, error: 'Cart items or total do not match menu prices' }`.

---

## Оновлення меню

**Не редагуй `menuByLang.json` вручну** — файл генерується скриптом.

### Кроки

1. **Позиції та ціни (PL)** — `scripts/build-menu.mjs`
2. **Переклади назв/описів (EN, UK)** — `scripts/menu-i18n.mjs`
3. **Зображення** — `public/imgs/` (набори → `sets_img/`, напої → `drinks/`, тощо)
4. **Згенерувати JSON:**

```bash
node scripts/build-menu.mjs
```

5. **Hero-зображення категорії** (одне на вкладку) — `CATEGORY_IMAGES` у `src/DaneMenu/menuUtils.ts`
6. **Назви вкладок / секцій у UI** — `src/i18n/translations.js` (ключі `categoryTabs`, `categorySectionTitles`)

### Варіанти порцій

Позиції з `variantOptions` (наприклад, 6/9 шт.) в кошику мають id виду:

```
<item-id>__<variant-key>
```

Приклад: `shrimp-panko__6`. Серверна валідація перевіряє і id, і варіант.

### Після зміни цін

1. Запусти `node scripts/build-menu.mjs`
2. Закоміть зміни в `scripts/` та `src/DaneMenu/menuByLang.json`
3. Задеплой — serverless function включає актуальне меню в bundle (`build:shared`)

Клієнти зі старою сторінкою в браузері побачать помилку «онови сторінку», якщо їхній `total` не збігається з новими цінами.

---

## Інтернаціоналізація (UI)

| Файл | Що містить |
|------|------------|
| `src/i18n/translations.js` | Тексти інтерфейсу (кошик, footer, помилки форми) |
| `scripts/menu-i18n.mjs` | Переклади позицій меню |
| `src/context/LanguageContext.js` | Поточна мова, `localStorage`, хелпери `t()`, `categorySectionTitle()` |

Мова за замовчуванням: **PL**. Перемикач — компонент `LanguageSwitcher`.

---

## Деплой на Netlify

### Автоматичний (рекомендовано)

1. Підключи репозиторій до Netlify
2. Build command: `npm run build` (вже в `netlify.toml`)
3. Publish directory: `build`
4. Functions directory: `netlify/functions`
5. Задай env-змінні в Netlify UI (див. розділ вище)
6. Push у гілку, з якої йде deploy (наприклад, `main`)

### Ручний деплой

```bash
npm run build
npx netlify-cli deploy --prod
```

Потрібен `netlify login` і прив'язка сайту (`netlify link`).

### SPA-маршрутизація

`public/_redirects`:

```
/*    /index.html   200
```

Усі шляхи (`/`, `/koszyk`) обслуговує `index.html`.

---

## Налаштування Telegram-бота

### 1. Створення бота

1. Напиши [@BotFather](https://t.me/BotFather) → `/newbot`
2. Збережи **токен** у Netlify env як `TELEGRAM_BOT_TOKEN` (не в репозиторій)

### 2. Chat ID для замовлень

1. Додай бота в групу / канал або пиши йому напряму
2. Дізнайся `chat_id` (через [@userinfobot](https://t.me/userinfobot), getUpdates API або інший спосіб)
3. Збережи як `TELEGRAM_CHAT_ID`

### 3. Webhook (кнопки в повідомленнях)

Після деплою зареєструй webhook. **Підстав свої значення** — не публікуй їх у Git:

```bash
curl "https://api.telegram.org/bot<BOT_TOKEN>/setWebhook?url=https://<YOUR_DOMAIN>/.netlify/functions/telegram-webhook&secret_token=<WEBHOOK_SECRET>"
```

- `<BOT_TOKEN>` — значення `TELEGRAM_BOT_TOKEN`
- `<YOUR_DOMAIN>` — наприклад, `sushilove-czestochowa.pl`
- `<WEBHOOK_SECRET>` — довільний рядок; той самий має бути в `TELEGRAM_WEBHOOK_SECRET` на Netlify

Перевірка:

```bash
curl "https://api.telegram.org/bot<BOT_TOKEN>/getWebhookInfo"
```

### 4. Admin IDs (опційно)

Telegram user ID адмінів через кому в `TELEGRAM_ADMIN_IDS`. Інші користувачі не зможуть натискати callback-кнопки.

---

## Налаштування Resend (email)

1. Зареєструйся на [resend.com](https://resend.com)
2. Верифікуй домен ресторану (DNS-записи в панелі Resend)
3. Створи API key → `RESEND_API_KEY` на Netlify
4. Задай `RESEND_FROM`, наприклад: `Sushi Love <orders@your-verified-domain>`

Email надсилається **після натискання Accept/Reject** у Telegram (через webhook). Якщо Resend не налаштовано, замовлення в Telegram все одно працюють — лист просто пропускається (лог: `skipped`).

---

## Безпека

### Що вже реалізовано

| Область | Реалізація |
|---------|------------|
| Секрети | Тільки env-змінні; `.env` у `.gitignore` |
| Серверна валідація | Поля форми + **перерахунок цін з меню** (`menuCatalog.ts`) |
| Підробка цін | Клієнт не може надіслати довільний `total` — сервер порівнює з каталогом |
| Webhook | Перевірка `X-Telegram-Bot-Api-Secret-Token`, якщо задано `TELEGRAM_WEBHOOK_SECRET` |
| Адмін-дії | Обмеження за `TELEGRAM_ADMIN_IDS` (опційно) |
| XSS | React без `dangerouslySetInnerHTML`; Telegram отримує plain text |
| Помилки API | Клієнту — загальні повідомлення, без stack trace |
| PII у логах | Структуровані JSON-логи; email логуються обережно (домен, не повний адрес у create-order) |
| HTTP-заголовки | `public/_headers` — CSP, HSTS, Referrer-Policy, X-Frame-Options, nosniff (Netlify) |

### Рекомендації для production

1. **Завжди** задай `TELEGRAM_WEBHOOK_SECRET` на Netlify
2. **Задай** `TELEGRAM_ADMIN_IDS` для обмеження callback-кнопок
3. **Не коміть** `.env`, токени, chat ID, API keys
4. **Не вставляй** реальні секрети в README, issues, PR, скріншоти Netlify UI
5. Після зміни env — **redeploy**
6. Оновлюй залежності періодично (`npm audit`; більшість попереджень — dev-залежності CRA)

### Обмеження (відомі)

- **Rate limiting** на `create-order` немає — можливий spam у Telegram (розглянути Netlify / Cloudflare rate limits)
- **Webhook без secret** — якщо змінна не задана, endpoint приймає POST без перевірки токена
- **Dockerfile** — лише frontend; не використовуй для production backend

---

## Структура проєкту

```
public/
  index.html          SEO fallback, critical CSS (app-ready)
  _redirects          SPA → index.html
  _headers            security headers (CSP, HSTS, …) для Netlify
  imgs/               фото меню, banner, logo

src/
  pages/
    HomePage.js       меню, категорії, додавання в кошик
    CartPage.tsx      кошик, форма замовлення
  components/
    Footer.js         навігація (NavLink + hash)
    menu/             MenuTabs, MenuList, MenuItemRow, CategoryHero
    LanguageSwitcher.js
  context/
    CartContext.tsx   кошик + localStorage
    LanguageContext.js
    AppRouterContext.js   / та /koszyk, hash-скрол (#menu, #contact)
  shared/
    orderValidation.ts    валідація замовлення (shared front + back)
    menuCatalog.ts        lookup цін з menuByLang.json
  DaneMenu/
    menuByLang.json       згенероване меню (PL / EN / UK)
    menuUtils.ts          пошук позицій, hero-зображення категорій
  i18n/
    translations.js     UI-тексти
  setupProxy.js         dev: proxy functions → :9999
  types/
    index.ts            TypeScript-типи

netlify/
  functions/
    create-order.js           POST — нове замовлення → Telegram
    telegram-webhook.js       POST — callback кнопок → email
    constants.js              маркери в тексті повідомлень
    _shared/
      orderValidation.js      bundle з src/shared/ (esbuild)
      orderTelegram.js        форматування та sendMessage
      telegram.js             Telegram API helpers
      resend.js               відправка email
      customerEmail.js        шаблони листів
      log.js                  структуроване логування

scripts/
  build-menu.mjs        генерація menuByLang.json
  menu-i18n.mjs         переклади позицій меню

netlify.toml            build, publish, functions
```

---

## Скрипти npm

| Команда | Опис |
|---------|------|
| `npm run dev` | `build:shared` + CRA (:3000) + functions (:9999) |
| `npm run dev:netlify` | Netlify CLI dev (:8888) |
| `npm start` | Тільки React (без functions) |
| `npm run build:shared` | esbuild: `orderValidation.ts` + menu → `_shared/orderValidation.js` |
| `npm run build` | `build:shared` + production build у `build/` |
| `npm test` | CRA tests (watch вимкнено) |
| `node scripts/build-menu.mjs` | Регенерація `menuByLang.json` |

---

## Усунення проблем

| Симптом | Можлива причина | Що зробити |
|---------|-----------------|------------|
| 404 на замовлення | Запущено лише `npm start` | Використай `npm run dev` або деплой |
| «Server configuration error» | Немає Telegram env | Перевір `.env` / Netlify variables |
| «telegram_failed» | Невірний token або chat_id | Перевір env, redeploy |
| «Cart prices do not match menu» | Старий bundle або стара сторінка | `npm run build:shared`, онови сторінку (Ctrl+F5) |
| Кнопки в Telegram не працюють | Webhook не зареєстрований | `setWebhook` на production URL |
| 401 на webhook | Secret не збігається | Однаковий `TELEGRAM_WEBHOOK_SECRET` у curl і Netlify |
| Email не приходить | Resend не налаштований / домен не верифікований | Resend dashboard, логи function |
| Після зміни env нічого не змінилось | Netlify кешує env | Trigger redeploy |
| Авто-відхилення «не працює» локально | `functions:serve` не читав `.env` → таймер **10 хв**, не 1 | `ORDER_PENDING_TIMEOUT_MINUTES=1` у `.env`, **перезапусти** `npm run dev`; у логах `timeoutMinutes: 1` |
| Авто-відхилення на production | Потрібні deploy + env на Netlify + cron `expire-pending-orders` | Змінна на Netlify, redeploy; у Functions → scheduled runs перевір виконання |

**Локальний тест авто-відхилення:** після замовлення в логах `[0]` має бути `pending_registered` з `"timeoutMinutes":1`. Через ~1 хв — `order_auto_rejected`. Або вручну: `curl http://localhost:9999/.netlify/functions/expire-pending-orders` (після закінчення таймауту).

---

© Sushi Love · Aleja Najświętszej Maryi Panny 10, Częstochowa
