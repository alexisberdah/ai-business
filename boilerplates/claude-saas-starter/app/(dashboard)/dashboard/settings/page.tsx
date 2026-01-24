import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ManageBillingButton } from '@/components/billing/manage-billing-button'
import { getSubscriptionStatus } from '@/lib/stripe/server'

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get subscription from database
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()

  let stripeSubscription = null
  if (subscription) {
    stripeSubscription = await getSubscriptionStatus(subscription.stripe_customer_id)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and subscription
        </p>
      </div>

      <div className="grid gap-6">
        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium">User ID</p>
              <p className="font-mono text-sm text-muted-foreground">{user.id}</p>
            </div>
          </CardContent>
        </Card>

        {/* Billing Info */}
        <Card>
          <CardHeader>
            <CardTitle>Billing & Subscription</CardTitle>
            <CardDescription>
              Manage your subscription and payment methods
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {stripeSubscription ? (
              <>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium">Status</p>
                    <p className="text-sm">
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        {stripeSubscription.status}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Current Period Ends</p>
                    <p className="text-sm text-muted-foreground">
                      {stripeSubscription.currentPeriodEnd.toLocaleDateString()}
                    </p>
                  </div>
                  {stripeSubscription.cancelAtPeriodEnd && (
                    <div>
                      <p className="text-sm font-medium text-orange-600">
                        Subscription will cancel at period end
                      </p>
                    </div>
                  )}
                </div>
                <ManageBillingButton />
              </>
            ) : (
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  You don't have an active subscription.
                </p>
                <a
                  href="/pricing"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  View Pricing
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
