# Reddit Posts — Claude SaaS Starter (REVISED)

> Rewritten Feb 10 after r/ClaudeAI (removed: Rule 7) and r/nextjs (removed: Rule 2).
> Strategy: open-source repo first, paid product as secondary mention only.

---

## 1. r/ClaudeAI (~Feb 18, coordinated launch day)

**Rule 7 compliance**: "Must be free to try" — links to free GitHub repo
**Tone**: Community member sharing a tool, not selling

### Title

```
I open-sourced a Claude streaming module for Next.js — SSE API route + React hook
```

### Body

```
I've been building Claude-powered apps and kept re-implementing the same streaming infrastructure. So I extracted the core into an open-source package.

**The problem it solves**

The Anthropic SDK's `messages.stream()` returns a different event structure than OpenAI. You can't just swap the model name in an OpenAI streaming tutorial. Specifically:

- SSE events need a custom ReadableStream transform (the SDK's `.toReadableStream()` gives you raw events, not formatted SSE)
- Token counting works differently (input_tokens + output_tokens in the final message event)
- Error handling for rate limits (429) and overloaded (529) needs Anthropic-specific logic

**What's in the repo**

- Edge Runtime API route that transforms Anthropic SDK streams into SSE
- `useClaudeStream` React hook — handles SSE parsing, text delta buffering, error recovery
- Minimal example (Next.js App Router)
- MIT license

GitHub: https://github.com/alexisberdah/claude-streaming-nextjs

**Architecture**

```
Client → fetch('/api/claude/stream') → Edge Runtime → Anthropic SDK → SSE → Client
```

The hook gives you `{ messages, isStreaming, error, sendMessage }` — drop it into any React component.

**Key implementation detail**

SSE events can arrive split across chunks. The hook buffers partial events (`buffer = lines.pop() || ''`) and prepends them to the next chunk. Without this, you get JSON parse errors on ~5% of streams.

---

I also built a full SaaS boilerplate around this (auth, Stripe, admin, 40 tests) that's available as a paid option, but the streaming module is the part I thought would be most useful to the community on its own.

Happy to answer questions about the Claude API streaming edge cases.
```

---

## 2. r/nextjs (~Feb 18, coordinated launch day)

**Rule 2 compliance**: "No shilling" — pure technical content, zero commercial links in body
**Tone**: Architecture walkthrough, asking for technical feedback

### Title

```
How I handle Claude (Anthropic) SSE streaming on Next.js Edge Runtime — open-source hook + API route
```

### Body

```
I've been working on Claude API streaming in Next.js and wanted to share the architecture + get feedback from the community. I open-sourced the implementation.

**Why Claude streaming is different from OpenAI**

Most AI streaming tutorials use OpenAI or the Vercel AI SDK. If you use the Anthropic SDK directly, you hit a few gotchas:

1. `anthropic.messages.stream()` emits `text`, `message`, and `error` events — not a standard readable stream you can pipe
2. You need a custom `ReadableStream` to transform these into `data: {json}\n\n` SSE format
3. On Edge Runtime, you can't use Node.js stream APIs — everything goes through Web Streams
4. Partial SSE chunks arrive ~5% of the time and will break JSON.parse without buffering

**The implementation**

Two files:

**API Route** (`app/api/claude/stream/route.ts`):
- Runs on Edge Runtime (`export const runtime = 'edge'`)
- Calls `anthropic.messages.stream()` with the SDK
- Wraps in a `ReadableStream` that formats events as SSE
- Handles `text` (delta), `message` (completion + usage data), and `error` events separately
- Returns `Response` with `text/event-stream` headers

**React Hook** (`useClaudeStream.ts`):
- `fetch` POST to the API route
- Reads response via `ReadableStreamDefaultReader`
- Buffers partial SSE chunks (the key: `buffer = lines.pop() || ''`)
- Appends text deltas to assistant message state in real-time
- Returns `{ messages, isStreaming, error, sendMessage, clearMessages }`

**Performance on Vercel Edge**:
- Time-to-first-token: ~150-200ms (Anthropic API latency dominates)
- Edge overhead: <50ms
- No cold starts

**GitHub**: https://github.com/alexisberdah/claude-streaming-nextjs

I'm curious how others are handling AI streaming in App Router. Are you using the Vercel AI SDK, or rolling your own? Any edge cases I might be missing?
```

