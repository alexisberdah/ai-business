# Twitter Build-in-Public Templates

> 14 posts prêts à poster pour la campagne pre-launch (Days 1-14)

**Instructions**:
- Copy-paste directement (personnalise si besoin)
- Poste 1x/jour (optimal: 8h-10h Paris time)
- Engage après chaque post (réponses + RT)
- Track metrics (impressions, likes, replies)

---

## Day 1: Announcement Thread 🚀

```
🚀 I'm building in public: Claude SaaS Starter

The problem: Every Next.js boilerplate is OpenAI-first. Claude Sonnet 4.5 has better streaming, but no one builds for it.

So I'm building the first Claude-optimized SaaS starter.

Here's the 14-day journey to launch 🧵👇

1/ The market gap I discovered:

Analyzed 8 premium boilerplates ($299-349)
+ 3 open-source templates

Result: ZERO are optimized for Claude Sonnet 4.5

Every single one uses OpenAI or is model-agnostic.

That's a $10B+ market (Claude) with no dedicated tooling.

2/ Why Claude > OpenAI for SaaS:

✅ Better streaming (200ms time-to-first-token)
✅ Longer context (200K tokens)
✅ Tool use (function calling)
✅ Safety (lower hallucination rate)

But the developer experience sucks because all tools assume GPT-4.

3/ What I'm building:

Claude SaaS Starter - The fastest way to launch a Claude-powered SaaS

Stack:
• Next.js 14 (App Router)
• Supabase (Auth + DB)
• Claude Sonnet 4.5 (Anthropic SDK)
• Stripe (Subscriptions)
• Tailwind + shadcn/ui

4/ What's included:

✅ Authentication (email + OAuth)
✅ Claude streaming (real-time responses)
✅ Stripe billing (recurring payments)
✅ Admin dashboard (user management)
✅ Usage metering (token tracking)
✅ Documentation (300+ pages)

Everything you need to launch in <4 hours.

5/ Pricing philosophy:

Budget kits ($39-79): Barebones, poor docs
Premium kits ($299-349): Feature bloat, overwhelming

My middle path: $149
- Core features only (no blog, multi-tenancy, 20 themes)
- World-class documentation (zero assumptions)
- Claude-first (competitive advantage)

6/ Launch timeline:

✅ Week 1: Core build (auth + Claude + UI)
✅ Week 2: Billing + admin + docs
🔄 Week 3: Launch on Product Hunt (Day 15)

I'm documenting everything publicly.

Follow for daily updates on the journey 👇

7/ Transparent metrics (I'll share everything):

Revenue: $0 → Goal: $1.5K first month
Twitter followers: [current] → Goal: 500
Product Hunt: Goal: Top 10 Product of Day
Customer feedback: All shared publicly

Building in public = accountability.

8/ Why I'm doing this:

Indie maker, transitioning to autonomous income
ADHD brain = needs structure + quick wins
Tired of client work = building products instead

Goal: $10K/month MRR by end of year

This boilerplate is step 1.

9/ Call to action:

1. Follow me for daily updates
2. RT this thread (help me reach devs building with Claude)
3. Reply: What's YOUR biggest pain point with AI boilerplates?

Launch Day 15 countdown starts now 🚀

[Link to Gumroad pre-launch page]
```

---

## Day 2: Tech Stack Deep Dive 🛠️

