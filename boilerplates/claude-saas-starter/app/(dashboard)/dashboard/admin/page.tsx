import { redirect } from 'next/navigation'
import { isAdmin, getAdminData } from '@/lib/admin/check-admin'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default async function AdminPage() {
  // Check admin access
  const admin = await isAdmin()
  if (!admin) {
    redirect('/dashboard')
  }

  // Get admin data using service role
  const supabaseAdmin = await getAdminData()

  // Get all users with subscription and usage data
  const { data: users, error } = await supabaseAdmin
    .from('admin_users_overview')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) {
    console.error('Error fetching admin data:', error)
  }

  // Calculate overall stats
  const totalUsers = users?.length || 0
  const activeSubscriptions = users?.filter((u) => u.subscription_status === 'active').length || 0
  const totalRequests = users?.reduce((sum, u) => sum + (Number(u.total_requests) || 0), 0) || 0
  const totalTokens = users?.reduce((sum, u) => sum + (Number(u.total_tokens) || 0), 0) || 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage users, subscriptions, and usage</p>
      </div>

      {/* Overall Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Users</CardDescription>
            <CardTitle className="text-3xl">{totalUsers}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Active Subscriptions</CardDescription>
            <CardTitle className="text-3xl">{activeSubscriptions}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total API Requests</CardDescription>
            <CardTitle className="text-3xl">{totalRequests.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Tokens Used</CardDescription>
            <CardTitle className="text-3xl">{totalTokens.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>All registered users and their subscription status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left text-sm font-medium">Email</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Subscription</th>
                  <th className="px-4 py-2 text-right text-sm font-medium">Requests</th>
                  <th className="px-4 py-2 text-right text-sm font-medium">Tokens</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Joined</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Last Active</th>
                </tr>
              </thead>
              <tbody>
                {users?.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-muted/50">
                    <td className="px-4 py-3 text-sm">{user.email}</td>
                    <td className="px-4 py-3">
                      {user.subscription_status ? (
                        <Badge variant="default">{user.subscription_status}</Badge>
                      ) : (
                        <Badge variant="secondary">free</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-sm">
                      {Number(user.total_requests || 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-sm">
                      {Number(user.total_tokens || 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {user.last_sign_in_at
                        ? new Date(user.last_sign_in_at).toLocaleDateString()
                        : 'Never'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Admin Instructions */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="text-orange-900">Admin Access Setup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-orange-800">
          <p>To grant admin access to a user:</p>
          <ol className="ml-4 list-decimal space-y-1">
            <li>Go to Supabase Dashboard → Authentication → Users</li>
            <li>Select the user</li>
            <li>Click "User Meta Data" → Edit</li>
            <li>
              Add: <code className="rounded bg-orange-100 px-1">{`{"is_admin": true}`}</code>
            </li>
            <li>User must sign out and sign back in for changes to take effect</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
