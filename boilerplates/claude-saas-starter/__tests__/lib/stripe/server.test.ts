import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type Stripe from 'stripe'

// Use vi.hoisted to ensure mocks are available during hoisting
const { mockCustomersList, mockCustomersCreate, mockSubscriptionsList } = vi.hoisted(() => ({
  mockCustomersList: vi.fn(),
  mockCustomersCreate: vi.fn(),
  mockSubscriptionsList: vi.fn(),
}))

// Mock the entire stripe module
vi.mock('stripe', () => {
  return {
    default: class MockStripe {
      customers = {
        list: mockCustomersList,
        create: mockCustomersCreate,
      }
      subscriptions = {
        list: mockSubscriptionsList,
      }
      constructor() {
        return this
      }
    },
  }
})

// Now import the functions under test
import { getOrCreateStripeCustomer, getSubscriptionStatus } from '@/lib/stripe/server'

describe('getOrCreateStripeCustomer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return existing customer ID if customer found by email', async () => {
    const mockCustomer: Partial<Stripe.Customer> = {
      id: 'cus_existing123',
      email: 'test@example.com',
    }

    vi.mocked(mockCustomersList).mockResolvedValue({
      data: [mockCustomer as Stripe.Customer],
      has_more: false,
      object: 'list',
      url: '/v1/customers',
    })

    const result = await getOrCreateStripeCustomer('user-123', 'test@example.com')

    expect(result).toBe('cus_existing123')
    expect(mockCustomersList).toHaveBeenCalledWith({
      email: 'test@example.com',
      limit: 1,
    })
    expect(mockCustomersCreate).not.toHaveBeenCalled()
  })

  it('should create new customer if none exists', async () => {
    const mockNewCustomer: Partial<Stripe.Customer> = {
      id: 'cus_new123',
      email: 'new@example.com',
    }

    vi.mocked(mockCustomersList).mockResolvedValue({
      data: [],
      has_more: false,
      object: 'list',
      url: '/v1/customers',
    })

    vi.mocked(mockCustomersCreate).mockResolvedValue(
      mockNewCustomer as Stripe.Customer
    )

    const result = await getOrCreateStripeCustomer('user-456', 'new@example.com')

    expect(result).toBe('cus_new123')
    expect(mockCustomersCreate).toHaveBeenCalledWith({
      email: 'new@example.com',
      metadata: {
        supabase_user_id: 'user-456',
      },
    })
  })

  it('should include supabase_user_id in metadata when creating customer', async () => {
    vi.mocked(mockCustomersList).mockResolvedValue({
      data: [],
      has_more: false,
      object: 'list',
      url: '/v1/customers',
    })

    vi.mocked(mockCustomersCreate).mockResolvedValue({
      id: 'cus_test',
    } as Stripe.Customer)

    await getOrCreateStripeCustomer('user-789', 'metadata@example.com')

    expect(mockCustomersCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: {
          supabase_user_id: 'user-789',
        },
      })
    )
  })
})

describe('getSubscriptionStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return null if no active subscription found', async () => {
    vi.mocked(mockSubscriptionsList).mockResolvedValue({
      data: [],
      has_more: false,
      object: 'list',
      url: '/v1/subscriptions',
    })

    const result = await getSubscriptionStatus('cus_123')

    expect(result).toBeNull()
    expect(mockSubscriptionsList).toHaveBeenCalledWith({
      customer: 'cus_123',
      status: 'active',
      limit: 1,
    })
  })

  it('should return subscription details if active subscription exists', async () => {
    const mockSubscription: Partial<Stripe.Subscription> = {
      id: 'sub_active123',
      status: 'active',
      current_period_end: 1735689600, // 2025-01-01 00:00:00 UTC
      cancel_at_period_end: false,
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

    vi.mocked(mockSubscriptionsList).mockResolvedValue({
      data: [mockSubscription as Stripe.Subscription],
      has_more: false,
      object: 'list',
      url: '/v1/subscriptions',
    })

    const result = await getSubscriptionStatus('cus_active')

    expect(result).toEqual({
      id: 'sub_active123',
      status: 'active',
      currentPeriodEnd: new Date(1735689600 * 1000),
      cancelAtPeriodEnd: false,
      priceId: 'price_monthly',
    })
  })

  it('should correctly handle cancel_at_period_end flag', async () => {
    const mockSubscription: Partial<Stripe.Subscription> = {
      id: 'sub_canceling',
      status: 'active',
      current_period_end: 1735689600,
      cancel_at_period_end: true,
      items: {
        object: 'list',
        data: [
          {
            id: 'si_test',
            price: { id: 'price_yearly' } as Stripe.Price,
          } as Stripe.SubscriptionItem,
        ],
        has_more: false,
        url: '/v1/subscription_items',
      },
    }

    vi.mocked(mockSubscriptionsList).mockResolvedValue({
      data: [mockSubscription as Stripe.Subscription],
      has_more: false,
      object: 'list',
      url: '/v1/subscriptions',
    })

    const result = await getSubscriptionStatus('cus_canceling')

    expect(result?.cancelAtPeriodEnd).toBe(true)
  })

  it('should convert Unix timestamp to JavaScript Date object', async () => {
    const unixTimestamp = 1704067200 // 2024-01-01 00:00:00 UTC
    const expectedDate = new Date(unixTimestamp * 1000)

    const mockSubscription: Partial<Stripe.Subscription> = {
      id: 'sub_test',
      status: 'active',
      current_period_end: unixTimestamp,
      cancel_at_period_end: false,
      items: {
        object: 'list',
        data: [
          {
            id: 'si_test',
            price: { id: 'price_test' } as Stripe.Price,
          } as Stripe.SubscriptionItem,
        ],
        has_more: false,
        url: '/v1/subscription_items',
      },
    }

    vi.mocked(mockSubscriptionsList).mockResolvedValue({
      data: [mockSubscription as Stripe.Subscription],
      has_more: false,
      object: 'list',
      url: '/v1/subscriptions',
    })

    const result = await getSubscriptionStatus('cus_test')

    expect(result?.currentPeriodEnd).toEqual(expectedDate)
  })
})