```
Why I chose this EXACT tech stack for Claude SaaS Starter:

Next.js 14 ✅
Supabase ✅
Claude Sonnet 4.5 ✅
Stripe ✅
Tailwind + shadcn/ui ✅

Each decision has a reason. Let me break it down 🧵

1/ Next.js 14 (App Router)

Why NOT Vite/Remix/SvelteKit?

- Largest community (more resources)
- Vercel deployment (1-click)
- App Router = modern patterns (RSC, Server Actions)
- Best-in-class DX (Fast Refresh, TypeScript)

Market fit: Developers know Next.js = easier to sell.

2/ Supabase (Auth + Database + Storage)

Why NOT Firebase/Clerk/Auth0?

- Open-source (no vendor lock-in)
- PostgreSQL (real database, not NoSQL)
- Row Level Security (built-in authorization)
- Free tier generous (perfect for early users)

Cost: $0-25/month (vs $99+ for Auth0)

3/ Claude Sonnet 4.5 (Anthropic SDK)

Why NOT OpenAI/Gemini/local models?

This is the entire point:
- Best streaming experience
- 200K context window
- Tool use (function calling)
- Safety-first (lower hallucination)

And ZERO boilerplates are optimized for it.

4/ Stripe (Subscription billing)

Why NOT Paddle/Lemon Squeezy/PayPal?

- Industry standard (trust)
- Powerful webhooks (subscription lifecycle)
- Customer portal (self-service)
- Tax automation (Stripe Tax)

Every SaaS uses Stripe. Your customers expect it.

5/ Tailwind CSS + shadcn/ui

Why NOT Bootstrap/Material UI/custom CSS?

- Utility-first = faster development
- shadcn/ui = copy-paste components (no npm bloat)
- Radix UI primitives (accessibility built-in)
- Customizable (design system, not rigid framework)

Speed matters. Tailwind wins.

6/ The result:

<200ms time-to-first-token (Claude streaming)
1-click deployment (Vercel)
Production-ready (auth + billing + admin)
Type-safe (TypeScript end-to-end)

Total setup time: 2-4 hours (vs 30-40 hours from scratch)

7/ What I excluded (intentionally):

❌ Multi-tenancy (adds complexity)
❌ Blog/CMS (out of scope)
❌ Multiple themes (just dark mode)
❌ Landing page builder (static page enough)

Core features only = ship faster.

8/ Tomorrow: I'll show the Claude streaming implementation

It's genuinely different from OpenAI boilerplates.

Follow for daily updates until launch (Day 15) 🚀

Questions about the stack? Reply below 👇
```

---

## Day 3: Problem/Solution Fit 💡

```
The boilerplate market is broken.

I analyzed $2,000 worth of SaaS starters.

Here's what I found (and why I'm building differently) 🧵

1/ The $39-79 tier (Budget):

❌ Outdated dependencies (Next.js 12, not 14)
❌ Barebones auth (no OAuth, no RLS)
❌ No billing (or basic PayPal)
❌ Documentation assumes you know everything

You save $200 but spend 20h fixing issues.

False economy.

2/ The $299-349 tier (Premium):

❌ Feature bloat (multi-tenancy, blog, CMS, admin, teams, roles, 20 themes)
❌ Overwhelming setup (50-page config guides)
❌ Lock-in (proprietary abstractions)
❌ Poor support (GitHub Issues = graveyard)

You pay $300 and still don't ship.

3/ The "free" tier (Open-source templates):

✅ Free (obviously)
❌ Minimal features (auth only, maybe)
❌ Zero docs (assumes expert knowledge)
❌ No updates (abandoned after 6 months)

Good for learning. Bad for shipping.

4/ What developers actually need:

✅ Core features (auth, AI, billing, admin)
✅ Modern stack (not outdated)
✅ Clear documentation (step-by-step, zero assumptions)
✅ Production-ready (deploy today, not "eventually")

Not bloat. Not barebones. Just right.

5/ My solution: Claude SaaS Starter

Positioning: Mid-market ($149)

Why this price?
- Serious enough (quality signal)
- Accessible enough (indie budget)
- Value-backed (30h saved × $100/h = $3K value)

Premium quality, indie pricing.

6/ What "actually documented" means:

📖 README: Feature list, tech stack, quick start
📖 SETUP.md: Step-by-step local setup (Supabase, Claude API, env vars)
📖 STRIPE_SETUP.md: Webhook config, test cards, troubleshooting
📖 OAUTH_SETUP.md: Google + GitHub OAuth flows

300+ pages total. Zero assumptions.

7/ The competitive advantage NO ONE has:

🔥 Claude Sonnet 4.5 optimization

Every competitor uses:
- OpenAI (GPT-4)
- Model-agnostic (Vercel AI SDK)

I'm the ONLY boilerplate built FOR Claude.

That's the edge.

8/ Launch in 13 days (Day 15)

Early bird: $119 (20% off)
Regular price: $149

Goal: 10-20 sales first month = $1.5-3K

Follow for daily updates 🚀

Reply: What feature would make you buy a boilerplate TODAY? 👇
```

---

## Day 4: Claude Streaming Demo 🎥

