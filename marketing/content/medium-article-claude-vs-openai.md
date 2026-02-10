# Medium Article — Claude API Streaming vs OpenAI: What's Actually Different

> SEO article for Medium. Google indexes Medium in hours.
> Target keywords: "claude api streaming", "claude vs openai streaming", "anthropic sdk nextjs"
> Tags: AI, Next.js, Claude, Anthropic, Web Development

---

<!-- DEBUT ARTICLE — copier ci-dessous dans Medium -->

# Claude API Streaming vs OpenAI: What's Actually Different (With Code)

If you've built streaming with OpenAI and try to do the same with Claude, you'll hit walls. The implementations look similar on the surface but differ in ways that will cost you hours of debugging.

I built a production streaming integration for both. Here are the concrete differences.

## 1. Stream Initialization

**OpenAI:**
```typescript
const stream = await openai.chat.completions.create({
  model: 'gpt-4',
  messages,
  stream: true,
})

// Returns an async iterable of chunks
for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content || ''
  // Use content
}
```

**Claude (Anthropic SDK):**
```typescript
const stream = anthropic.messages.stream({
  model: 'claude-sonnet-4-20250514',
  max_tokens: 4096,
  messages,
})

// Returns an event emitter, NOT an async iterable
stream.on('text', (text) => {
  // Use text
})

await stream.finalMessage()
```

**The difference:** OpenAI gives you an async iterable you can `for await` over. Anthropic gives you an event emitter with named events (`text`, `message`, `error`). You can't just swap one for the other.

## 2. SSE Event Format

If you're building a streaming API route (which you should be — never expose API keys to the client), you need to transform SDK events into Server-Sent Events.

**OpenAI → SSE:**
```typescript
for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content
  if (content) {
    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`))
  }
}
```

Straightforward. Iterate, format, send.

**Claude → SSE:**
```typescript
stream.on('text', (text) => {
  controller.enqueue(encoder.encode(
    `data: ${JSON.stringify({ type: 'text', text })}\n\n`
  ))
})

stream.on('message', (message) => {
  controller.enqueue(encoder.encode(
    `data: ${JSON.stringify({ type: 'done', usage: message.usage })}\n\n`
  ))
})

stream.on('error', (error) => {
  controller.enqueue(encoder.encode(
    `data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`
  ))
  controller.close()
})

await stream.finalMessage()
controller.close()
```

**The difference:** With Claude, you register event handlers and wait for `finalMessage()`. You need to handle three distinct event types. The `message` event gives you token usage data (useful for metering). The stream doesn't auto-close — you need to explicitly close the controller.

## 3. Token Counting

**OpenAI:** Token counts come in a separate API call (`tiktoken` library), or in the final chunk with `usage` if you set `stream_options: { include_usage: true }`.

**Claude:** Token counts are in the `message` event at the end of the stream:
```typescript
stream.on('message', (message) => {
  console.log(message.usage)
  // { input_tokens: 42, output_tokens: 128 }
})
```

This is actually nicer. You always get token counts, no extra config needed. But you need to wait for the stream to finish to get them.

## 4. Error Handling

Both APIs can fail mid-stream. The errors are different.

**OpenAI errors:**
- 429: Rate limited (has `Retry-After` header)
- 500: Server error
- Context length: returns error in the stream

**Claude errors:**
- 429: Rate limited (has `retry-after` header)
- **529: Overloaded** — this is Claude-specific. The model is temporarily at capacity. Not a rate limit on your account — it's a capacity issue on Anthropic's side.
- Context length: `max_tokens` validation happens before streaming starts

The 529 is the one that catches people off guard. OpenAI doesn't have an equivalent. You need to handle it specifically:

```typescript
stream.on('error', (error) => {
  if (error.status === 529) {
    // Anthropic is overloaded — retry after a delay
    // This is NOT your rate limit, it's their capacity
  }
})
```

## 5. Edge Runtime Compatibility

If you're deploying on Vercel Edge Runtime (or Cloudflare Workers), both SDKs work. But:

**OpenAI:** The `openai` package works natively on Edge. The async iterable pattern uses standard Web APIs.

**Claude:** The `@anthropic-ai/sdk` package also works on Edge, but the event emitter pattern can feel awkward in a `ReadableStream` context. You end up wrapping event handlers inside `new ReadableStream({ start(controller) { ... } })`.

The full Edge-compatible pattern for Claude:

```typescript
export const runtime = 'edge'

