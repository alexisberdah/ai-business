import { http, HttpResponse } from 'msw'

/**
 * MSW handlers for mocking external APIs in integration tests
 */
export const handlers = [
  // Mock Anthropic Claude API - Streaming response
  http.post('https://api.anthropic.com/v1/messages', async ({ request }) => {
    const body = await request.json()

    // Simulate streaming Server-Sent Events (SSE) response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        // Message start event
        controller.enqueue(
          encoder.encode('event: message_start\ndata: {"type":"message_start"}\n\n')
        )

        // Content block start
        controller.enqueue(
          encoder.encode(
            'event: content_block_start\ndata: {"type":"content_block_start","index":0}\n\n'
          )
        )

        // Content block delta (the actual text)
        controller.enqueue(
          encoder.encode(
            'event: content_block_delta\ndata: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"Hello"}}\n\n'
          )
        )

        controller.enqueue(
          encoder.encode(
            'event: content_block_delta\ndata: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" from"}}\n\n'
          )
        )

        controller.enqueue(
          encoder.encode(
            'event: content_block_delta\ndata: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" Claude!"}}\n\n'
          )
        )

        // Content block stop
        controller.enqueue(
          encoder.encode('event: content_block_stop\ndata: {"type":"content_block_stop"}\n\n')
        )

        // Message delta with usage
        controller.enqueue(
          encoder.encode(
            'event: message_delta\ndata: {"type":"message_delta","delta":{"stop_reason":"end_turn"},"usage":{"output_tokens":10}}\n\n'
          )
        )

        // Message stop
        controller.enqueue(encoder.encode('event: message_stop\ndata: {"type":"message_stop"}\n\n'))

        controller.close()
      },
    })

    return new HttpResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  }),

  // Mock Stripe Customer Creation
  http.post('https://api.stripe.com/v1/customers', async () => {
    return HttpResponse.json({
      id: 'cus_mock_12345',
      email: 'test@example.com',
      metadata: {
        supabase_user_id: 'mock-user-id',
      },
    })
  }),

  // Mock Stripe Checkout Session Creation
  http.post('https://api.stripe.com/v1/checkout/sessions', async () => {
    return HttpResponse.json({
      id: 'cs_test_12345',
      url: 'https://checkout.stripe.com/c/pay/cs_test_12345',
      customer: 'cus_mock_12345',
    })
  }),

  // Mock Stripe Customer Portal Session Creation
  http.post('https://api.stripe.com/v1/billing_portal/sessions', async () => {
    return HttpResponse.json({
      id: 'bps_test_12345',
      url: 'https://billing.stripe.com/p/session/test_12345',
    })
  }),
]

/**
 * Handler for simulating API errors
 */
export const errorHandlers = [
  // Claude API error - Rate limit
  http.post('https://api.anthropic.com/v1/messages', async () => {
    return new HttpResponse(
      JSON.stringify({
        error: {
          type: 'rate_limit_error',
          message: 'Rate limit exceeded',
        },
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }),

  // Stripe API error
  http.post('https://api.stripe.com/v1/*', async () => {
    return new HttpResponse(
      JSON.stringify({
        error: {
          type: 'api_error',
          message: 'An error occurred',
        },
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }),
]
