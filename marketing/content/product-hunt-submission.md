# Product Hunt Submission — FINAL (Ready to Submit)

> Copy-paste chaque section dans le formulaire PH le mercredi 12 fev.
> Compte PH : @bydaewon (cree via Twitter)

---

## Product Name

```
Claude SaaS Starter
```

## Tagline (43/60 characters)

```
Launch your Claude-powered SaaS in 2 hours
```

## Website URL

```
https://bydaewon.gumroad.com/l/claude-saas-starter
```

## Description (236/260 characters)

```
The only Next.js boilerplate built for Claude Sonnet 4.5. Auth, real-time streaming, Stripe billing, admin dashboard, 40 tests, and 1,300+ lines of documentation. Go from git clone to production in hours, not weeks.
```

## Topics (select these 4)

1. Developer Tools
2. SaaS
3. Artificial Intelligence
4. Tech

## Pricing

```
$149 (one-time purchase)
```

## Gallery (5 images, order matters)

| Slot | File | What it shows |
|------|------|---------------|
| 1 | `cover.png` | Product cover with branding |
| 2 | `screenshot-1.png` | Landing page hero |
| 3 | `screenshot-2.png` | Chat interface with Claude streaming |
| 4 | `screenshot-3.png` | Admin dashboard with user stats |
| 5 | `screenshot-5.png` | Documentation quality (setup guide) |

**EXCLURE** : `screenshot-4.png` (pricing page — cree de la confusion avec le modele one-time purchase sur Gumroad)

## Links

| Field | URL |
|-------|-----|
| Website | https://bydaewon.gumroad.com/l/claude-saas-starter |
| Twitter | https://x.com/bydaewon |

---

## Maker Comment (post dans les 2 minutes apres launch)

```
Hey Product Hunt!

I'm Daewon, indie dev building AI-powered tools. I built Claude SaaS Starter because every boilerplate I found was OpenAI-first. Claude Sonnet 4.5 has better streaming and longer context, but zero dedicated tooling existed.

So I built the first Claude-optimized Next.js starter kit from scratch.

What's different:

- Claude-first SSE streaming on Edge Runtime (sub-200ms time-to-first-token)
- Custom useClaudeStream React hook with real-time text deltas and error recovery
- Non-blocking usage metering via Supabase REST API
- Full Stripe webhook lifecycle (checkout, updates, cancellations, failed payments)
- 40 tests (92-100% coverage), 1,300+ lines of documentation across 4 guides

The full stack: Next.js 16 (App Router, TypeScript, Tailwind 4, shadcn/ui), Supabase (Auth + PostgreSQL + RLS), Anthropic SDK, Stripe.

The documentation assumes zero prior knowledge of Supabase, Stripe, or the Anthropic API. Each guide includes troubleshooting for the 10 most common issues.

$149 on Gumroad, or $119 with code LAUNCH20 (first 50 buyers).

Happy to answer any technical questions about the Claude streaming implementation or the architecture decisions.
```

---

## Launch Day Checklist (Jeudi 12 fev)

### Timing

```
Paris: 9:01am CET = 12:01am PST (debut du jour PH)
```

### Sequence

- [ ] 9:00am : Verifier que Gumroad est live + coupon LAUNCH20 actif
- [ ] 9:01am : Soumettre le produit sur PH (ou le hunter le fait)
- [ ] 9:03am : Poster le maker comment (copier ci-dessus)
- [ ] 9:05am : Tweet de lancement + pin
- [ ] 9:10am : Commencer les DMs (50-100 personnes)
- [ ] 9:00am - 1:00pm : Repondre a CHAQUE commentaire PH < 5 min
- [ ] Toute la journee : Rester disponible, engager partout

### Tweet de lancement (poster + pin)

```
Claude SaaS Starter is LIVE on Product Hunt!

The only Next.js boilerplate built for Claude Sonnet 4.5.

Auth + streaming + Stripe billing + admin dashboard + 40 tests + 1,300 lines of docs.

$119 with code LAUNCH20 (first 50 buyers).

[Product Hunt link]

#buildinpublic
```

---

## Reponses types pour les commentaires PH

### Question technique

```
Good question. [Reponse specifique avec details techniques.]

The tradeoff was [X vs Y]. I went with [X] because [raison concrete].
```

### "Why not open-source?"

```
Indie dev building sustainable income from developer tools. The value is in the time saved (40h → 2h) and the documentation quality (1,300 lines, zero assumptions).

Happy to share code snippets if that helps evaluate.
```

### "Why paid? / Too expensive"

```
40+ hours of development, 1,300 lines of docs. A senior dev at $100/hr would spend $4,000+ building this from scratch. $149 felt like a fair middle ground.

But genuine question: what price would feel right to you?
```

### "This is just a wrapper"

```
Fair point on the surface, but the implementation details matter:

- Claude's SSE format needs a custom ReadableStream transform (you can't just pipe the Anthropic SDK)
- Edge Runtime has specific constraints for streaming
- Stripe webhook lifecycle handling (checkout, updates, cancellations, failed payments) is 500+ lines alone
- Non-blocking usage metering that doesn't slow down responses

The streaming architecture is the core differentiator. Happy to share specific code if helpful.
```

### Positive / Support

```
Thank you! Appreciate it.

Let me know if you launch something on PH — happy to return the support.
```

---

*Created: 2026-02-08*
*Launch: 2026-02-12 (mercredi)*