export async function POST(req: NextRequest) {
  const { messages } = await req.json()

  const stream = anthropic.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages,
  })

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      stream.on('text', (text) => {
        controller.enqueue(encoder.encode(
          `data: ${JSON.stringify({ type: 'text', text })}\n\n`
        ))
      })
      stream.on('message', () => {
        controller.enqueue(encoder.encode(
          `data: ${JSON.stringify({ type: 'done' })}\n\n`
        ))
      })
      stream.on('error', (error) => {
        controller.enqueue(encoder.encode(
          `data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`
        ))
        controller.close()
      })
      await stream.finalMessage()
      controller.close()
    },
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
```

## 6. Client-Side Parsing

On the client side, you need to parse the SSE stream. One gotcha that applies to both OpenAI and Claude but is rarely documented:

**SSE events can arrive split across chunks.** About 5% of the time, a single `read()` call from the `ReadableStreamDefaultReader` will return a partial event:

```
// First read:
"data: {\"type\":\"text\",\"te"

// Second read:
"xt\":\"Hello\"}\n\n"
```

The fix:
```typescript
let buffer = ''

while (true) {
  const { done, value } = await reader.read()
  if (done) break

  buffer += decoder.decode(value, { stream: true })
  const lines = buffer.split('\n\n')
  buffer = lines.pop() || '' // Keep incomplete line

  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const event = JSON.parse(line.slice(6))
      // Handle event
    }
  }
}
```

This applies regardless of whether you're streaming from OpenAI or Claude. But I've seen it bite more people with Claude because the text deltas tend to be smaller and more frequent.

## Summary

| Aspect | OpenAI | Claude (Anthropic) |
|--------|--------|-------------------|
| Stream type | Async iterable | Event emitter |
| Events | Chunk with `delta.content` | Named events: `text`, `message`, `error` |
| Token counts | Optional, needs config | Always in `message` event |
| Unique error | — | 529 Overloaded |
| Edge Runtime | Native | Works, needs `ReadableStream` wrapper |
| Close behavior | Auto-closes after last chunk | Needs explicit `controller.close()` |

## The Takeaway

If you're switching from OpenAI to Claude (or supporting both), don't assume the streaming implementation transfers. Plan for 4-6 hours of refactoring, mostly around the event model and SSE transformation.

If you want to skip the implementation work, I built a production-ready Next.js boilerplate with Claude streaming already wired up: [Claude SaaS Starter](https://bydaewon.gumroad.com/l/claude-saas-starter). It includes the Edge Runtime API route, a React hook for SSE parsing, Supabase Auth, Stripe billing, and 40 tests.

But the code above is everything you need to build it yourself.

---

*Building with Claude's API? I write about AI streaming, Next.js patterns, and building SaaS products. Follow for more.*

<!-- FIN ARTICLE -->

---

## SEO Notes

**Target keywords** (long-tail, low competition):
- "claude api streaming nextjs"
- "claude vs openai streaming"
- "anthropic sdk server sent events"
- "claude api edge runtime"
- "anthropic streaming react"

**Why Medium for SEO:**
- Google indexes Medium articles within hours (not weeks like a new blog)
- Medium has high domain authority
- Articles rank for long-tail dev queries
- Travis Nicholson: $15K on Gumroad from Medium articles in 90 days

**CTA strategy:**
- Article is 95% pure technical value
- Product mention is at the very end, after giving everything for free
- Reader who made it to the end is qualified (they actually need Claude streaming)
- No bait-and-switch — the article IS the full implementation
