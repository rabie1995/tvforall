# AI Agent Instructions for tvforall.store

## Big Picture
- **Stack:** Next.js 14 (App Router), TypeScript, Tailwind, Prisma (SQLite in dev), JWT via `jose`.
- **Architecture:**
  - UI pages in [app/](app/) with server `route.ts` handlers in [app/api](app/api).
  - Database access via `PrismaClient` singleton in [lib/prisma.ts](lib/prisma.ts).
  - Admin auth is cookie-based (`admin_token` JWT). Middleware enforces access on [middleware.ts](middleware.ts) for `/admin/*` and hidden `/06620676830610209229/*`.
  - Payments use NOWPayments webhook → updates `Order.paymentStatus` via [app/api/webhooks/nowpayments/route.ts](app/api/webhooks/nowpayments/route.ts).
  - Client data pipeline: validation + persistence in [lib/clientData.ts](lib/clientData.ts), exposed via admin endpoints.

## Data Models (Prisma)
- Keys: `User`, `Product`, `Order`, `Subscription`, `ClientData` in [prisma/schema.prisma](prisma/schema.prisma).
- Important `Order` fields used by API/UI: `productId`, `fullName`, `email`, `region`, `adultChannels`, `paymentStatus`, `deliveryStatus`, `nowpaymentsId`.
- Seed products via [prisma/seed.js](prisma/seed.js) (`plan_3m`, `plan_6m`, `plan_12m`).

## Admin Auth Pattern
- Use `authenticateAdmin()` and `verifyAdminToken()` in [lib/auth.ts](lib/auth.ts) for login/verification.
- Issue token with `createAdminToken()` and set `httpOnly` cookie `admin_token`.
- Protected routes must read/verify cookie:
  - Example: [app/api/admin-auth/verify/route.ts](app/api/admin-auth/verify/route.ts) and [app/api/admin/orders/route.ts](app/api/admin/orders/route.ts).
- Env required: `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH` (bcrypt). Generate hash locally if needed.

## Critical Flows
- **Checkout → Order create → Admin fulfillment:**
  - `POST` [app/api/checkout/route.ts](app/api/checkout/route.ts) validates/sanitizes via `collectClientData()` then creates an `Order` with `paymentStatus='pending'`, `deliveryStatus='pending'`.
  - Admin lists and views orders via [app/api/admin/orders/route.ts](app/api/admin/orders/route.ts) and [app/api/admin/orders/[id]/route.ts](app/api/admin/orders/%5Bid%5D/route.ts).
  - Admin marks delivered via `POST` [app/api/admin/orders/[id]/activate/route.ts](app/api/admin/orders/%5Bid%5D/activate/route.ts) → sets `deliveryStatus='completed'`.
- **NOWPayments webhook:** [app/api/webhooks/nowpayments/route.ts](app/api/webhooks/nowpayments/route.ts) maps `payment_status` to our `paymentStatus`. Uses `NOWPAYMENTS_WEBHOOK_SECRET` when signature verification is enabled.

## Conventions & Gotchas
- Prefer the `paymentStatus`/`deliveryStatus` fields on `Order`. Some legacy files reference `status/amountUsd/amountUsdt/walletAddress`—avoid those unless aligning both code and schema.
- Always use the shared Prisma client from [lib/prisma.ts](lib/prisma.ts); do not instantiate new clients.
- Admin endpoints must verify `admin_token` and return `401` on failure (see [app/api/admin/clients/route.ts](app/api/admin/clients/route.ts)).
- Client data validation/sanitization lives in [lib/clientData.ts](lib/clientData.ts); reuse these helpers.
- Plans/pricing: read from [lib/plans.ts](lib/plans.ts). Promo logic in [lib/promo.ts](lib/promo.ts) with `CURRENT_PROMO` and `isPromoActive()`.
- i18n locales configured in [next.config.mjs](next.config.mjs) (`en`, `fr`, `ar`).

## Dev & Ops
- **Local dev:**
  - Install and init:
    - `npm install`
    - `npx prisma generate`
    - `npx prisma db push`
    - `npm run prisma:seed`
  - Run dev: `npm run dev`
- **Migrations:** `npx prisma migrate dev --name <name>`; ensure schema matches API usage.
- **Docker dev:** `docker compose up` (see [docker-compose.yml](docker-compose.yml)); build stages in [Dockerfile](Dockerfile).

## Testing & Debug
- Integration script: [tests/integration-test.js](tests/integration-test.js) exercises admin login, checkout, clients, export.
  - Note: it expects `/api/admin/login` to return a token; current cookie-based handlers live under `/api/admin-auth/*`. Keep behavior consistent when modifying.
- If `/admin` or hidden admin routes redirect, verify `admin_token` cookie and middleware config in [middleware.ts](middleware.ts).

## Adding Features (Examples)
- New protected admin API:
  - Place `route.ts` under `app/api/admin/...`, verify cookie via `verifyAdminToken()`, use Prisma via `lib/prisma.ts`.
- Extend client search/export:
  - Update [lib/clientData.ts](lib/clientData.ts) and the handler in [app/api/admin/clients/route.ts](app/api/admin/clients/route.ts).

## Environment
- Required: `DATABASE_URL`, `NEXT_PUBLIC_APP_URL`, `TEST_USDT_ADDRESS` (dev), `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, `NOWPAYMENTS_WEBHOOK_SECRET` (optional).
