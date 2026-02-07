# Reddit Posts — Claude SaaS Starter Launch

> 3 posts adaptés par subreddit. Chaque post a le bon ton pour sa communauté.

---

## 1. r/SideProject (Samedi 8 fév)

**Self-promo OK. Story-driven. Feedback genuine.**

### Title

```
I built the first Next.js boilerplate specifically for Claude Sonnet 4.5 — looking for feedback
```

### Body

```
Hey r/SideProject,

I spent the last few weeks building something I couldn't find anywhere: a production-ready Next.js boilerplate that's actually built for Claude (Anthropic), not OpenAI.

**The problem I kept running into**

Every time I started a new AI SaaS project with Claude, I'd spend 30-40 hours wiring the same things together: auth, Stripe webhooks, SSE streaming for Claude's response format, usage tracking. The existing boilerplates are all OpenAI-first or "model-agnostic" (which really means OpenAI with a wrapper).

Claude's streaming works differently from OpenAI — the Anthropic SDK uses Server-Sent Events with a different event structure, and most "AI templates" just don't handle it well.

**What I built**

Claude SaaS Starter — a Next.js 16 boilerplate with:

- Supabase Auth (email + Google/GitHub OAuth)
- Claude streaming via SSE on Edge Runtime (sub-200ms time-to-first-token)
- Stripe subscriptions with full webhook handling
- Admin dashboard with user management
- Usage metering (token tracking + cost estimation)
- 40 tests (unit + integration)
- 4 setup guides, 1,300+ lines of documentation

**What I learned building it**

1. Stripe webhooks are the hardest part of any SaaS. Testing them locally with ngrok is painful but necessary. I documented every edge case.
2. Claude's SSE format needs a custom ReadableStream transform — you can't just pipe the Anthropic SDK response to the client.
3. Documentation > features. I spent almost as much time writing guides as writing code. The setup guides assume zero prior knowledge of Supabase, Stripe, or the Anthropic API.

**Screenshots**

[Screenshot 1 — Chat interface with Claude streaming in real-time]
[Screenshot 2 — Admin dashboard with user stats]

**Pricing**

$149 on Gumroad (or $119 with code LAUNCH20 — first 50 buyers).

I know pricing is always controversial. My logic: a senior dev at $100/hr would spend 40+ hours building this from scratch. $149 seemed like a fair middle ground — serious enough to signal quality, accessible enough for indie budgets.

→ https://bydaewon.gumroad.com/l/claude-saas-starter

**Genuine question**

What would make you actually buy a boilerplate vs. building from scratch? I'm trying to understand what tips the scale for developers. Is it documentation quality? Test coverage? The time savings? Something else?

Would love honest feedback — both positive and critical.
```

---

## 2. r/ClaudeAI (Mardi 11 fév)

**Community technique Claude. Focus sur les détails spécifiques à l'API Anthropic.**

### Title

```
Built a production-ready Next.js starter kit for Claude's streaming API — open to feedback
```

### Body

```
I've been building Claude-powered apps for a while and got tired of re-implementing the same streaming infrastructure every time. So I built a boilerplate specifically for Claude — not adapted from an OpenAI template.

**Why Claude needs its own boilerplate**

Most "AI SaaS" templates use the Vercel AI SDK or OpenAI's client. When you try to use them with Claude, you hit friction:

- The Anthropic SDK's `messages.stream()` returns a different event structure than OpenAI's streaming
- Server-Sent Events from Claude need a custom ReadableStream transform on Edge Runtime
- Token counting works differently (input_tokens + output_tokens in the final message event)
- Error handling for rate limits and overloaded responses requires Anthropic-specific logic

**The streaming architecture**

```
Client → fetch('/api/claude/stream') → Edge Runtime → Anthropic SDK → SSE → Client
```

The API route uses `anthropic.messages.stream()` and transforms it into SSE events. On the client side, a custom `useClaudeStream` React hook handles:

- Parsing the SSE event stream via ReadableStream reader
- Buffering partial events (SSE can split across chunks)
- Appending text deltas to the assistant message in real-time
- Error recovery and cleanup

The hook gives you `{ messages, isStreaming, error, sendMessage, clearMessages }` — type-safe and ready to drop into any React component.

**What's included beyond streaming**

- Supabase Auth (email + OAuth) with middleware-based route protection
- Stripe subscriptions (monthly + yearly) with webhook handling for the full subscription lifecycle
- Admin dashboard (user management, subscription overview, usage analytics)
- Usage metering — every API call is logged with token counts and cost estimation
- 40 tests, 1,300+ lines of documentation across 4 guides

**Link**

$149 on Gumroad (or $119 with LAUNCH20): https://bydaewon.gumroad.com/l/claude-saas-starter

Happy to answer any technical questions about the Claude streaming implementation or the architecture decisions.
```

