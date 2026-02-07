# Welcome to Claude SaaS Starter

You just saved yourself weeks of development. Here's how to get running in minutes.

## Quick Start (3 steps)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.local.example .env.local
```

Then fill in your API keys (see guides below).

### 3. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you're live.

## Setup Guides

| Guide | What it covers |
|-------|---------------|
| [SETUP.md](./SETUP.md) | Full setup walkthrough + troubleshooting |
| [STRIPE_SETUP.md](./docs/STRIPE_SETUP.md) | Stripe products, webhooks, checkout flow |
| [OAUTH_SETUP.md](./docs/OAUTH_SETUP.md) | Google & GitHub OAuth configuration |

## What's Included

- **Auth** — Email + OAuth (Google, GitHub) via Supabase
- **Claude Streaming** — Real-time SSE with `useClaudeStream` hook
- **Stripe Billing** — Subscriptions, webhooks, customer portal
- **Admin Dashboard** — User management, usage stats, subscription overview
- **40 Tests** — Unit + integration, 92-100% coverage
- **4 Documentation Guides** — 1,300+ lines, zero assumptions

## Need Help?

Check [SETUP.md](./SETUP.md) troubleshooting section — it covers the 10 most common issues.

---

Built with Next.js, TypeScript, Tailwind CSS, Supabase, Claude Sonnet 4.5, and Stripe.
