# Gumroad Product Description — Claude SaaS Starter

> Copy this into the Gumroad product description field.

---

## Summary (for Gumroad summary field)

The ONLY Next.js boilerplate built for Claude Sonnet 4.5. Ship your AI SaaS in hours, not weeks.

---

## Description

**You're burning weeks wiring auth, billing, and Claude API together.**

Your competitors already shipped. They're getting users while you're debugging Stripe webhooks at 2am and fighting SSE streaming edge cases.

Every boilerplate out there is built for OpenAI. But you chose Claude for a reason — Sonnet 4.5 beats GPT-4o on code, reasoning, and streaming latency. The problem? Zero dedicated tooling. You're stitching together random tutorials and praying it works.

**Claude SaaS Starter changes that.**

The only Next.js boilerplate engineered specifically for Claude. Not adapted from an OpenAI template. Built from scratch for the Anthropic SDK, SSE streaming, and Claude's unique strengths.

**Go from `git clone` to production in 2 hours. Not 2 weeks.**

---

### Claude-First Architecture

This isn't a generic AI wrapper with Claude bolted on.

- **Sub-200ms streaming** — SSE pipeline optimized for Claude's response format
- **`useClaudeStream` hook** — Type-safe React hook with loading states, error handling, and auto-scroll
- **Edge-ready API routes** — Server-side streaming that just works on Vercel
- **Real-time chat UI** — Production chat interface with message history, keyboard shortcuts, and typing indicators

### Revenue-Ready on Day One

Stop building billing infrastructure. Start collecting payments.

- **Stripe subscriptions** — Monthly + yearly plans, fully wired
- **Webhook handling** — `checkout.session.completed`, subscription updates, cancellations — all handled
- **Usage metering** — Track API calls, tokens, and estimated costs per user
- **Customer portal** — Self-service billing management via Stripe Portal

### Ship Secure, Ship Fast

Authentication and admin shouldn't take a week.

- **Supabase Auth** — Email/password + OAuth (Google, GitHub) out of the box
- **Protected routes** — Middleware-based route protection, zero config
- **Admin dashboard** — User management, subscription overview, usage analytics
- **Role-based access** — Admin vs. user roles via Supabase metadata

### Documentation That Actually Helps

Not a README with "figure it out." Four comprehensive guides, 1,300+ lines total.

- **SETUP.md** — Full walkthrough from clone to deploy, with 10+ troubleshooting solutions
- **STRIPE_SETUP.md** — Products, webhooks, test cards, customer portal — step by step
- **OAUTH_SETUP.md** — Google + GitHub OAuth, complete with screenshots
- **START_HERE.md** — 3 steps to running locally, links to everything else

---

### What You Get

| | |
|---|---|
| **2,500+ lines** | of production TypeScript (not boilerplate fluff) |
| **40 tests** | Unit + integration, 92-100% coverage |
| **4 guides** | 1,300+ lines of documentation |
| **3 SQL migrations** | Admin roles, subscriptions, usage tracking |
| **Full tech stack** | Next.js 16 + TypeScript + Tailwind 4 + shadcn/ui + Supabase + Stripe |

---

### The Math

A senior developer charges $100/hr. Building auth + Claude streaming + Stripe billing + admin dashboard + tests + docs from scratch = **40+ hours minimum**.

That's **$4,000+ of development time.**

Claude SaaS Starter: **$149.** That's 96% off.

And with early bird pricing: **$119** with code `LAUNCH20` (first 50 buyers only).

---

### Not Another Template Graveyard

The $349 "premium" starters? Bloated with features you'll rip out. Half the code is for OpenAI compatibility you don't need.

The $39 "budget" starters? A Next.js skeleton with a README that says "add your AI here." You'll spend more time finishing it than you saved.

**Claude SaaS Starter sits in the sweet spot**: everything you need, nothing you don't. Production-ready code that you actually understand and can modify.

---

### What's Inside

```
claude-saas-starter/
├── app/              # Next.js 16 App Router
│   ├── (auth)/       # Login, signup, OAuth callback
│   ├── (dashboard)/  # Chat, admin, settings
│   ├── (marketing)/  # Pricing page
│   └── api/          # Claude streaming + Stripe webhooks
├── components/       # shadcn/ui + custom components
├── lib/              # Auth, Claude, Stripe, usage tracking
├── supabase/         # SQL migrations (3 files)
├── __tests__/        # Unit tests (92-100% coverage)
├── tests/            # Integration tests
└── docs/             # 4 comprehensive guides
```

---

### Frequently Asked Questions

**Is this a one-time purchase?**
Yes. Pay once, own it forever. Includes lifetime updates.

**Can I use it for multiple projects?**
Yes. No license restrictions on projects you build with it.

**What if I get stuck?**
The docs cover the 10 most common issues. If you're still stuck, reach out — I reply within 24h.

**Does it work with Claude 4 / future models?**
The Anthropic SDK handles model upgrades. Change one string and you're on the latest model.

---

### Early Bird Offer

**$119** with code **LAUNCH20** (20% off — first 50 buyers)

Regular price: $149

[Get Claude SaaS Starter →]
