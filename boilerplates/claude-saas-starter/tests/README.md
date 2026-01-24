# Testing Infrastructure - Claude SaaS Starter

## Overview

Complete testing setup for the Claude SaaS Starter boilerplate with unit, integration, and E2E tests.

## Current Status

### ✅ Phase 1: Infrastructure Setup (COMPLETE)
- Vitest configured for unit/integration tests
- Playwright configured for E2E tests
- MSW configured for API mocking
- Test directory structure created
- All dependencies installed

### ✅ Phase 2: Unit Tests (COMPLETE)

**40 tests passing** across critical business logic:

| Module | Coverage | Tests | Status |
|--------|----------|-------|--------|
| `lib/stripe/server.ts` | 92.3% | 7 tests | ✅ |
| `lib/admin/check-admin.ts` | 72.72% | 9 tests | ✅ |
| `lib/subscription/check-subscription.ts` | 100% | 8 tests | ✅ |
| `lib/usage/log-usage.ts` | 100% | 16 tests | ✅ |

**Critical paths tested:**
- ✅ Stripe customer creation/lookup (no duplication)
- ✅ Subscription status validation (access control)
- ✅ Admin role checking (security boundary)
- ✅ Usage logging (billing accuracy)
- ✅ Non-blocking failure handling

### 🚧 Phase 3: Integration Tests (IN PROGRESS)
- MSW handlers created for Anthropic/Stripe APIs
- Webhook signature verification tests created
- Challenges: Next.js App Router global instances difficult to mock

**Recommendation:** Skip integration tests, focus on E2E tests (Phase 4) which provide better coverage for API routes.

### ⏳ Phase 4: E2E Tests (NEXT)
End-to-end tests with Playwright for full user journeys:
- Authentication flow (signup → login → dashboard)
- Chat streaming (message → Claude response)
- Billing flow (checkout → Stripe redirect)
- Admin dashboard access control

## Running Tests

### All Tests
```bash
npm run test:all        # Run unit + E2E tests
```

### Unit Tests
```bash
npm test                # Watch mode
npm run test:unit       # Single run with coverage
```

### Integration Tests
```bash
npm run test:integration
```

### E2E Tests
```bash
npm run test:e2e        # Headless mode
npm run test:e2e:ui     # Interactive UI mode
```

## Test Structure

```
__tests__/                      # Unit tests (mirrors src structure)
├── lib/
│   ├── stripe/
│   │   └── server.test.ts      # Stripe utils (customer, subscription)
│   ├── admin/
│   │   └── check-admin.test.ts # Admin role validation
│   ├── subscription/
│   │   └── check-subscription.test.ts
│   └── usage/
│       └── log-usage.test.ts   # Usage metering
│
tests/
├── setup.ts                    # Global test setup
├── integration/
│   ├── setup/
│   │   └── msw-handlers.ts     # MSW mocks for external APIs
│   └── api/
│       ├── claude-stream.test.ts
│       └── stripe-webhook.test.ts
│
└── e2e/                        # Playwright E2E tests
    ├── utils/
    │   └── auth-helpers.ts     # Login helpers
    ├── auth-flow.spec.ts
    ├── chat-flow.spec.ts
    ├── billing-flow.spec.ts
    └── admin-flow.spec.ts
```

## Coverage Thresholds

```json
{
  "lines": 60,
  "functions": 50,
  "branches": 50,
  "statements": 60
}
```

**Current coverage:** 17% (expected - only critical modules tested so far)

## Testing Philosophy

### What We Test

1. **Revenue-Critical Paths** (100% coverage target)
   - Stripe webhooks (subscription state changes)
   - Payment processing
   - Usage metering & billing

2. **Security Boundaries** (100% coverage target)
   - Authentication checks
   - Admin role validation
   - Subscription access control

3. **Core Product Features** (80% coverage target)
   - Claude API streaming
   - Message handling
   - Error states

