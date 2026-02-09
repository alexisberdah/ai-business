# Product Hunt Submission — REVISED (GitHub-First Strategy)

> Postponed from Feb 12 to ~Feb 20 (Thu).
> Now references GitHub repo as primary asset.
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
https://github.com/alexisberdah/claude-streaming-nextjs
```

> Note: Primary link is the FREE GitHub repo. Gumroad link in description/maker comment.

## Description (255/260 characters)

```
Open-source Claude streaming module (SSE + React hook) + full production SaaS boilerplate. Auth, real-time AI streaming, Stripe billing, admin dashboard, 40 tests, 1,300+ lines of docs. Free core, paid full stack.
```

## Topics (select these 4)

1. Developer Tools
2. Open Source
3. Artificial Intelligence
4. SaaS

## Pricing

```
Free (open-source core) / $149 (full boilerplate)
```

## Gallery (5 images, order matters)

| Slot | File | What it shows |
|------|------|---------------|
| 1 | `cover.png` | Product cover with branding |
| 2 | `screenshot-1.png` | Landing page hero |
| 3 | `screenshot-2.png` | Chat interface with Claude streaming |
| 4 | `screenshot-3.png` | Admin dashboard with user stats |
| 5 | `screenshot-5.png` | Documentation quality (setup guide) |

**EXCLURE** : `screenshot-4.png` (pricing page)

## Links

| Field | URL |
|-------|-----|
| Website | https://github.com/alexisberdah/claude-streaming-nextjs |
| Twitter | https://x.com/bydaewon |

---

## Maker Comment (post dans les 2 minutes apres launch)

```
Hey Product Hunt!

I'm Daewon, indie dev building AI-powered tools.

I built Claude SaaS Starter because every boilerplate I found was OpenAI-first. Claude's streaming API works differently — the Anthropic SDK returns a different event structure, and you need a custom ReadableStream transform to pipe it as SSE.

So I built the streaming module from scratch and open-sourced it:
https://github.com/alexisberdah/claude-streaming-nextjs

The open-source part gives you:
- Edge Runtime API route (transforms Anthropic SDK events → SSE)
- useClaudeStream React hook (SSE parsing, text delta buffering, error recovery)
- Minimal example (clone and run in 2 minutes)

The full paid boilerplate ($149) adds everything else for production:
- Supabase Auth (email + Google/GitHub OAuth) with middleware route protection
- Stripe subscriptions with full webhook lifecycle handling
- Admin dashboard (user management, usage analytics)
- 40 tests (92-100% coverage)
- 1,300+ lines of documentation across 4 setup guides

The documentation assumes zero prior knowledge of Supabase, Stripe, or the Anthropic API.

Start with the free repo. If you need the full production stack, the boilerplate saves ~40 hours of wiring: https://bydaewon.gumroad.com/l/claude-saas-starter (code LAUNCH20 for $119).

Happy to answer any technical questions!
```

---

## Launch Day Checklist (~Thu Feb 20)

### Timing

```
Seoul: 17:01 KST = 12:01am PST (debut du jour PH)
```

### Sequence

- [ ] Verify GitHub repo is public + README polished
- [ ] Verify Gumroad is live + coupon LAUNCH20 active
- [ ] 17:01 KST : Submit product on PH
- [ ] 17:03 : Post maker comment (copy above)
- [ ] 17:05 : Launch tweet + pin
- [ ] 17:10 : Email blast to mini list (collected from GitHub repo)
- [ ] 17:00-21:00 : Reply to EVERY PH comment < 5 min
- [ ] All day : Stay available, engage everywhere

### Launch Tweet (post + pin)

```
Claude SaaS Starter is LIVE on Product Hunt!

I open-sourced the Claude streaming module (SSE + React hook):
https://github.com/alexisberdah/claude-streaming-nextjs

The full production boilerplate (auth + Stripe + admin + 40 tests + 1,300 lines of docs) is $119 with code LAUNCH20.

[Product Hunt link]

#buildinpublic #opensource
```

---

## Reponses types pour les commentaires PH

### Question technique

```
Good question. [Reponse specifique avec details techniques.]

The tradeoff was [X vs Y]. I went with [X] because [raison concrete].
```

### "Why not fully open-source?"

```
The streaming module (the interesting technical part) is fully open-source. The paid part is SaaS infrastructure — auth, Stripe webhooks, admin dashboard, tests, docs. Useful but not novel.

I'm an indie dev building sustainable income. The open-source core is the community contribution; the paid boilerplate is the business model.
```

### "Why paid? / Too expensive"

```
The open-source streaming module is free — that's the core value.

$149 for the full boilerplate saves ~40 hours of wiring (auth, Stripe, admin, tests, docs). A senior dev at $100/hr would spend $4,000+ building it from scratch.

But genuinely: what price would feel right to you?
```

### Positive / Support

```
Thank you! Appreciate it.

If you try the open-source module, I'd love to hear how it goes. And let me know if you launch something on PH — happy to return the support.
```

---

## Why this version works better

| Aspect | V1 (Feb 12 plan) | V2 (Feb 20 revised) |
|--------|-------------------|---------------------|
| Primary link | Gumroad ($149) | GitHub repo (free) |
| Pricing display | "$149 (one-time)" | "Free / $149 full stack" |
| Topics | Developer Tools, SaaS, AI, Tech | Developer Tools, **Open Source**, AI, SaaS |
| Social proof | None | GitHub stars + community engagement |
| Pre-launch | Cold | 7-10 days of Reddit engagement + repo feedback |

---

*Created: 2026-02-08*
*Revised: 2026-02-10 (postponed to Feb 20, GitHub-first strategy)*
