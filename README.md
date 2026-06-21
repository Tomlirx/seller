# Seller

A small ecommerce MVP: browse products, sign up, checkout via Stripe, and manage products/orders from an admin dashboard.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Postgres + Prisma
- Auth.js (NextAuth v5) — credentials login with `CUSTOMER` / `ADMIN` roles
- Stripe Checkout + webhook for payments
- Vercel Blob for product image uploads

## Local setup

1. Copy `.env.example` to `.env` and fill in the values.
2. Get a Postgres database. For local development without Docker, run:
   ```bash
   npx prisma dev
   ```
   This prints a `DATABASE_URL` — paste it into `.env`.
3. Install dependencies and push the schema:
   ```bash
   npm install
   npx prisma db push
   npm run db:seed
   ```
   The seed script creates an admin user (`admin@example.com` / `admin12345` by default — override via `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`) and a few sample products.
4. Start the dev server:
   ```bash
   npm run dev
   ```

## Stripe webhook (local testing)

Use the [Stripe CLI](https://stripe.com/docs/stripe-cli) to forward webhook events to your local server:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the printed webhook signing secret into `STRIPE_WEBHOOK_SECRET` in `.env`.

## Deployment

Deploy to Vercel and configure:
- A hosted Postgres database (e.g. Neon or Vercel Postgres) as `DATABASE_URL`
- `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` (from a Stripe webhook endpoint pointed at `/api/webhooks/stripe`)
- Vercel Blob storage and its `BLOB_READ_WRITE_TOKEN`

Run `npx prisma migrate deploy` (or `db push`) against the production database before first deploy, then `npm run db:seed` to create an admin user.