4. **UI Components** (60% coverage target)
   - Critical user flows
   - Form validation
   - Error messaging

### What We Don't Test

- Third-party libraries (shadcn/ui, Radix UI)
- Generated code (migrations, types)
- Environment-specific configs
- Simple pass-through functions

## MSW Mock Handlers

Mock handlers for external APIs (Anthropic, Stripe) located in `tests/integration/setup/msw-handlers.ts`.

**Available mocks:**
- `POST /v1/messages` - Claude streaming response
- `POST /v1/customers` - Stripe customer creation
- `POST /v1/checkout/sessions` - Stripe checkout
- `POST /v1/billing_portal/sessions` - Stripe portal

**Error handlers:**
- Claude API rate limiting (429)
- Stripe API errors (500)

## Environment Variables

Test environment variables in `.env.test`:

```bash
# Supabase (local instance recommended)
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=test_anon_key
SUPABASE_SERVICE_ROLE_KEY=test_service_role_key

# Stripe (test mode keys)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_test_...
STRIPE_PRICE_ID_MONTHLY=price_test_monthly
STRIPE_PRICE_ID_YEARLY=price_test_yearly

# Anthropic (test key or mock)
ANTHROPIC_API_KEY=sk-ant-test-...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=test
```

## Database Setup for Tests

### Option 1: Supabase Local (Recommended)

```bash
# Install Supabase CLI
brew install supabase/tap/supabase

# Start local Supabase
supabase start

# Run migrations
supabase db reset

# Seed test data
supabase db seed
```

### Option 2: Test Project

Create a dedicated Supabase test project and point `.env.test` to it.

## Test Data Seeding

Create `supabase/seed.sql` for test users:

```sql
-- Test users
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
VALUES
  ('user-regular', 'user@test.com', crypt('testpass123', gen_salt('bf')), NOW()),
  ('user-subscribed', 'subscribed@test.com', crypt('testpass123', gen_salt('bf')), NOW()),
  ('user-admin', 'admin@test.com', crypt('testpass123', gen_salt('bf')), NOW());

-- Admin metadata
UPDATE auth.users
SET raw_user_meta_data = '{"is_admin": true}'::jsonb
WHERE id = 'user-admin';

-- Active subscription
INSERT INTO public.subscriptions (user_id, stripe_customer_id, stripe_subscription_id, stripe_price_id, status, current_period_start, current_period_end)
VALUES ('user-subscribed', 'cus_test', 'sub_test', 'price_monthly', 'active', NOW(), NOW() + INTERVAL '30 days');
```

## Debugging Tests

### Vitest Watch Mode
```bash
npm test
# Press 'p' to filter by filename
# Press 't' to filter by test name
# Press 'a' to re-run all tests
```

### Playwright UI Mode
```bash
npm run test:e2e:ui
# Visual test runner with step-by-step debugging
# View screenshots/videos of failures
# Time-travel through test execution
```

### Coverage Reports
```bash
npm run test:unit
open coverage/index.html  # View HTML coverage report
```

## CI/CD Integration

Add to GitHub Actions workflow:

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:unit
      - run: npx playwright install
      - run: npm run test:e2e
```

## Performance Targets

- **Unit tests:** <5s total
- **Integration tests:** <30s total
- **E2E tests:** <2min total
- **Total test suite:** <3min

## Next Steps

1. ✅ Complete Phase 4: E2E Tests
   - Auth flow tests
   - Chat streaming tests
   - Billing flow tests
   - Admin dashboard tests

2. ⏳ Production Hardening
   - Sentry error monitoring
   - PostHog analytics
   - Rate limiting (Upstash)
   - Email notifications (Resend + React Email)

3. ⏳ Test Maintenance
   - Add tests for new features
   - Keep coverage >60% globally
   - Monitor flaky tests
   - Update mocks when APIs change

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [MSW Documentation](https://mswjs.io/)
- [Testing Library](https://testing-library.com/)