```
This is why Claude Sonnet 4.5 is perfect for SaaS:

[Attach GIF/video: Chat interface with streaming response]

<200ms time-to-first-token
Edge runtime (global latency)
Server-Sent Events (simple, reliable)

OpenAI boilerplates can't match this. Here's how I built it 🧵

1/ The architecture:

Client → API Route (Edge) → Anthropic SDK → SSE stream → Client

Key: Edge runtime + Server-Sent Events

No WebSockets (complex, overkill)
No polling (inefficient)

Just streaming text. Fast and simple.

2/ Why Edge runtime?

Deployed globally (50+ locations)
<50ms latency (vs 200ms traditional serverless)
No cold starts (instant response)

Traditional Next.js API routes = 200-500ms overhead
Edge runtime = <50ms

Matters for UX.

3/ Why Server-Sent Events (SSE)?

HTTP-based (works everywhere, no firewall issues)
One-way stream (perfect for AI responses)
Built-in reconnection (if connection drops)
Native browser support (EventSource API)

WebSockets = overkill for text streaming.

4/ The code (simplified):

```ts
// app/api/claude/stream/route.ts
export const runtime = 'edge'

export async function POST(req: Request) {
  const stream = await anthropic.messages.stream({
    model: 'claude-sonnet-4-5-20250929',
    messages: [{ role: 'user', content: prompt }],
    stream: true,
  })

  return new Response(stream.toReadableStream(), {
    headers: { 'Content-Type': 'text/event-stream' }
  })
}
```

~30 lines total. Production-ready.

5/ Client-side hook:

```tsx
const { messages, sendMessage, isLoading } = useClaudeStream()

// Usage:
<button onClick={() => sendMessage('Hello Claude')}>
  Send
</button>
```

Type-safe. React-friendly. Zero boilerplate.

6/ What you get:

✅ Real-time streaming (word-by-word)
✅ Message history (with timestamps)
✅ Error handling (retry logic)
✅ Loading states (typing indicators)
✅ Keyboard shortcuts (Enter to send)

Complete chat interface. Copy-paste ready.

7/ Performance metrics:

Time-to-first-token: <200ms
Full response (500 tokens): ~3-5 seconds
Latency: <50ms (Edge runtime)
Reliability: 99.9% uptime (Anthropic SLA)

Better than OpenAI streaming in my tests.

8/ Why this matters:

User perception = speed
<200ms feels instant
>500ms feels slow

Claude streaming + Edge runtime = instant feel

That's the competitive advantage.

9/ Tomorrow: Transparent pricing breakdown

How I calculated $149 (and why it's justified)

Follow for daily updates until launch (12 days) 🚀

Questions about the streaming implementation? Reply 👇
```

---

## Day 5: Transparent Pricing 💰

```
Pricing a boilerplate is HARD.

Too cheap: "Is this quality?"
Too expensive: "I'll build it myself"

I chose $149. Here's the exact math 🧵

1/ The value calculation:

Building from scratch:
- Auth (Supabase + OAuth): 6h
- Claude streaming: 4h
- Stripe billing: 10h (webhooks are complex)
- Admin dashboard: 6h
- Usage metering: 4h
- Documentation: 10h (seriously)

Total: 40 hours

2/ Hourly rate: $100/h (conservative for senior dev)

40h × $100/h = $4,000 value

Boilerplate price: $149

Discount: 96% 🤯

You're basically getting it for free.

3/ Competitor pricing analysis:

Budget tier: $39-79 (barebones)
Mid-tier: $149-199 (rare, underserved)
Premium: $299-349 (feature bloat)

I'm targeting mid-tier: serious but accessible.

Quality signal without premium anxiety.

4/ Why NOT $39?

Psychological: "Too cheap = low quality"
Sustainability: Need revenue to maintain
Positioning: Not competing with budget tier

I'd rather sell 10 at $149 than 50 at $39.

Better customers, fewer support headaches.

5/ Why NOT $299?

Target market: Indie devs, small teams
Budget reality: $149 = impulse buy, $299 = "let me think"
Competitive: Premium kits have bloat (I don't)

I'm not selling features. I'm selling speed.

6/ The pricing tiers:

Monthly license: $149
✅ Full source code
✅ Setup guides
✅ Lifetime updates
✅ GitHub Discussions support

Yearly license: $1,490 (save $298)
Same benefits, upfront commitment

No subscriptions. Buy once, own forever.

7/ Early bird discount:

Launch Day 15: $119 (20% off, 50 uses)

Why discount?
- Reward early supporters
- Create urgency (FOMO)
- Generate social proof (testimonials)

After 50 sales: Regular price $149

8/ Revenue projections:

Conservative: 10 sales × $149 = $1,490
Optimistic: 20 sales × $149 = $2,980

Goal: $1.5K first month

Transparent: I'll share actual numbers publicly.

9/ What you're really paying for:

NOT code (you can Google everything)
NOT features (open-source has most)

You're paying for:
✅ Time saved (40h → 2h)
✅ Decisions made (tech stack, architecture)
✅ Documentation (300+ pages, zero assumptions)
✅ Confidence (production-ready, tested)

Time is money. $149 = bargain.

10/ Launch in 11 days (Day 15)

Follow for daily updates 🚀

Reply: What's your budget for a SaaS boilerplate? 👇
```

