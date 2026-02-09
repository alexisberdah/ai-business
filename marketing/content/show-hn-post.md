# Show HN Post — Claude SaaS Starter (REVISED)

> Rewritten to center on open-source GitHub repo, not Gumroad.
> Previous version (Feb 9): 1 point, 0 comments — dead.

**Timing** : ~Feb 18 (mardi), 9am EST — coordinated with Reddit + Twitter
**Pre-requisite** : GitHub repo `claude-streaming-nextjs` must be published first

---

## Title

```
Show HN: Claude Streaming for Next.js — open-source SSE + React hook
```

## URL

```
https://github.com/alexisberdah/claude-streaming-nextjs
```

## Maker Comment (post immediately after)

```
Hi HN,

I open-sourced the streaming module from my Claude SaaS project. It solves a specific problem: Anthropic's SDK returns a different event structure than OpenAI, and you can't just pipe it as SSE to the client.

What's in the repo:

- An Edge Runtime API route that transforms Anthropic SDK stream events into SSE format
- A React hook (useClaudeStream) that handles SSE parsing, text delta buffering, and error recovery
- A minimal example you can run with `npx create-next-app` + `npm install`

The key implementation detail: the Anthropic SDK's `messages.stream()` emits `text`, `message`, and `error` events. You need a custom ReadableStream to normalize these into `data: {json}\n\n` SSE format. The hook on the client side buffers partial events (SSE can split across chunks) and handles reconnection.

I built this while putting together a full SaaS boilerplate with auth, Stripe, admin dashboard, etc. The streaming was the trickiest part to get right, so I figured it would be the most useful piece to open-source separately.

The full production boilerplate (auth + billing + admin + 40 tests + docs) is available as a paid option if anyone needs the complete stack: https://bydaewon.gumroad.com/l/claude-saas-starter

Happy to answer questions about the SSE implementation or Claude-specific edge cases.
```

---

## Notes pour le jour J

### A faire
- [ ] Poster entre 9-10am EST (pic de trafic HN)
- [ ] Poster le maker comment dans les 2 minutes
- [ ] Rester disponible 4-6h pour repondre a chaque commentaire
- [ ] Ton : factuel, technique, humble. Zero emojis sur HN.

### Why this works better than v1

1. **Links to GitHub** (not a sales page) — HN rewards open-source
2. **Focused scope** — one module, not "here's everything I built"
3. **The paid part is a footnote** in the maker comment, not the pitch
4. **Technical depth** — explains the actual problem solved (SSE transform)
5. **Free to try** — anyone can clone and run it

### Reponses types

**"Why not just use Vercel AI SDK?"**
```
Good question. The Vercel AI SDK supports Anthropic, but it abstracts away the streaming layer. If you want control over the SSE format, custom error handling, or need to add usage metering at the stream level, you need the lower-level approach.

This gives you the raw SSE events so you can build whatever you need on top.
```

**"This is pretty simple code"**
```
Fair point — it's intentionally minimal. The tricky part isn't the code volume, it's knowing which Anthropic SDK events to handle and how to buffer partial SSE chunks. I spent a few hours debugging edge cases that aren't documented.
```

**"Why paid for the rest?"**
```
The streaming module is the interesting technical problem. The paid part is SaaS infrastructure (auth, Stripe webhooks, admin dashboard, tests, docs) — useful but not novel enough to open-source.

Indie dev trying to build sustainable income. The open-source part is the core value; the paid part saves you 30-40h of boilerplate wiring.
```

---

*Created: 2026-02-08*
*Revised: 2026-02-10 (pivot to GitHub-first strategy)*
