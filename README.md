# tvtvforall

# tvforall.store

Secure, performant IPTV storefront with USDT payments. Built with Next.js (App Router), TypeScript, Tailwind, Prisma, and PostgreSQL.

## Stack
- Next.js 14 (App Router)
- TypeScript + Tailwind CSS
- Prisma + SQLite (local-friendly test mode)
- react-qr-code (QR for test USDT payments)
- CI: GitHub Actions (build + test)

## Project layout
- /app — Next.js App Router (pages, layouts, routes)
- /components — shared UI components
- /lib — utilities (Prisma client, plan data)
- /app/api — API routes (orders, admin mark-paid)
- /prisma — Prisma schema + seed
- /admin — admin page route
- /db — seed/migration helpers (optional)
- /scripts — automation scripts
- Dockerfile, docker-compose.yml — containerized dev setup

## Getting started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy environment file and fill values:
   ```bash
   cp .env.example .env
   ```
3. Initialize SQLite DB and seed products:
   ```bash
   npx prisma generate
   npx prisma db push
   npm run prisma:seed
   ```
4. Start dev server:
   ```bash
   npm run dev
   ```

Open http://localhost:3000 for the storefront, http://localhost:3000/checkout for checkout, and http://localhost:3000/admin for the admin test panel.

## Environment variables
- `DATABASE_URL` — SQLite connection (example: `file:./dev.db`).
- `TEST_USDT_ADDRESS` — fake USDT wallet shown in checkout (example: `USDT-TEST-ADDRESS-1234567890`).
- `NEXT_PUBLIC_APP_URL` — public base URL (e.g., `http://localhost:3000`).

## Test flow (local)
1) Homepage: pick a plan, click Buy Now.
2) Checkout: select plan and click "Generate payment" to create a test order. You’ll see USDT amount, fake wallet, and QR.
3) Admin: open /admin, click "Mark as Paid" on the order to activate the subscription.

## Docker Compose (dev)
Runs the Next.js dev server with SQLite volume:
```yaml
version: '3.9'
services:
   web:
      build: .
      command: npm run dev
      ports:
         - '3000:3000'
      environment:
         DATABASE_URL: file:./dev.db
         TEST_USDT_ADDRESS: USDT-TEST-ADDRESS-1234567890
         NEXT_PUBLIC_APP_URL: http://localhost:3000
      volumes:
         - .:/app
         - /app/node_modules
```

## Legal note
All IPTV streams and content endpoints are provided by the client with valid rights. No scraping or unlicensed sources are used.