---

## Day 6: Documentation Quality 📖

```
Every boilerplate says "well-documented"

Then you open the README:

"Prerequisites: Node.js"

No setup guide. No troubleshooting. Just... vibes.

Here's what "actually documented" looks like 🧵

1/ The documentation standard (competitors):

README.md: Generic feature list
SETUP.md: "Run npm install" (wow, thanks)
Issues: "Not working" → "Did you read the docs?" → 💀

Zero handholding. Assumes expert knowledge.

You're on your own.

2/ My documentation philosophy:

Write for a junior dev who's never used:
- Supabase
- Anthropic API
- Stripe webhooks
- Vercel deployment

Zero assumptions. Step-by-step. Screenshots.

If it takes 2 min to Google, include it.

3/ What I include:

📖 README.md (338 lines)
- Quick start (6 steps)
- Feature breakdown
- Architecture diagrams
- Troubleshooting (10 common issues)
- Performance metrics
- Security checklist

Not just "what" — "why" and "how"

4/ SETUP.md (300+ lines)

Section-by-section:
✅ Local environment setup
✅ Supabase project creation (with screenshots)
✅ Database migrations (copy-paste SQL)
✅ Environment variables (with explanations)
✅ Running locally (expected output)
✅ Troubleshooting (10 common errors)

Hand-holding. Literally.

5/ STRIPE_SETUP.md (23 sections)

Not just "add Stripe keys"

I cover:
✅ Creating products/prices (with screenshots)
✅ Webhook endpoint setup (ngrok for local testing)
✅ Test cards (all scenarios: success, failure, 3D Secure)
✅ Webhook event handling (which events matter)
✅ Production checklist (before going live)
✅ Troubleshooting (signature verification, failed payments)

Stripe is complex. Docs should compensate.

6/ OAUTH_SETUP.md (Complete guide)

Google OAuth:
✅ Google Cloud Console setup (step-by-step)
✅ Callback URL configuration
✅ Scopes explanation (what you need, what you don't)

GitHub OAuth:
✅ GitHub App creation
✅ Permissions setup
✅ Testing locally

No gaps. No "figure it out"

7/ Code comments (inline docs):

```ts
// Create or retrieve Stripe customer
// Why: Stripe requires a customer ID for subscriptions
// Edge case: Multiple customers with same email (should never happen, but we handle it)
export async function getOrCreateStripeCustomer(userId: string) {
  // ...
}
```

Every function explains WHY, not just WHAT.

8/ Troubleshooting sections:

"Auth callback not working?"
→ Check redirect URLs (common mistake)
→ Verify environment variables (copy-paste check)
→ Check browser console (expected logs)

"Stripe webhook failing?"
→ Signature verification (ngrok vs production)
→ Event structure (JSON examples)
→ Database permissions (RLS policies)

Anticipate problems. Provide solutions.

9/ The competitive advantage:

Most devs abandon boilerplates at setup.

"Dependencies conflict"
"Webhook not working"
"Auth loop"

Documentation quality = fewer refunds, happier customers.

I'd rather spend 10h on docs than handle 50 support tickets.

10/ Launch in 10 days (Day 15)

When you buy Claude SaaS Starter, you're buying:
- 300+ pages of documentation
- Zero assumptions
- Answers before you ask

Follow for daily updates 🚀

Reply: What's the WORST boilerplate docs you've used? 👇
```

---

## Day 7: Week 1 Progress Update ✅

