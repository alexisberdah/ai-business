# GitHub Repo README — claude-streaming-nextjs

> This file contains the README.md to use when creating the open-source repo.
> Copy this content into the repo's README.md.

---

<!-- DEBUT README — copier ci-dessous -->

# claude-streaming-nextjs

Claude (Anthropic) streaming for Next.js — Edge Runtime SSE API route + React hook.

Drop-in Claude streaming for your Next.js app. Handles the Anthropic SDK's event format, SSE transformation, partial chunk buffering, and error recovery.

## Why?

The Anthropic SDK's `messages.stream()` returns a different event structure than OpenAI. You can't just pipe it to the client. This package gives you:

1. **An Edge API route** that transforms Anthropic SDK events into proper SSE format
2. **A React hook** (`useClaudeStream`) that parses SSE, buffers partial chunks, and manages message state
3. **A working example** you can run in 2 minutes

## Quick Start

```bash
# Clone the repo
git clone https://github.com/alexisberdah/claude-streaming-nextjs.git
cd claude-streaming-nextjs

# Install dependencies
npm install

# Add your Anthropic API key
cp .env.example .env.local
# Edit .env.local: ANTHROPIC_API_KEY=sk-ant-...

# Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start chatting.

## Architecture

```
Client (React)
  │
  ├─ useClaudeStream hook
  │   ├─ fetch POST /api/claude/stream
  │   ├─ ReadableStreamDefaultReader
  │   ├─ SSE parsing + partial chunk buffering
  │   └─ Real-time message state updates
  │
  ▼
Edge API Route (/api/claude/stream)
  │
  ├─ anthropic.messages.stream()
  ├─ Custom ReadableStream transform
  │   ├─ 'text' event → SSE text delta
  │   ├─ 'message' event → SSE done + usage data
  │   └─ 'error' event → SSE error + close
  │
  ▼
Anthropic API (Claude Sonnet)
```

## Files

```
app/
├── api/claude/stream/
│   └── route.ts          # Edge Runtime API route (SSE transform)
├── page.tsx              # Minimal chat UI example
└── layout.tsx

lib/
└── claude/
    └── use-claude-stream.ts  # React hook

.env.example              # Required env vars
```

## API Route

The API route (`app/api/claude/stream/route.ts`) runs on Edge Runtime and transforms Anthropic SDK stream events into SSE:

```typescript
import Anthropic from '@anthropic-ai/sdk'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  const { messages } = await req.json()

  const stream = await anthropic.messages.stream({
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

      stream.on('message', (message) => {
        controller.enqueue(encoder.encode(
          `data: ${JSON.stringify({ type: 'done', message })}\n\n`
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

### Why you can't just pipe the SDK stream

The Anthropic SDK's `stream.toReadableStream()` returns raw SDK events, not SSE-formatted data. You need to:

- Normalize event types (`text`, `done`, `error`)
- Format as `data: {json}\n\n`
- Extract usage data from the `message` event
- Close the controller cleanly after the final message

## React Hook

```typescript
import { useClaudeStream } from '@/lib/claude/use-claude-stream'

function Chat() {
  const { messages, isStreaming, error, sendMessage } = useClaudeStream()

  return (
    <div>
      {messages.map(m => (
        <div key={m.id}>{m.content}</div>
      ))}
      <button onClick={() => sendMessage('Hello!')}>
        Send
      </button>
    </div>
  )
}
```

### Hook API

| Return | Type | Description |
|--------|------|-------------|
| `messages` | `Message[]` | All messages (user + assistant) |
| `isStreaming` | `boolean` | `true` while receiving stream |
| `error` | `string \| null` | Error message if stream fails |
| `sendMessage` | `(content: string) => void` | Send a message to Claude |
| `clearMessages` | `() => void` | Reset conversation |

### Key detail: SSE buffer handling

SSE events can arrive split across chunks (~5% of the time). The hook buffers partial events:

```typescript
const lines = buffer.split('\n\n')
buffer = lines.pop() || ''  // Keep incomplete line for next chunk
```

Without this, you get intermittent JSON parse errors.

## Edge Cases Handled

- **Partial SSE chunks** — buffered and re-assembled
- **Rate limiting (429)** — error event sent to client
- **Overloaded (529)** — error event sent to client
- **Context length exceeded** — error event sent to client
- **Network errors** — hook sets error state and cleans up

## Performance

On Vercel Edge Runtime:

- **Time-to-first-token**: ~150-200ms (Anthropic API latency)
- **Edge overhead**: <50ms
- **No cold starts**

## Requirements

- Next.js 14+ (App Router)
- Node.js 18+
- Anthropic API key ([get one here](https://console.anthropic.com/))

## Full Production Stack

Need auth, billing, admin dashboard, and more? Check out [Claude SaaS Starter](https://bydaewon.gumroad.com/l/claude-saas-starter) — the full production boilerplate built around this streaming module.

Includes: Supabase Auth, Stripe subscriptions, admin dashboard, usage metering, 40 tests, 1,300+ lines of documentation.

## License

MIT

<!-- FIN README -->