---

## 3. r/webdev (~Feb 18 or Feb 19, 1 day after main launch)

**Tone**: Educational, focuses on the SSE/streaming pattern (not Claude-specific)
**Strategy**: Broader developer audience, links to repo as reference implementation

### Title

```
Lessons learned implementing Server-Sent Events with AI streaming on Edge Runtime (Next.js + Claude)
```

### Body

```
I've been building real-time AI streaming and ran into several SSE edge cases that aren't well-documented. Sharing what I learned in case it helps others.

**Context**: I built a streaming integration for Claude (Anthropic's AI) on Next.js Edge Runtime. The patterns apply to any SSE implementation, not just AI.

**Lesson 1: You can't pipe SDK streams directly as SSE**

Most AI SDKs give you a stream object, but it's not in SSE format. You need to:

1. Listen for specific event types (`text`, `message`, `error`)
2. Format each as `data: ${JSON.stringify(payload)}\n\n`
3. Enqueue into a `ReadableStream` controller
4. Close the controller when the stream ends

This is Web Streams API, not Node.js streams — important distinction on Edge Runtime.

**Lesson 2: SSE chunks split across reads (~5% of the time)**

When reading SSE via `ReadableStreamDefaultReader`, a single `read()` call might return a partial event. For example:

```
// First read:
"data: {\"type\":\"text\",\"te"

// Second read:
"xt\":\"Hello\"}\n\n"
```

The fix: buffer incomplete lines and prepend to the next chunk.

```typescript
const lines = buffer.split('\n\n')
buffer = lines.pop() || ''  // Keep the incomplete line
```

Without this, you get intermittent JSON parse errors that are painful to debug.

**Lesson 3: Edge Runtime has no Node.js stream APIs**

On Vercel Edge (or Cloudflare Workers), you can't use `Readable.from()` or `pipeline()`. Everything must use the Web Streams API (`ReadableStream`, `ReadableStreamDefaultReader`).

**Lesson 4: Error events need special handling**

If the upstream API errors mid-stream, you need to:
1. Send an error event to the client (`data: {"type":"error","error":"message"}`)
2. Close the stream controller
3. On the client, detect the error event and stop reading

Just closing the stream without an error event leaves the client hanging.

**The implementation**

I open-sourced the full thing: https://github.com/alexisberdah/claude-streaming-nextjs

It's Claude-specific but the SSE patterns are generic. Two files: an Edge API route + a React hook.

Anyone else building real-time streaming on Edge Runtime? What patterns have you found useful?
```

---

## Notes globales

### Strategie d'engagement pre-post (Feb 10-17)

Avant de poster, construire la credibilite sur chaque sub :

**r/ClaudeAI** (5-10 reponses utiles):
- Repondre aux questions sur Claude API, streaming, token management
- Partager des tips sur l'Anthropic SDK
- Sujets cibles : "Claude vs GPT for coding", "Claude API rate limits", "streaming issues"

**r/nextjs** (5-10 reponses utiles):
- Repondre aux questions sur App Router, Edge Runtime, Server Components
- Sujets cibles : "SSE in Next.js", "real-time streaming", "Edge vs Serverless"

**r/webdev** (3-5 reponses utiles):
- Repondre aux questions sur SSE, WebSockets vs SSE, streaming patterns
- Sujets cibles : "real-time updates", "server-sent events", "streaming API"

### Differences cles vs version 1

| Aspect | Version 1 (supprimee) | Version 2 (revisee) |
|--------|----------------------|---------------------|
| Lien principal | Gumroad ($149) | GitHub repo (gratuit) |
| Tone | "Buy my boilerplate" | "Here's a tool I built" |
| Mention payante | Dans le body | Footnote ou absente |
| Compliance | Violait Rule 7 + Rule 2 | Conforme |
| Engagement pre-post | 0 comments | 15-20 comments utiles |

---

*Created: 2026-02-08*
*Revised: 2026-02-10 (complete rewrite — GitHub-first, rule-compliant)*
