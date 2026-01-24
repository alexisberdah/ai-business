-- Add admin role support via user metadata
-- Admins are identified by user_metadata.is_admin = true

-- Create a helper function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT COALESCE(
      (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean,
      false
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION is_admin TO authenticated;

-- Create admin_users view for easy admin panel access
CREATE OR REPLACE VIEW admin_users_overview AS
SELECT
  u.id,
  u.email,
  u.created_at,
  u.last_sign_in_at,
  u.raw_user_meta_data,
  s.stripe_customer_id,
  s.stripe_subscription_id,
  s.status as subscription_status,
  s.current_period_end as subscription_period_end,
  (
    SELECT COUNT(*)
    FROM usage_logs ul
    WHERE ul.user_id = u.id
  ) as total_requests,
  (
    SELECT SUM(total_tokens)
    FROM usage_logs ul
    WHERE ul.user_id = u.id
  ) as total_tokens
FROM auth.users u
LEFT JOIN subscriptions s ON s.user_id = u.id AND s.status = 'active'
ORDER BY u.created_at DESC;

-- Note: This view requires service_role permissions to query
-- Access it from API routes with service role client
