# Show HN Post — Claude SaaS Starter

> Draft pour Hacker News. Ton technique et humble. Pas de marketing.

**Timing** : Lundi 9 fév, 23h KST (9am EST)

---

## Title

```
Show HN: Claude SaaS Starter – Next.js boilerplate built for Claude's streaming API
```

## URL

```
https://bydaewon.gumroad.com/l/claude-saas-starter
```

## Maker Comment (post immédiatement après)

```
Hi HN,

I built this because every SaaS boilerplate I found was OpenAI-first. Claude's SSE streaming differs from OpenAI's — the Anthropic SDK's messages.stream() returns a different event structure, and you need a custom ReadableStream transform to pipe it as Server-Sent Events on Edge Runtime.

The stack:

- Next.js 16 (App Router, TypeScript)
- Supabase for auth and PostgreSQL (with RLS)
- Anthropic SDK for Claude streaming
- Stripe for subscription billing (full webhook lifecycle)
- Vitest for testing (40 tests)

The streaming API route transforms Anthropic SDK events into SSE format and runs on Edge Runtime for low-latency. On the client, a React hook (useClaudeStream) handles SSE parsing, text delta buffering, and error recovery.

The non-streaming parts are fairly standard SaaS infrastructure: Supabase Auth with middleware route protection, Stripe webhooks for the subscription lifecycle (checkout, updates, cancellations, failed payments), usage metering that logs token counts non-blocking via the Supabase REST API.

I wrote 1,300 lines of documentation across 4 guides — setup, Stripe configuration, OAuth setup, and a quick-start. The guides assume zero prior knowledge of Supabase, Stripe, or the Anthropic API.

$149 on Gumroad (or $119 with code LAUNCH20).

Happy to answer technical questions about the Claude streaming implementation or any of the architecture decisions.
```

---

## Notes pour le jour J

### À faire
- [ ] Poster entre 9-10am EST (pic de trafic HN)
- [ ] Poster le maker comment dans les 2 minutes
- [ ] Rester disponible 4-6h pour répondre à chaque commentaire
- [ ] Ton : factuel, technique, humble. Zéro emojis sur HN.

### Risques identifiés

1. **Lien vers page de vente (pas de code visible)**
   - Mitigation : le maker comment est très technique, montre qu'on sait de quoi on parle
   - Si quelqu'un demande du code : partager des snippets dans les commentaires

2. **"Why not open-source?"**
   - Réponse honnête : "I'm an indie dev trying to build sustainable income from developer tools. The code quality and documentation are the value — happy to share more snippets if that helps evaluate."

3. **"This is just a wrapper"**
   - Réponse : expliquer les différences techniques concrètes (SSE transform, Edge Runtime compatibility, non-blocking usage logging, full Stripe webhook lifecycle)

4. **Pricing pushback**
   - Réponse : "40+ hours of development, 1,300 lines of docs. The math works out to about $3.50/hr of saved development time."

### Réponses types

**Question technique :**
```
Good question. [Answer with specifics and code snippets if relevant.]

The tradeoff was [X vs Y]. I went with [X] because [concrete reason].
```

**Critique constructive :**
```
Fair point. [Acknowledge the valid part.]

[Explain your reasoning or concede if they're right.]
```

**"Why paid?" :**
```
Indie dev building sustainable products. The value is in the time saved (40h → 2h) and the documentation quality (1,300 lines, zero assumptions).

Happy to share more code snippets if that helps evaluate whether it's worth it for your use case.
```

---

*Created: 2026-02-08*