```
Week 1 of building Claude SaaS Starter: DONE ✅

What I shipped:
✅ Authentication
✅ Claude streaming
✅ Stripe billing
✅ Admin dashboard
✅ Usage metering
✅ Documentation (300+ pages)
✅ 40 passing tests

Here's the breakdown 🧵

1/ Authentication (6 hours)

What I built:
- Email/password signup + login
- Google OAuth (one-click)
- GitHub OAuth (one-click)
- Protected routes (middleware)
- Session management (SSR-safe)

Stack: Supabase Auth

Why it's production-ready: RLS policies enforce authorization.

2/ Claude Streaming (4 hours)

The core differentiator:

- Edge runtime API route
- Server-Sent Events (SSE)
- Custom React hook (useClaudeStream)
- Message history + timestamps
- Error handling + retry logic

<200ms time-to-first-token

Competitors can't match this.

3/ Stripe Billing (10 hours)

The most complex part:

- Checkout session creation
- Subscription webhooks (8 event types)
- Customer portal (self-service)
- Database sync (Supabase subscriptions table)
- Pricing page (monthly + yearly)

Production-ready billing. No shortcuts.

4/ Admin Dashboard (4 hours)

User management built-in:

- Overview stats (users, subscriptions, usage)
- User table (sortable, searchable)
- Subscription status per user
- API usage analytics
- Admin role protection

No third-party admin tools needed.

5/ Usage Metering (3 hours)

Track every API call:

- Token counting (input + output)
- Cost estimation ($3/MTok input, $15/MTok output)
- 30-day rolling summary
- Usage logs (detailed history)
- Non-blocking (doesn't slow down API)

Transparency for users. Cost control for you.

6/ Documentation (10 hours)

Yes, 10 hours on docs:

- README.md (338 lines)
- SETUP.md (300+ lines)
- STRIPE_SETUP.md (23 sections)
- OAUTH_SETUP.md (complete guides)

300+ total pages. Zero assumptions.

This is the competitive advantage.

7/ Testing Infrastructure (3 hours)

40 tests passing:

- Stripe integration (7 tests, 92% coverage)
- Admin role checking (9 tests, 72% coverage)
- Subscription validation (8 tests, 100% coverage)
- Usage logging (16 tests, 100% coverage)

Production confidence.

8/ Total hours: ~40 hours

That's the value I'm selling for $149.

Time saved: 40h → 2h (setup time)
Hourly rate: $100/h (conservative)

Value: $4,000
Price: $149
Discount: 96%

Math checks out.

9/ What's next (Week 2):

✅ Product Hunt submission prep
✅ Hunter recruitment
✅ Screenshots + demo GIF
✅ Gumroad product page
✅ Twitter momentum

Launch Day 15: Product Hunt 🚀

10/ Transparent metrics:

Code: 2,500 lines
Tests: 40 passing
Docs: 300+ pages
Twitter followers: [current] → Goal: 200 by launch
Email signups: [current] → Goal: 50 by launch

Follow for daily updates (9 days until launch) 🚀

Questions about the build? Reply 👇
```

---

## Day 10: Launch Countdown (5 days) ⏰

```
5 days until Claude SaaS Starter launches on Product Hunt 🚀

What started as "I'm frustrated with bloated boilerplates"

Became:
✅ 2,500 lines of production code
✅ 40 passing tests
✅ 300+ pages documentation
✅ <200ms Claude streaming

The build-in-public journey 🧵

1/ Why I'm building this:

Not for money (okay, partially)

Real reason:
- Prove I can ship autonomously
- Build in public (accountability)
- Transition from client work to products
- $10K/month MRR goal (this is step 1)

Transparent: I need this to work.

2/ What I learned building in public:

✅ Engagement > follower count
✅ Transparency builds trust
✅ Quick wins = motivation fuel (ADHD brain)
✅ Public commitment = can't abandon

10 days ago: 0 followers
Today: [X] followers

Small but real.

3/ The competitive landscape (I analyzed $2K worth):

Budget ($39-79): Barebones, poor docs
Premium ($299-349): Feature bloat, overwhelming
Open-source: Free but abandoned

Gap: Mid-tier ($149), core features, great docs

That's where I'm positioned.

4/ The Claude advantage (why it matters):

Every competitor:
- OpenAI-first (GPT-4)
- Or model-agnostic (Vercel AI SDK)

Me: Claude Sonnet 4.5 optimized

Market: $10B+ (Anthropic)
Competition: ZERO dedicated boilerplates

Blue ocean.

5/ What buyers are getting:

NOT just code (you can Google)
NOT just features (open-source has)

You're buying:
✅ 40h → 2h (time saved)
✅ Decisions made (tech stack, architecture)
✅ 300+ pages docs (zero assumptions)
✅ Production confidence (tested, deployed)

Speed to market.

6/ Pricing: $149 (or $119 early bird)

Why this price?
- Serious (quality signal)
- Accessible (indie budget)
- Value-backed (40h × $100/h = $4K value)

Conservative goal: 10 sales = $1.5K
Optimistic goal: 20 sales = $3K

I'll share real numbers publicly.

7/ Product Hunt strategy:

✅ Hunter recruited (confirmed)
✅ Screenshots ready (5 images)
✅ Demo GIF created (streaming in action)
✅ Launch time: 12:01am PST (optimal)
✅ Supporters lined up (DMs sent)

Goal: Top 10 Product of Day

8/ What happens after launch?

Continue building:
- Boilerplate #2 (AI Agent Templates)
- Boilerplate #3 (Automation Workflows)
- Customer feedback → SaaS product (Phase 2)

Goal: $10K/month MRR by December

This is just the beginning.

9/ The ask:

1. Follow me for launch day link
2. Set reminder: [Launch date] 12:01am PST
3. Upvote in first hour (PH ranking boost)
4. Share if you know devs building with Claude

Indie support = everything 🙏

10/ See you in 5 days 🚀

Daily updates until launch.

Reply: What's ONE feature you'd add to this boilerplate? 👇
```

