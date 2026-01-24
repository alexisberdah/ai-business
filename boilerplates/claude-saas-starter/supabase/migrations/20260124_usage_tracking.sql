-- Create usage_logs table for tracking Claude API usage
CREATE TABLE IF NOT EXISTS usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  model TEXT NOT NULL,
  input_tokens INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0,
  total_tokens INTEGER NOT NULL DEFAULT 0,
  messages_count INTEGER NOT NULL DEFAULT 1,
  request_duration_ms INTEGER,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for fast queries
CREATE INDEX idx_usage_logs_user_id ON usage_logs(user_id);
CREATE INDEX idx_usage_logs_created_at ON usage_logs(created_at);
CREATE INDEX idx_usage_logs_user_created ON usage_logs(user_id, created_at DESC);

-- Row Level Security
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

-- Users can only read their own usage logs
CREATE POLICY "Users can read own usage logs"
  ON usage_logs
  FOR SELECT
  USING (auth.uid() = user_id);

-- Only authenticated users can insert usage logs (via API)
CREATE POLICY "Authenticated users can insert usage logs"
  ON usage_logs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create a function to get usage summary for a user
CREATE OR REPLACE FUNCTION get_usage_summary(
  p_user_id UUID,
  p_start_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '30 days',
  p_end_date TIMESTAMPTZ DEFAULT NOW()
)
RETURNS TABLE (
  total_requests BIGINT,
  total_input_tokens BIGINT,
  total_output_tokens BIGINT,
  total_tokens BIGINT,
  total_messages BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT AS total_requests,
    COALESCE(SUM(input_tokens), 0)::BIGINT AS total_input_tokens,
    COALESCE(SUM(output_tokens), 0)::BIGINT AS total_output_tokens,
    COALESCE(SUM(total_tokens), 0)::BIGINT AS total_tokens,
    COALESCE(SUM(messages_count), 0)::BIGINT AS total_messages
  FROM usage_logs
  WHERE user_id = p_user_id
    AND created_at >= p_start_date
    AND created_at <= p_end_date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_usage_summary TO authenticated;
