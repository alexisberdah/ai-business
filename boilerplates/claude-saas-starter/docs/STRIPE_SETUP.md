# Stripe Setup Guide

Complete guide to setting up Stripe billing for your SaaS.

## Prerequisites

- Stripe account (https://stripe.com)
- Supabase project set up
- Local environment running

## Step 1: Create Stripe Products & Prices

1. Go to https://dashboard.stripe.com/test/products
2. Create a new product: "Claude SaaS Starter"
3. Add two prices:
   - **Monthly**: $149/month (recurring)
   - **Yearly**: $1,490/year (recurring)
4. Copy the Price IDs (they start with `price_...`)

## Step 2: Set Environment Variables

Update your `.env.local`:

```bash
# Stripe
STRIPE_SECRET_KEY=sk_test_...                          # From https://dashboard.stripe.com/test/apikeys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...        # From https://dashboard.stripe.com/test/apikeys
STRIPE_WEBHOOK_SECRET=whsec_...                        # From webhook setup (Step 4)
STRIPE_PRICE_ID_MONTHLY=price_...                      # Monthly price ID
STRIPE_PRICE_ID_YEARLY=price_...                       # Yearly price ID

# Supabase (for webhooks)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key        # From Supabase project settings
```

## Step 3: Run Database Migration

Run the subscription table migration:

```bash
# Apply migration via Supabase CLI
supabase migration up

# Or manually run the SQL from:
# supabase/migrations/20260124_subscriptions.sql
```

This creates the `subscriptions` table with proper RLS policies.

## Step 4: Set Up Webhook

### Local Development (using Stripe CLI)

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login: `stripe login`
3. Forward webhooks to local:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
4. Copy the webhook signing secret (starts with `whsec_...`)
5. Add to `.env.local` as `STRIPE_WEBHOOK_SECRET`

### Production Deployment

1. Go to https://dashboard.stripe.com/test/webhooks
2. Click "Add endpoint"
3. Enter your production URL: `https://yourdomain.com/api/stripe/webhook`
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the webhook signing secret
6. Add to production environment variables

## Step 5: Configure Stripe Customer Portal

1. Go to https://dashboard.stripe.com/test/settings/billing/portal
2. Enable customer portal
3. Configure what customers can do:
   - ✅ Update payment method
   - ✅ Cancel subscription
   - ✅ View invoice history
4. Set branding (logo, colors)

## Step 6: Test the Flow

### Test Checkout

1. Start your app: `npm run dev`
2. Start Stripe webhook listener: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
3. Navigate to `/pricing`
4. Click "Get Started" on a plan
5. Use test card: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits
6. Complete checkout
7. Verify webhook received (check terminal)
8. Check database: `select * from subscriptions`

### Test Customer Portal

1. Login with a user that has a subscription
2. Go to `/dashboard/settings`
3. Click "Manage Billing"
4. Verify you can:
   - Update payment method
   - Cancel subscription
   - View invoices

## Step 7: Go Live

### Switch to Live Mode

1. In Stripe dashboard, toggle from Test to Live mode
2. Create production products & prices (same as test)
3. Get live API keys
4. Update production environment variables:
   - `STRIPE_SECRET_KEY` → Live secret key (starts with `sk_live_`)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` → Live publishable key (starts with `pk_live_`)
   - `STRIPE_PRICE_ID_MONTHLY` → Live monthly price ID
   - `STRIPE_PRICE_ID_YEARLY` → Live yearly price ID
5. Create production webhook endpoint
6. Update `STRIPE_WEBHOOK_SECRET` with live webhook secret

### Enable Payment Methods

1. Go to https://dashboard.stripe.com/settings/payment_methods
2. Enable payment methods:
   - ✅ Card (required)
   - ✅ Google Pay (recommended)
   - ✅ Apple Pay (recommended)
   - Optional: Link, iDEAL, SEPA, etc.

### Configure Billing Settings

1. **Email receipts**: https://dashboard.stripe.com/settings/emails
   - ✅ Email customers on successful payments
   - ✅ Email customers on failed payments
2. **Tax collection**: https://dashboard.stripe.com/settings/tax
   - Consider enabling automatic tax calculation
3. **Invoices**: https://dashboard.stripe.com/settings/billing/invoice
   - Set invoice footer
   - Configure invoice numbering

## Troubleshooting

### Webhook not receiving events

- Verify webhook endpoint is publicly accessible
- Check webhook secret is correct
- Check selected events in Stripe dashboard
- Review webhook logs in Stripe dashboard

### Subscription not created after checkout

- Check webhook logs for errors
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set correctly
- Check Supabase logs for database errors
- Ensure `subscriptions` table exists and has RLS policies

### "No active subscription" error

- Verify user completed checkout successfully
- Check `subscriptions` table for user's subscription
- Ensure subscription status is "active"
- Check webhook processed `customer.subscription.created` event

## Test Cards

Stripe provides test cards for different scenarios:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Insufficient funds**: `4000 0000 0000 9995`
- **3D Secure required**: `4000 0027 6000 3184`

See all test cards: https://stripe.com/docs/testing#cards

## Security Checklist

- [ ] Webhook signature verification enabled (automatic)
- [ ] Environment variables secured (not in Git)
- [ ] Service role key only used server-side
- [ ] RLS policies enabled on subscriptions table
- [ ] HTTPS enabled in production
- [ ] CORS configured correctly
- [ ] Rate limiting on API routes (consider implementing)

## Support

- Stripe Docs: https://stripe.com/docs
- Stripe Dashboard: https://dashboard.stripe.com
- Test Mode: Always test in test mode first before going live