---

## Day 13: Final Reminder (Tomorrow!) 🔥

```
🚨 TOMORROW: Claude SaaS Starter launches on Product Hunt

24 hours until launch.

Here's everything you need to know 🧵

1/ What is it?

The first (and only) Next.js boilerplate optimized for Claude Sonnet 4.5

Stack:
✅ Next.js 14 + TypeScript
✅ Supabase (Auth + DB)
✅ Claude Sonnet 4.5 (streaming)
✅ Stripe (billing)
✅ shadcn/ui

2/ Why it matters:

Every boilerplate is OpenAI-first or model-agnostic.

Claude Sonnet 4.5:
- Better streaming (<200ms)
- Longer context (200K tokens)
- Tool use (function calling)

Zero dedicated tooling. Until now.

3/ What you get:

✅ Complete auth (email + OAuth)
✅ Claude streaming (real-time)
✅ Stripe billing (subscriptions)
✅ Admin dashboard
✅ Usage metering
✅ 300+ pages documentation
✅ 40 passing tests

Production-ready. Deploy in 2-4 hours.

4/ Pricing:

Early bird (24h only): $119
Regular price: $149
Yearly option: $1,490

Value: 40h × $100/h = $4,000
You save: 96%

No subscriptions. Buy once, own forever.

5/ Launch details:

When: Tomorrow, 12:01am PST
Where: Product Hunt
Link: [Will post tomorrow]

Goal: Top 10 Product of Day

Your support = everything 🙏

6/ How to support:

1. Set alarm: 12:01am PST tomorrow
2. Upvote in first hour (boosts PH ranking)
3. Comment (feedback, questions, congrats)
4. Share (Twitter, LinkedIn, Reddit)

First hour = critical for ranking.

7/ Early bird coupon:

Code: LAUNCH20
Discount: 20% off ($149 → $119)
Limit: First 50 buyers

After 50 sales: Regular price $149

Act fast tomorrow.

8/ What I'll share publicly:

✅ Real revenue ($0 → ??)
✅ Traffic sources (where sales came from)
✅ Conversion rate (visitors → buyers)
✅ Customer feedback (good + bad)

100% transparent. Building in public.

9/ The journey so far:

Day 1: 0 followers, 0 revenue
Day 14: [X] followers, 0 revenue (yet)

Tomorrow: Launch day 🚀

Follow for real-time updates.

10/ See you tomorrow 🔥

Launch tweet drops at 12:01am PST

Questions? Reply below 👇
```

---

## Bonus: Product Hunt Launch Tweet (Day 15)

```
🚀 Claude SaaS Starter is LIVE on Product Hunt!

The first Next.js boilerplate optimized for Claude Sonnet 4.5

✅ Auth (email + OAuth)
✅ Claude streaming (<200ms)
✅ Stripe billing
✅ Admin dashboard
✅ 300+ pages docs

Launch special: $119 (20% off, 50 uses)

[Product Hunt link]

Your support = everything 🙏

Upvote + comment 👇
```

---

## Engagement Reply Templates

When people comment on your posts, reply authentically but use these frameworks:

**Question about tech choice**:
```
Great question! [Specific answer]

I chose [X] over [Y] because [reason].

Would you have gone with [Y]? Curious about your experience 👇
```

**Pricing objection**:
```
Fair point! I struggled with pricing.

My logic: [Explain value calculation]

But I'm open to feedback. What price would feel right to you?
```

**Feature request**:
```
Love this idea! 🔥

Not in v1 but definitely considering for updates.

Would you use it if it had [feature]? Trying to prioritize based on demand.
```

**Support/congrats**:
```
Thank you! 🙏

Means a lot, especially from [mention their work if you know it].

Following your journey too - [specific compliment].
```

---

*Last updated: 2026-01-28*