---

## 3. r/nextjs (Jeudi 13 fév)

**100% technique. Architecture walkthrough. Mention produit minimale.**

### Title

```
Shipping a Next.js 16 boilerplate with Supabase Auth + Stripe + Claude streaming — architecture walkthrough
```

### Body

```
I just shipped a production Next.js 16 (App Router) boilerplate and wanted to share the architecture decisions for anyone building similar SaaS apps. The focus is AI streaming (Claude/Anthropic), but the auth + billing patterns apply to any SaaS.

**Stack**

- Next.js 16 (App Router, TypeScript, Tailwind 4, shadcn/ui)
- Supabase (Auth + PostgreSQL + RLS)
- Anthropic SDK (Claude streaming via SSE)
- Stripe (subscriptions + webhooks)

**Auth architecture**

Using Supabase Auth with middleware-based route protection. The key pattern:

- `middleware.ts` checks the Supabase session on every request to protected routes
- OAuth callbacks (Google, GitHub) handled via Supabase's built-in flow
- Admin role stored in Supabase user metadata, checked server-side
- RLS policies enforce authorization at the database level

**Claude streaming on Edge Runtime**

This was the trickiest part. The API route runs on Edge Runtime (`export const runtime = 'edge'`) for global low-latency.

The flow:
1. Client sends messages via `fetch` POST
2. Edge route calls `anthropic.messages.stream()` with the Anthropic SDK
3. The SDK's stream events get transformed into SSE format via a custom `ReadableStream`
4. Client parses SSE events through a `ReadableStreamDefaultReader`, buffering partial chunks
5. A React hook (`useClaudeStream`) manages the message state, streaming status, and error handling

Key gotcha: you can't just pipe the Anthropic SDK stream directly. You need to transform the events into `data: {json}\n\n` SSE format and handle the `text`, `message` (completion), and `error` event types separately.

**Stripe webhook handling**

The webhook route handles the full subscription lifecycle:
- `checkout.session.completed` → create subscription record
- `customer.subscription.updated` → sync status changes
- `customer.subscription.deleted` → handle cancellation
- `invoice.payment_failed` → notify user

Each event updates a `subscriptions` table in Supabase. The webhook verifies signatures with `stripe.webhooks.constructEvent()`.

**Usage metering**

Every Claude API call gets logged non-blocking (fire-and-forget `fetch` to Supabase REST API from Edge Runtime). Tracks:
- Input/output tokens
- Request duration
- Cost estimation ($3/MTok input, $15/MTok output for Sonnet)
- Error logging

The admin dashboard aggregates this into per-user and 30-day rolling summaries.

**Testing**

40 tests across Vitest:
- Stripe webhook handlers (7 tests, 92% coverage)
- Admin role checking (9 tests)
- Subscription validation (8 tests, 100% coverage)
- Usage logging (16 tests, 100% coverage)

**Documentation**

4 setup guides (1,300+ lines total): general setup, Stripe configuration, OAuth setup, and a quick-start guide. Each includes troubleshooting sections for the 10 most common issues.

---

The full boilerplate is available on Gumroad ($149, or $119 with code LAUNCH20): https://bydaewon.gumroad.com/l/claude-saas-starter

Happy to discuss any of the architectural decisions — especially interested in how others are handling AI streaming in Next.js App Router.
```

---

*Created: 2026-02-08*
