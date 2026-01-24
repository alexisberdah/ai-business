import { describe, it, expect, vi, beforeEach } from 'vitest'
import { hasActiveSubscription, requireSubscription } from '@/lib/subscription/check-subscription'

// Mock Supabase client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

import { createClient } from '@/lib/supabase/server'

describe('hasActiveSubscription', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return true for user with active subscription', async () => {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: 'user-with-sub-123',
              email: 'subscribed@example.com',
            },
          },
          error: null,
        }),
      },
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: vi.fn().mockResolvedValue({
                data: {
                  status: 'active',
                  user_id: 'user-with-sub-123',
                },
                error: null,
              }),
            })),
          })),
        })),
      })),
    }

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

    const result = await hasActiveSubscription()

    expect(result).toBe(true)
  })

  it('should return false for user without subscription', async () => {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: 'user-no-sub-123',
              email: 'free@example.com',
            },
          },
          error: null,
        }),
      },
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: vi.fn().mockResolvedValue({
                data: null,
                error: {
                  code: 'PGRST116',
                  message: 'No rows found',
                },
              }),
            })),
          })),
        })),
      })),
    }

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

    const result = await hasActiveSubscription()

    expect(result).toBe(false)
  })

  it('should return false for user with canceled subscription', async () => {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: 'user-canceled-123',
              email: 'canceled@example.com',
            },
          },
          error: null,
        }),
      },
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: vi.fn().mockResolvedValue({
                data: null,
                error: {
                  code: 'PGRST116',
                  message: 'No rows found',
                },
              }),
            })),
          })),
        })),
      })),
    }

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

    const result = await hasActiveSubscription()

    expect(result).toBe(false)
  })

  it('should return false when user is not authenticated', async () => {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: null,
          },
          error: {
            message: 'Not authenticated',
            status: 401,
          },
        }),
      },
      from: vi.fn(),
    }

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

    const result = await hasActiveSubscription()

    expect(result).toBe(false)
  })

  it('should query subscriptions table with correct filters', async () => {
    const mockFrom = vi.fn()
    const mockSelect = vi.fn()
    const mockEq1 = vi.fn()
    const mockEq2 = vi.fn()
    const mockSingle = vi.fn().mockResolvedValue({
      data: { status: 'active' },
      error: null,
    })

    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: 'test-user-id',
              email: 'test@example.com',
            },
          },
          error: null,
        }),
      },
      from: mockFrom.mockReturnValue({
        select: mockSelect.mockReturnValue({
          eq: mockEq1.mockReturnValue({
            eq: mockEq2.mockReturnValue({
              single: mockSingle,
            }),
          }),
        }),
      }),
    }

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

    await hasActiveSubscription()

    expect(mockFrom).toHaveBeenCalledWith('subscriptions')
    expect(mockSelect).toHaveBeenCalledWith('status')
    expect(mockEq1).toHaveBeenCalledWith('user_id', 'test-user-id')
    expect(mockEq2).toHaveBeenCalledWith('status', 'active')
    expect(mockSingle).toHaveBeenCalled()
  })
})

describe('requireSubscription', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should not throw for user with active subscription', async () => {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: 'subscribed-user',
            },
          },
          error: null,
        }),
      },
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: vi.fn().mockResolvedValue({
                data: { status: 'active' },
                error: null,
              }),
            })),
          })),
        })),
      })),
    }

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

    await expect(requireSubscription()).resolves.not.toThrow()
  })

  it('should throw error for user without subscription', async () => {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: 'free-user',
            },
          },
          error: null,
        }),
      },
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: vi.fn().mockResolvedValue({
                data: null,
                error: { code: 'PGRST116' },
              }),
            })),
          })),
        })),
      })),
    }

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

    await expect(requireSubscription()).rejects.toThrow('Active subscription required')
  })

  it('should throw error for unauthenticated user', async () => {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: null,
          },
          error: { message: 'Not authenticated' },
        }),
      },
      from: vi.fn(),
    }

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

    await expect(requireSubscription()).rejects.toThrow('Active subscription required')
  })
})
