import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  })),
  useSearchParams: vi.fn(() => new URLSearchParams()),
  usePathname: vi.fn(() => '/'),
}))

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key'
process.env.ANTHROPIC_API_KEY = 'sk-ant-test-key'
process.env.STRIPE_SECRET_KEY = 'sk_test_mock_key_12345'
process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'pk_test_mock_key_12345'
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_mock_secret'
process.env.STRIPE_PRICE_ID_MONTHLY = 'price_test_monthly'
process.env.STRIPE_PRICE_ID_YEARLY = 'price_test_yearly'
