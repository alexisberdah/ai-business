import { describe, it, expect, vi, beforeEach } from 'vitest'
import { logUsage, getUserUsageSummary, getUserUsageLogs } from '@/lib/usage/log-usage'
import type { UsageLogData } from '@/lib/usage/log-usage'

// Mock Supabase client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

import { createClient } from '@/lib/supabase/server'

// Mock console.error to avoid noise in test output
const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

describe('logUsage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    consoleErrorSpy.mockClear()
  })

  it('should insert usage log with correct data structure', async () => {
    const mockInsert = vi.fn().mockResolvedValue({
      data: null,
      error: null,
    })

    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: 'user-123',
              email: 'test@example.com',
            },
          },
          error: null,
        }),
      },
      from: vi.fn(() => ({
        insert: mockInsert,
      })),
    }

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

    const usageData: UsageLogData = {
      model: 'claude-3-5-sonnet-20241022',
      inputTokens: 1000,
      outputTokens: 500,
      totalTokens: 1500,
      messagesCount: 3,
      requestDurationMs: 2500,
    }

    await logUsage(usageData)

    expect(mockSupabase.from).toHaveBeenCalledWith('usage_logs')
    expect(mockInsert).toHaveBeenCalledWith({
      user_id: 'user-123',
      model: 'claude-3-5-sonnet-20241022',
      input_tokens: 1000,
      output_tokens: 500,
      total_tokens: 1500,
      messages_count: 3,
      request_duration_ms: 2500,
      error: undefined,
    })
  })

  it('should default messagesCount to 1 if not provided', async () => {
    const mockInsert = vi.fn().mockResolvedValue({
      data: null,
      error: null,
    })

    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: 'user-123',
            },
          },
          error: null,
        }),
      },
      from: vi.fn(() => ({
        insert: mockInsert,
      })),
    }

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

    const usageData: UsageLogData = {
      model: 'claude-3-5-sonnet-20241022',
      inputTokens: 100,
      outputTokens: 50,
      totalTokens: 150,
    }

    await logUsage(usageData)

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        messages_count: 1,
      })
    )
  })

  it('should include error field when provided', async () => {
    const mockInsert = vi.fn().mockResolvedValue({
      data: null,
      error: null,
    })

    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: 'user-123',
            },
          },
          error: null,
        }),
      },
      from: vi.fn(() => ({
        insert: mockInsert,
      })),
    }

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

    const usageData: UsageLogData = {
      model: 'claude-3-5-sonnet-20241022',
      inputTokens: 100,
      outputTokens: 0,
      totalTokens: 100,
      error: 'Rate limit exceeded',
    }

    await logUsage(usageData)

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Rate limit exceeded',
      })
    )
  })

  it('should not throw error when insert fails (non-blocking)', async () => {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: 'user-123',
            },
          },
          error: null,
        }),
      },
      from: vi.fn(() => ({
        insert: vi.fn().mockResolvedValue({
          data: null,
          error: {
            message: 'Database error',
            code: 'DB_ERROR',
          },
        }),
      })),
    }

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

    const usageData: UsageLogData = {
      model: 'claude-3-5-sonnet-20241022',
      inputTokens: 100,
      outputTokens: 50,
      totalTokens: 150,
    }

    await expect(logUsage(usageData)).resolves.not.toThrow()
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error logging usage:', expect.any(Object))
  })

  it('should not insert when user is not authenticated', async () => {
    const mockInsert = vi.fn()
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
      from: vi.fn(() => ({
        insert: mockInsert,
      })),
    }

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

    const usageData: UsageLogData = {
      model: 'claude-3-5-sonnet-20241022',
      inputTokens: 100,
      outputTokens: 50,
      totalTokens: 150,
    }

    await logUsage(usageData)

    expect(mockInsert).not.toHaveBeenCalled()
    expect(consoleErrorSpy).toHaveBeenCalledWith('Cannot log usage: No authenticated user')
  })

  it('should not throw when createClient fails', async () => {
    vi.mocked(createClient).mockRejectedValue(new Error('Supabase connection failed'))

    const usageData: UsageLogData = {
      model: 'claude-3-5-sonnet-20241022',
      inputTokens: 100,
      outputTokens: 50,
      totalTokens: 150,
    }

    await expect(logUsage(usageData)).resolves.not.toThrow()
    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to log usage:', expect.any(Error))
  })
})

