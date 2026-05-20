# Sushi Love — Częstochowa

Website for [sushilove-czestochowa.pl](https://sushilove-czestochowa.pl): menu, cart, orders to Telegram, and customer confirmation emails via Resend.

## Features

- Menu with categories, photos, and portion variants (e.g. shrimp 6/9 pcs)
- UI and menu languages: **PL**, **EN**, **UK**
- Cart (persisted in `localStorage`)
- Checkout: delivery / pickup, cash / card, ASAP or scheduled time
- Orders → **Telegram** (bot with Accept / Reject / ETA 45·60·90 min buttons)
- After acceptance — customer email via **Resend**

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 (Create React App), CSS |
| Hosting | Netlify (static + serverless) |
| Functions | `create-order`, `telegram-webhook`, `netlify/functions/_shared/` |
| Integrations | Telegram Bot API, Resend |

## Local development

```bash
npm install
cp .env.example .env   # if a template exists; otherwise create .env manually
npm run dev
```

- App: [http://localhost:3000](http://localhost:3000)
- Functions: port **9999** (proxied from CRA via `src/setupProxy.js`)

Alternatives: `npm start` (frontend only) or `npm run dev:netlify` (Netlify CLI on :8888).

## Environment variables

### Netlify (Production) — required for orders

| Variable | Description |
|----------|-------------|
| `TELEGRAM_BOT_TOKEN` | Bot token from [@BotFather](https://t.me/BotFather) |
| `TELEGRAM_CHAT_ID` | Chat / group ID for incoming orders |
| `TELEGRAM_WEBHOOK_SECRET` | Webhook secret (optional, recommended) |
| `RESEND_API_KEY` | API key from [Resend](https://resend.com) |
| `RESEND_FROM` | `Sushi Love <orders@sushilove-czestochowa.pl>` (after domain verification) |

**Important:** In Production, `RESEND_FROM` must use `@sushilove-czestochowa.pl`, not `onboarding@resend.dev`. After changing env vars, **redeploy**.

Optional: `RESEND_SUBJECT_CONFIRMED`, `RESEND_SUBJECT_REJECTED`, `TELEGRAM_ADMIN_IDS`.

### Local (`.env`)

Same variables for functions; for CRA if needed:

- `REACT_APP_ORDER_ENDPOINT` — defaults to `/.netlify/functions/create-order`

## Updating the menu

1. Edit items in `scripts/build-menu.mjs` and translations in `scripts/menu-i18n.mjs`.
2. Images: `public/imgs/` (sets → `sets_img/`, drinks → `drinks/`, etc.).
3. Regenerate JSON:

```bash
node scripts/build-menu.mjs
```

4. Category hero image (one per tab): `CATEGORY_IMAGES` in `src/DaneMenu/menuUtils.js`.

Category labels in the UI: `src/i18n/translations.js`.

## Deploy

```bash
npm run build
npx netlify-cli deploy --prod
```

Or push to a branch connected to Netlify (auto deploy).

## Project structure

```
public/              static assets (Banner.jpg, logo, imgs/, _redirects)
src/
  pages/             HomePage, CartPage
  context/           cart, language, routing
  shared/            orderValidation.js (same rules as create-order API)
  DaneMenu/          menuByLang.json, menuUtils.js
  i18n/              UI translations
netlify/functions/   create-order.js, telegram-webhook.js, constants.js
netlify/functions/_shared/   telegram, resend, logging, customer email helpers
scripts/             build-menu.mjs, menu-i18n.mjs
```

## Telegram webhook

URL: `https://<your-domain>/.netlify/functions/telegram-webhook`

Setup (example):

```bash
curl "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://sushilove-czestochowa.pl/.netlify/functions/telegram-webhook&secret_token=<TELEGRAM_WEBHOOK_SECRET>"
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | CRA + functions (recommended) |
| `npm start` | React only |
| `npm run build` | Production build to `build/` |
| `node scripts/build-menu.mjs` | Regenerate menu JSON |

---

© Sushi Love · Aleja Najświętszej Maryi Panny 10, Częstochowa
