import { createClient } from '@/lib/supabase/server'

export interface UsageLogData {
  model: string
  inputTokens: number
  outputTokens: number
  totalTokens: number
  messagesCount?: number
  requestDurationMs?: number
  error?: string
}

/**
 * Log Claude API usage to database
 */
export async function logUsage(data: UsageLogData): Promise<void> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      console.error('Cannot log usage: No authenticated user')
      return
    }

    const { error } = await supabase.from('usage_logs').insert({
      user_id: user.id,
      model: data.model,
      input_tokens: data.inputTokens,
      output_tokens: data.outputTokens,
      total_tokens: data.totalTokens,
      messages_count: data.messagesCount || 1,
      request_duration_ms: data.requestDurationMs,
      error: data.error,
    })

    if (error) {
      console.error('Error logging usage:', error)
    }
  } catch (error) {
    console.error('Failed to log usage:', error)
  }
}

/**
 * Get usage summary for current user
 */
export async function getUserUsageSummary(
  startDate?: Date,
  endDate?: Date
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
  const end = endDate || new Date()

  const { data, error } = await supabase.rpc('get_usage_summary', {
    p_user_id: user.id,
    p_start_date: start.toISOString(),
    p_end_date: end.toISOString(),
  })

  if (error) {
    console.error('Error getting usage summary:', error)
    return null
  }

  return data && data.length > 0 ? data[0] : null
}

/**
 * Get detailed usage logs for current user
 */
export async function getUserUsageLogs(
  limit: number = 100,
  startDate?: Date
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  let query = supabase
    .from('usage_logs')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (startDate) {
    query = query.gte('created_at', startDate.toISOString())
  }

  const { data, error } = await query

  if (error) {
    console.error('Error getting usage logs:', error)
    return []
  }

  return data || []
}
