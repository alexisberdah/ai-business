import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(req: NextRequest) {
  const startTime = Date.now()

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

    // Track usage metrics
    let inputTokens = 0
    let outputTokens = 0

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
          stream.on('message', async (message) => {
            // Extract usage data
            if (message.usage) {
              inputTokens = message.usage.input_tokens || 0
              outputTokens = message.usage.output_tokens || 0
            }

            const data = `data: ${JSON.stringify({ type: 'done', message })}\n\n`
            controller.enqueue(encoder.encode(data))

            // Log usage to database (non-blocking)
            logUsageAsync(
              user.id,
              'claude-sonnet-4-20250514',
              inputTokens,
              outputTokens,
              Date.now() - startTime
            )
          })

          // Handle errors
          stream.on('error', (error) => {
            const data = `data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`
            controller.enqueue(encoder.encode(data))
            controller.close()

            // Log error usage
            logUsageAsync(
              user.id,
              'claude-sonnet-4-20250514',
              inputTokens,
              outputTokens,
              Date.now() - startTime,
              error.message
            )
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

          // Log error usage
          logUsageAsync(
            user.id,
            'claude-sonnet-4-20250514',
            inputTokens,
            outputTokens,
            Date.now() - startTime,
            error instanceof Error ? error.message : 'Unknown error'
          )
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

/**
 * Log usage asynchronously (non-blocking)
 * Uses Supabase REST API directly for edge runtime compatibility
 */
async function logUsageAsync(
  userId: string,
  model: string,
  inputTokens: number,
  outputTokens: number,
  durationMs: number,
  error?: string
) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase configuration for usage logging')
      return
    }

    await fetch(`${supabaseUrl}/rest/v1/usage_logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        user_id: userId,
        model,
        input_tokens: inputTokens,
        output_tokens: outputTokens,
        total_tokens: inputTokens + outputTokens,
        messages_count: 1,
        request_duration_ms: durationMs,
        error: error || null,
      }),
    })
  } catch (err) {
    console.error('Failed to log usage:', err)
  }
}
