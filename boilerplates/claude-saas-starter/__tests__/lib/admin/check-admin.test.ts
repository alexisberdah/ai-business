import { describe, it, expect, vi, beforeEach } from 'vitest'
import { isAdmin, requireAdmin } from '@/lib/admin/check-admin'

// Mock Supabase client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

import { createClient } from '@/lib/supabase/server'

describe('isAdmin', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return true for user with is_admin flag', async () => {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: 'admin-user-123',
              email: 'admin@example.com',
              user_metadata: {
                is_admin: true,
              },
            },
          },
          error: null,
        }),
      },
    }

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

    const result = await isAdmin()

    expect(result).toBe(true)
    expect(mockSupabase.auth.getUser).toHaveBeenCalledOnce()
  })

  it('should return false for regular user without is_admin flag', async () => {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: 'regular-user-123',
              email: 'user@example.com',
              user_metadata: {
                name: 'Regular User',
              },
            },
          },
          error: null,
        }),
      },
    }

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

    const result = await isAdmin()

    expect(result).toBe(false)
  })

  it('should return false when is_admin is explicitly false', async () => {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: 'user-123',
              email: 'user@example.com',
              user_metadata: {
                is_admin: false,
              },
            },
          },
          error: null,
        }),
      },
    }

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

    const result = await isAdmin()

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
    }

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

    const result = await isAdmin()

    expect(result).toBe(false)
  })

  it('should return false when user_metadata is undefined', async () => {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: 'user-123',
              email: 'user@example.com',
              user_metadata: undefined,
            },
          },
          error: null,
        }),
      },
    }

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

    const result = await isAdmin()

    expect(result).toBe(false)
  })

  it('should return false when user_metadata is empty object', async () => {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: 'user-123',
              email: 'user@example.com',
              user_metadata: {},
            },
          },
          error: null,
        }),
      },
    }

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

    const result = await isAdmin()

    expect(result).toBe(false)
  })
})

describe('requireAdmin', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should not throw for admin user', async () => {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: 'admin-user-123',
              user_metadata: {
                is_admin: true,
              },
            },
          },
          error: null,
        }),
      },
    }

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

    await expect(requireAdmin()).resolves.not.toThrow()
  })

  it('should throw error for non-admin user', async () => {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: 'user-123',
              user_metadata: {},
            },
          },
          error: null,
        }),
      },
    }

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

    await expect(requireAdmin()).rejects.toThrow('Admin access required')
  })

  it('should throw error for unauthenticated user', async () => {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: null,
          },
          error: {
            message: 'Not authenticated',
          },
        }),
      },
    }

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

    await expect(requireAdmin()).rejects.toThrow('Admin access required')
  })
})
