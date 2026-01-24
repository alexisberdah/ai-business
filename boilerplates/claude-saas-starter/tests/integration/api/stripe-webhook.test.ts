import { describe, it, expect, vi, beforeEach } from 'vitest'
import type Stripe from 'stripe'

// Mock Next.js headers
vi.mock('next/headers', () => ({
  headers: vi.fn(),
}))

// Mock Stripe module
vi.mock('@/lib/stripe/server', () => ({
  stripe: {
    webhooks: {
      constructEvent: vi.fn(),
    },
  },
}))

// Mock Supabase client
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      upsert: vi.fn().mockResolvedValue({ error: null }),
      update: vi.fn(() => ({
        eq: vi.fn().mockResolvedValue({ error: null }),
      })),
    })),
  })),
}))

import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe/server'
import { POST } from '@/app/api/stripe/webhook/route'

describe('Stripe Webhook Handler', () => {
  const mockHeaders = new Headers()
  const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

  beforeEach(() => {
    vi.clearAllMocks()
    consoleErrorSpy.mockClear()
    consoleLogSpy.mockClear()
    mockHeaders.set('stripe-signature', 'valid-signature')
    vi.mocked(headers).mockResolvedValue(mockHeaders)
  })

  describe('Signature Verification', () => {
    it('should reject webhook with invalid signature', async () => {
      vi.mocked(stripe.webhooks.constructEvent).mockImplementation(() => {
        throw new Error('Invalid signature')
      })

      const request = new Request('http://localhost:3000/api/stripe/webhook', {
        method: 'POST',
        body: JSON.stringify({ type: 'test' }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toEqual({ error: 'Invalid signature' })
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Webhook signature verification failed:',
        expect.any(Error)
      )
    })

    it('should accept webhook with valid signature', async () => {
      const mockEvent: Stripe.Event = {
        id: 'evt_test_123',
        object: 'event',
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_test_123',
            metadata: {
              user_id: 'user-123',
            },
          } as Stripe.Checkout.Session,
        },
        api_version: '2024-12-18.acacia',
        created: Math.floor(Date.now() / 1000),
        livemode: false,
        pending_webhooks: 0,
        request: null,
      }

      vi.mocked(stripe.webhooks.constructEvent).mockReturnValue(mockEvent)

      const request = new Request('http://localhost:3000/api/stripe/webhook', {
        method: 'POST',
        body: JSON.stringify(mockEvent),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({ received: true })
    })
  })

  describe('checkout.session.completed', () => {
    it('should log checkout completion with user_id', async () => {
      const mockEvent: Stripe.Event = {
        id: 'evt_test_123',
        object: 'event',
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_test_123',
            metadata: {
              user_id: 'user-456',
            },
          } as Stripe.Checkout.Session,
        },
        api_version: '2024-12-18.acacia',
        created: Math.floor(Date.now() / 1000),
        livemode: false,
        pending_webhooks: 0,
        request: null,
      }

      vi.mocked(stripe.webhooks.constructEvent).mockReturnValue(mockEvent)

      const request = new Request('http://localhost:3000/api/stripe/webhook', {
        method: 'POST',
        body: JSON.stringify(mockEvent),
      })

      const response = await POST(request)

      expect(response.status).toBe(200)
      expect(consoleLogSpy).toHaveBeenCalledWith('Checkout completed for user user-456')
    })

    it('should handle missing user_id in checkout session', async () => {
      const mockEvent: Stripe.Event = {
        id: 'evt_test_123',
        object: 'event',
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_test_123',
            metadata: {},
          } as Stripe.Checkout.Session,
        },
        api_version: '2024-12-18.acacia',
        created: Math.floor(Date.now() / 1000),
        livemode: false,
        pending_webhooks: 0,
        request: null,
      }

      vi.mocked(stripe.webhooks.constructEvent).mockReturnValue(mockEvent)

      const request = new Request('http://localhost:3000/api/stripe/webhook', {
        method: 'POST',
        body: JSON.stringify(mockEvent),
      })

      const response = await POST(request)

      expect(response.status).toBe(200)
      expect(consoleErrorSpy).toHaveBeenCalledWith('No user_id in checkout session metadata')
    })
  })

  describe('customer.subscription.created/updated', () => {
    it('should upsert subscription on created event', async () => {
      const mockSubscription: Partial<Stripe.Subscription> = {
        id: 'sub_test_123',
        customer: 'cus_test_123',
        status: 'active',
        current_period_start: 1704067200,
        current_period_end: 1706745600,
        cancel_at_period_end: false,
        canceled_at: null,
        metadata: {
          user_id: 'user-789',
        },
        items: {
          object: 'list',
          data: [
            {
              id: 'si_test',
              price: {
                id: 'price_monthly',
              } as Stripe.Price,
            } as Stripe.SubscriptionItem,
          ],
          has_more: false,
          url: '/v1/subscription_items',
        },
      }

      const mockEvent: Stripe.Event = {
        id: 'evt_test_123',
        object: 'event',
        type: 'customer.subscription.created',
        data: {
          object: mockSubscription as Stripe.Subscription,
        },
        api_version: '2024-12-18.acacia',
        created: Math.floor(Date.now() / 1000),
        livemode: false,
        pending_webhooks: 0,
        request: null,
      }

      const mockUpsert = vi.fn().mockResolvedValue({ error: null })
      const mockFrom = vi.fn(() => ({
        upsert: mockUpsert,
      }))

      // Re-mock Supabase for this specific test
      const { createClient } = await import('@supabase/supabase-js')
      vi.mocked(createClient).mockReturnValue({
        from: mockFrom,
      } as any)

      vi.mocked(stripe.webhooks.constructEvent).mockReturnValue(mockEvent)

      const request = new Request('http://localhost:3000/api/stripe/webhook', {
        method: 'POST',
        body: JSON.stringify(mockEvent),
      })

      const response = await POST(request)

      expect(response.status).toBe(200)
      expect(mockFrom).toHaveBeenCalledWith('subscriptions')
      expect(mockUpsert).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: 'user-789',
          stripe_customer_id: 'cus_test_123',
          stripe_subscription_id: 'sub_test_123',
          stripe_price_id: 'price_monthly',
          status: 'active',
          cancel_at_period_end: false,
          canceled_at: null,
        })
      )
    })

    it('should handle cancel_at_period_end flag correctly', async () => {
      const mockSubscription: Partial<Stripe.Subscription> = {
        id: 'sub_test_456',
        customer: 'cus_test_456',
        status: 'active',
        current_period_start: 1704067200,
        current_period_end: 1706745600,
        cancel_at_period_end: true,
        canceled_at: 1705000000,
        metadata: {
          user_id: 'user-999',
        },
        items: {
          object: 'list',
          data: [
            {
              id: 'si_test',
              price: {
                id: 'price_yearly',
              } as Stripe.Price,
            } as Stripe.SubscriptionItem,
          ],
          has_more: false,
          url: '/v1/subscription_items',
        },
      }

      const mockEvent: Stripe.Event = {
        id: 'evt_test_456',
        object: 'event',
        type: 'customer.subscription.updated',
        data: {
          object: mockSubscription as Stripe.Subscription,
        },
        api_version: '2024-12-18.acacia',
        created: Math.floor(Date.now() / 1000),
        livemode: false,
        pending_webhooks: 0,
        request: null,
      }

      const mockUpsert = vi.fn().mockResolvedValue({ error: null })
      const mockFrom = vi.fn(() => ({
        upsert: mockUpsert,
      }))

      const { createClient } = await import('@supabase/supabase-js')
      vi.mocked(createClient).mockReturnValue({
        from: mockFrom,
      } as any)

      vi.mocked(stripe.webhooks.constructEvent).mockReturnValue(mockEvent)

      const request = new Request('http://localhost:3000/api/stripe/webhook', {
        method: 'POST',
        body: JSON.stringify(mockEvent),
      })

      const response = await POST(request)

      expect(response.status).toBe(200)
      expect(mockUpsert).toHaveBeenCalledWith(
        expect.objectContaining({
          cancel_at_period_end: true,
          canceled_at: expect.any(String),
        })
      )
    })

    it('should handle missing user_id in subscription metadata', async () => {
      const mockSubscription: Partial<Stripe.Subscription> = {
        id: 'sub_test_no_user',
        metadata: {},
        items: {
          object: 'list',
          data: [
            {
              id: 'si_test',
              price: { id: 'price_monthly' } as Stripe.Price,
            } as Stripe.SubscriptionItem,
          ],
          has_more: false,
          url: '/v1/subscription_items',
        },
      }

      const mockEvent: Stripe.Event = {
        id: 'evt_test_789',
        object: 'event',
        type: 'customer.subscription.created',
        data: {
          object: mockSubscription as Stripe.Subscription,
        },
        api_version: '2024-12-18.acacia',
        created: Math.floor(Date.now() / 1000),
        livemode: false,
        pending_webhooks: 0,
        request: null,
      }

      vi.mocked(stripe.webhooks.constructEvent).mockReturnValue(mockEvent)

      const request = new Request('http://localhost:3000/api/stripe/webhook', {
        method: 'POST',
        body: JSON.stringify(mockEvent),
      })

      const response = await POST(request)

      expect(response.status).toBe(200)
      expect(consoleErrorSpy).toHaveBeenCalledWith('No user_id in subscription metadata')
    })
  })

  describe('customer.subscription.deleted', () => {
    it('should update subscription status to canceled', async () => {
      const mockSubscription: Partial<Stripe.Subscription> = {
        id: 'sub_deleted_123',
        metadata: {
          user_id: 'user-deleted',
        },
      }

      const mockEvent: Stripe.Event = {
        id: 'evt_deleted_123',
        object: 'event',
        type: 'customer.subscription.deleted',
        data: {
          object: mockSubscription as Stripe.Subscription,
        },
        api_version: '2024-12-18.acacia',
        created: Math.floor(Date.now() / 1000),
        livemode: false,
        pending_webhooks: 0,
        request: null,
      }

      const mockEq = vi.fn().mockResolvedValue({ error: null })
      const mockUpdate = vi.fn(() => ({
        eq: mockEq,
      }))
      const mockFrom = vi.fn(() => ({
        update: mockUpdate,
      }))

      const { createClient } = await import('@supabase/supabase-js')
      vi.mocked(createClient).mockReturnValue({
        from: mockFrom,
      } as any)

      vi.mocked(stripe.webhooks.constructEvent).mockReturnValue(mockEvent)

      const request = new Request('http://localhost:3000/api/stripe/webhook', {
        method: 'POST',
        body: JSON.stringify(mockEvent),
      })

      const response = await POST(request)

      expect(response.status).toBe(200)
      expect(mockFrom).toHaveBeenCalledWith('subscriptions')
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'canceled',
          canceled_at: expect.any(String),
          updated_at: expect.any(String),
        })
      )
      expect(mockEq).toHaveBeenCalledWith('stripe_subscription_id', 'sub_deleted_123')
    })
  })

  describe('Unhandled Event Types', () => {
    it('should log unhandled event types without error', async () => {
      const mockEvent: Stripe.Event = {
        id: 'evt_unhandled',
        object: 'event',
        type: 'customer.created' as any,
        data: {
          object: {} as any,
        },
        api_version: '2024-12-18.acacia',
        created: Math.floor(Date.now() / 1000),
        livemode: false,
        pending_webhooks: 0,
        request: null,
      }

      vi.mocked(stripe.webhooks.constructEvent).mockReturnValue(mockEvent)

      const request = new Request('http://localhost:3000/api/stripe/webhook', {
        method: 'POST',
        body: JSON.stringify(mockEvent),
      })

      const response = await POST(request)

      expect(response.status).toBe(200)
      expect(consoleLogSpy).toHaveBeenCalledWith('Unhandled event type: customer.created')
    })
  })

  describe('Error Handling', () => {
    it('should return 500 on database error during subscription upsert', async () => {
      const mockSubscription: Partial<Stripe.Subscription> = {
        id: 'sub_error',
        customer: 'cus_error',
        metadata: {
          user_id: 'user-error',
        },
        items: {
          object: 'list',
          data: [
            {
              id: 'si_test',
              price: { id: 'price_monthly' } as Stripe.Price,
            } as Stripe.SubscriptionItem,
          ],
          has_more: false,
          url: '/v1/subscription_items',
        },
      }

      const mockEvent: Stripe.Event = {
        id: 'evt_error',
        object: 'event',
        type: 'customer.subscription.created',
        data: {
          object: mockSubscription as Stripe.Subscription,
        },
        api_version: '2024-12-18.acacia',
        created: Math.floor(Date.now() / 1000),
        livemode: false,
        pending_webhooks: 0,
        request: null,
      }

      const dbError = new Error('Database connection failed')
      const mockUpsert = vi.fn().mockResolvedValue({ error: dbError })
      const mockFrom = vi.fn(() => ({
        upsert: mockUpsert,
      }))

      const { createClient } = await import('@supabase/supabase-js')
      vi.mocked(createClient).mockReturnValue({
        from: mockFrom,
      } as any)

      vi.mocked(stripe.webhooks.constructEvent).mockReturnValue(mockEvent)

      const request = new Request('http://localhost:3000/api/stripe/webhook', {
        method: 'POST',
        body: JSON.stringify(mockEvent),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Webhook processing failed' })
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error upserting subscription:', dbError)
    })
  })
})