describe('getUserUsageSummary', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    consoleErrorSpy.mockClear()
  })

  it('should call RPC with correct parameters and date range', async () => {
    const mockRpc = vi.fn().mockResolvedValue({
      data: [
        {
          total_tokens: 10000,
          total_requests: 50,
        },
      ],
      error: null,
    })

    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: 'user-123',
            },
          },
          error: null,
        }),
      },
      rpc: mockRpc,
    }

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

    const startDate = new Date('2024-01-01')
    const endDate = new Date('2024-01-31')

    await getUserUsageSummary(startDate, endDate)

    expect(mockRpc).toHaveBeenCalledWith('get_usage_summary', {
      p_user_id: 'user-123',
      p_start_date: startDate.toISOString(),
      p_end_date: endDate.toISOString(),
    })
  })

  it('should default to 30 days ago if no start date provided', async () => {
    const mockRpc = vi.fn().mockResolvedValue({
      data: [],
      error: null,
    })

    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: 'user-123',
            },
          },
          error: null,
        }),
      },
      rpc: mockRpc,
    }

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

    const now = new Date()
    await getUserUsageSummary()

    const callArgs = mockRpc.mock.calls[0][1]
    const startDate = new Date(callArgs.p_start_date)
    const daysDifference = (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)

    expect(daysDifference).toBeGreaterThanOrEqual(29)
    expect(daysDifference).toBeLessThanOrEqual(31)
  })

  it('should return null when user is not authenticated', async () => {
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
      rpc: vi.fn(),
    }

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

    const result = await getUserUsageSummary()

    expect(result).toBeNull()
  })

  it('should return summary data when available', async () => {
    const summaryData = {
      total_tokens: 15000,
      total_requests: 100,
      avg_tokens_per_request: 150,
    }

    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: 'user-123',
            },
          },
          error: null,
        }),
      },
      rpc: vi.fn().mockResolvedValue({
        data: [summaryData],
        error: null,
      }),
    }

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

    const result = await getUserUsageSummary()

    expect(result).toEqual(summaryData)
  })

  it('should return null when RPC returns error', async () => {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: 'user-123',
            },
          },
          error: null,
        }),
      },
      rpc: vi.fn().mockResolvedValue({
        data: null,
        error: {
          message: 'RPC function not found',
        },
      }),
    }

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

    const result = await getUserUsageSummary()

    expect(result).toBeNull()
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error getting usage summary:', expect.any(Object))
  })
})

describe('getUserUsageLogs', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    consoleErrorSpy.mockClear()
  })

  it('should return empty array when user is not authenticated', async () => {
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
      from: vi.fn(),
    }

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

    const result = await getUserUsageLogs()

    expect(result).toEqual([])
  })

  it('should query with correct filters and ordering', async () => {
    const mockLimit = vi.fn().mockResolvedValue({
      data: [],
      error: null,
    })
    const mockOrder = vi.fn(() => ({
      limit: mockLimit,
    }))
    const mockEq = vi.fn(() => ({
      order: mockOrder,
    }))
    const mockSelect = vi.fn(() => ({
      eq: mockEq,
    }))
    const mockFrom = vi.fn(() => ({
      select: mockSelect,
    }))

    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: 'user-123',
            },
          },
          error: null,
        }),
      },
      from: mockFrom,
    }

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

    await getUserUsageLogs(50)

    expect(mockFrom).toHaveBeenCalledWith('usage_logs')
    expect(mockSelect).toHaveBeenCalledWith('*')
    expect(mockEq).toHaveBeenCalledWith('user_id', 'user-123')
    expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false })
    expect(mockLimit).toHaveBeenCalledWith(50)
  })

  it('should apply startDate filter when provided', async () => {
    const mockGte = vi.fn().mockResolvedValue({
      data: [],
      error: null,
    })
    const mockLimit = vi.fn(() => ({
      gte: mockGte,
    }))
    const mockOrder = vi.fn(() => ({
      limit: mockLimit,
    }))
    const mockEq = vi.fn(() => ({
      order: mockOrder,
    }))
    const mockSelect = vi.fn(() => ({
      eq: mockEq,
    }))
    const mockFrom = vi.fn(() => ({
      select: mockSelect,
    }))

    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: 'user-123',
            },
          },
          error: null,
        }),
      },
      from: mockFrom,
    }

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

    const startDate = new Date('2024-01-01')
    await getUserUsageLogs(100, startDate)

    expect(mockGte).toHaveBeenCalledWith('created_at', startDate.toISOString())
  })

  it('should return usage logs when available', async () => {
    const logsData = [
      {
        id: '1',
        user_id: 'user-123',
        model: 'claude-3-5-sonnet-20241022',
        total_tokens: 150,
        created_at: '2024-01-15T10:00:00Z',
      },
      {
        id: '2',
        user_id: 'user-123',
        model: 'claude-3-5-sonnet-20241022',
        total_tokens: 200,
        created_at: '2024-01-15T11:00:00Z',
      },
    ]

    const mockLimit = vi.fn().mockResolvedValue({
      data: logsData,
      error: null,
    })
    const mockOrder = vi.fn(() => ({
      limit: mockLimit,
    }))
    const mockEq = vi.fn(() => ({
      order: mockOrder,
    }))
    const mockSelect = vi.fn(() => ({
      eq: mockEq,
    }))

    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: 'user-123',
            },
          },
          error: null,
        }),
      },
      from: vi.fn(() => ({
        select: mockSelect,
      })),
    }

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

    const result = await getUserUsageLogs()

    expect(result).toEqual(logsData)
  })

  it('should return empty array on query error', async () => {
    const mockLimit = vi.fn().mockResolvedValue({
      data: null,
      error: {
        message: 'Query failed',
      },
    })
    const mockOrder = vi.fn(() => ({
      limit: mockLimit,
    }))
    const mockEq = vi.fn(() => ({
      order: mockOrder,
    }))
    const mockSelect = vi.fn(() => ({
      eq: mockEq,
    }))

    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: 'user-123',
            },
          },
          error: null,
        }),
      },
      from: vi.fn(() => ({
        select: mockSelect,
      })),
    }

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

    const result = await getUserUsageLogs()

    expect(result).toEqual([])
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error getting usage logs:', expect.any(Object))
  })
})
