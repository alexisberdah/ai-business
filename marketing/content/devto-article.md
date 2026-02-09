# Building a Production-Ready Claude Streaming API with Next.js Edge Runtime

> Article technique pour Dev.to. Already published Feb 9.
> Tags: #nextjs #claude #ai #webdev
> UPDATE Feb 10: Add GitHub repo link + softer CTA

---

<!-- DEBUT ARTICLE — copier ci-dessous dans Dev.to -->

Every AI tutorial shows you OpenAI streaming. But if you're building with Claude (Anthropic), the implementation is meaningfully different. Here's how I built a production-ready streaming API for Claude Sonnet using Next.js Edge Runtime and Server-Sent Events.

**Update**: I've open-sourced the streaming module as a standalone package. You can grab it here: [claude-streaming-nextjs on GitHub](https://github.com/alexisberdah/claude-streaming-nextjs)

## The Problem

Most "AI streaming" examples look like this:

```typescript
// OpenAI-style (what every tutorial shows)
const stream = await openai.chat.completions.create({
  model: 'gpt-4',
  messages,
  stream: true,
})
// ...pipe to response
```

Claude's API is different. The Anthropic SDK's `messages.stream()` returns a different event structure. You can't just swap the model name and expect it to work.

## Architecture

```
Client (React) → POST /api/claude/stream → Edge Runtime → Anthropic SDK → SSE → Client
```

Three key decisions:

1. **Edge Runtime** — deployed globally, no cold starts, sub-50ms overhead
2. **Server-Sent Events** — HTTP-based, native browser support, built-in reconnection
3. **Custom ReadableStream** — transforms Anthropic SDK events into SSE format

## Step 1: The Edge API Route

The API route runs on Edge Runtime for global low-latency deployment:

```typescript
// app/api/claude/stream/route.ts
import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(req: NextRequest) {
  const { messages } = await req.json()

  // Create the Anthropic streaming response
  const stream = await anthropic.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages,
  })

  // Transform into Server-Sent Events
  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      stream.on('text', (text) => {
        const data = `data: ${JSON.stringify({ type: 'text', text })}\n\n`
        controller.enqueue(encoder.encode(data))
      })

      stream.on('message', (message) => {
        const data = `data: ${JSON.stringify({ type: 'done', message })}\n\n`
        controller.enqueue(encoder.encode(data))
      })

      stream.on('error', (error) => {
        const data = `data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`
        controller.enqueue(encoder.encode(data))
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

### Why You Can't Just Pipe the SDK Stream

The Anthropic SDK's `stream.toReadableStream()` returns raw SDK events. For a production SSE implementation, you want to:

1. **Normalize the event types** — `text` deltas, `done` for completion, `error` for failures
2. **Format as SSE** — each event needs the `data: {json}\n\n` format
3. **Handle the message event** — extract usage data (input/output tokens) for metering
4. **Close cleanly** — the controller must close after the final message

## Step 2: The Client-Side Hook

On the client, a custom React hook parses the SSE stream:

```typescript
// lib/claude/use-claude-stream.ts
'use client'

import { useState, useCallback } from 'react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface StreamEvent {
  type: 'text' | 'done' | 'error'
  text?: string
  error?: string
}

export function useClaudeStream() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(async (content: string) => {
    setIsStreaming(true)
    setError(null)

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    }

    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage, assistantMessage])

    try {
      const response = await fetch('/api/claude/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.concat(userMessage).map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (reader) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const event: StreamEvent = JSON.parse(line.slice(6))

            if (event.type === 'text' && event.text) {
              setMessages(prev => {
                const updated = [...prev]
                const last = updated[updated.length - 1]
                if (last.role === 'assistant') {
                  last.content += event.text
                }
                return updated
              })
            }
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send')
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setIsStreaming(false)
    }
  }, [messages])

  return { messages, isStreaming, error, sendMessage }
}
```

### Key Detail: SSE Buffer Handling

The line `buffer = lines.pop() || ''` is critical. SSE events can arrive split across chunks — the last item in the split might be an incomplete event. By keeping it in the buffer and prepending it to the next chunk, you avoid parsing errors on partial JSON.

## Step 3: Usage Metering (Non-Blocking)

In production, you want to track every API call. The challenge: you don't want metering to slow down the streaming response.

The solution is fire-and-forget logging via `fetch` to your database's REST API:

```typescript
// Called after stream completes — non-blocking
async function logUsageAsync(
  userId: string,
  inputTokens: number,
  outputTokens: number,
  durationMs: number
) {
  try {
    await fetch(`${process.env.SUPABASE_URL}/rest/v1/usage_logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!,
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({
        user_id: userId,
        input_tokens: inputTokens,
        output_tokens: outputTokens,
        total_tokens: inputTokens + outputTokens,
        request_duration_ms: durationMs,
      }),
    })
  } catch (err) {
    console.error('Usage logging failed:', err)
    // Don't throw — metering failure shouldn't break the user experience
  }
}
```

This runs after the stream completes via the `message` event handler. It never blocks the response. If logging fails, the user still gets their streaming response.

## Step 4: Error Handling

Claude-specific errors you need to handle:

1. **Rate limiting** — Anthropic returns 429 with `retry-after` header
2. **Overloaded** — 529 status, the model is temporarily unavailable
3. **Context length exceeded** — when your conversation history is too long

```typescript
stream.on('error', (error) => {
  // Send error event to client
  const data = `data: ${JSON.stringify({
    type: 'error',
    error: error.message
  })}\n\n`
  controller.enqueue(encoder.encode(data))
  controller.close()
})
```

On the client side, the hook sets the error state and removes the empty assistant message placeholder. The UI can then show a retry button.

## Performance

With this architecture on Vercel Edge:

- **Time-to-first-token**: ~150-200ms (includes Anthropic API latency)
- **Edge overhead**: <50ms (vs 200-500ms for traditional serverless)
- **No cold starts**: Edge functions are always warm

The bottleneck is always the Anthropic API response time, not your infrastructure.

## Get the Code

The streaming module (API route + React hook + example) is **open-source on GitHub**:

**[claude-streaming-nextjs](https://github.com/alexisberdah/claude-streaming-nextjs)** — MIT license, clone and run in 2 minutes.

## The Full Picture

The streaming API is one piece of a production SaaS. If you need the complete stack — authentication (Supabase Auth), billing (Stripe subscriptions with full webhook lifecycle), admin dashboard, usage metering, 40 tests, and 1,300+ lines of documentation — I packaged it all into [Claude SaaS Starter](https://bydaewon.gumroad.com/l/claude-saas-starter) ($149).

But the streaming architecture above is the core pattern, and it's free. If you're building with Claude and Next.js, start with the GitHub repo.

---

*Have questions about the implementation? Drop them in the comments — happy to go deeper on any part of the architecture.*

<!-- FIN ARTICLE -->

---

## Update Notes (Feb 10)

**Changes from published version**:
1. Added "Update" banner at top with GitHub repo link
2. Replaced direct Gumroad CTA with GitHub repo as primary CTA
3. Gumroad mention moved to secondary "Full Picture" section with softer tone
4. Flow is now: article (free) -> repo (free) -> "want everything? -> paid"
5. No more bait-and-switch feeling

**To update on Dev.to**:
- Edit the existing article at https://dev.to/bydaewon/building-a-production-ready-claude-streaming-api-with-nextjs-edge-runtime-3e7
- Add the "Update" banner after the first paragraph
- Replace the final CTA section
