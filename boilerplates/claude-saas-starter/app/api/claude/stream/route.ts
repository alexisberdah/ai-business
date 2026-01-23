import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { messages, systemPrompt } = await req.json()

    // Create streaming response
    const stream = await anthropic.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: systemPrompt || 'You are a helpful AI assistant powered by Claude.',
      messages,
    })

    // Transform Anthropic stream to Server-Sent Events
    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          // Handle text deltas
          stream.on('text', (text) => {
            const data = `data: ${JSON.stringify({ type: 'text', text })}\n\n`
            controller.enqueue(encoder.encode(data))
          })

          // Handle completion
          stream.on('message', (message) => {
            const data = `data: ${JSON.stringify({ type: 'done', message })}\n\n`
            controller.enqueue(encoder.encode(data))
          })

          // Handle errors
          stream.on('error', (error) => {
            const data = `data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`
            controller.enqueue(encoder.encode(data))
            controller.close()
          })

          // Wait for stream to finish
          await stream.finalMessage()
          controller.close()
        } catch (error) {
          const data = `data: ${JSON.stringify({
            type: 'error',
            error: error instanceof Error ? error.message : 'Unknown error'
          })}\n\n`
          controller.enqueue(encoder.encode(data))
          controller.close()
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Claude API Error:', error)
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
