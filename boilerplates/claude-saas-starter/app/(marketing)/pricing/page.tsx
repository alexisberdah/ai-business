'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useCheckout } from '@/lib/stripe/use-checkout'
import { Check } from 'lucide-react'

const plans = [
  {
    name: 'Monthly',
    price: '$149',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY || '',
    description: 'Perfect for trying out the starter',
    features: [
      'Full Claude SaaS Starter codebase',
      'Supabase Auth integration',
      'Claude API streaming',
      'Stripe billing setup',
      'shadcn/ui components',
      'Complete documentation',
      'Lifetime updates',
      '1 year of support',
    ],
    popular: false,
  },
  {
    name: 'Yearly',
    price: '$1,490',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_YEARLY || '',
    description: 'Best value for serious builders',
    features: [
      'Everything in Monthly',
      'Priority support',
      'Early access to new features',
      'Custom integrations help',
      'Architecture consultation (1h)',
      'Code review (optional)',
      'Private Discord access',
      'Lifetime updates',
    ],
    popular: true,
  },
]

export default function PricingPage() {
  const { createCheckoutSession, isLoading } = useCheckout()

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="mb-4 text-4xl font-bold">
          Ship Your AI SaaS <span className="text-primary">in Days</span>
        </h1>
        <p className="mb-12 text-lg text-muted-foreground">
          The only Next.js boilerplate optimized specifically for Claude Sonnet 4.5.
          <br />
          Production-ready, fully documented, and ready to deploy.
        </p>

        <div className="grid gap-8 md:grid-cols-2">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={plan.popular ? 'border-primary shadow-lg' : ''}
            >
              {plan.popular && (
                <div className="bg-primary px-4 py-1 text-center text-sm font-medium text-primary-foreground">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">
                    {plan.name === 'Monthly' ? '/month' : '/year'}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="h-5 w-5 shrink-0 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  size="lg"
                  variant={plan.popular ? 'default' : 'outline'}
                  onClick={() => createCheckoutSession(plan.priceId)}
                  disabled={isLoading || !plan.priceId}
                >
                  {isLoading ? 'Loading...' : 'Get Started'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>✓ 14-day money-back guarantee</p>
          <p>✓ Secure payment via Stripe</p>
          <p>✓ Instant access after purchase</p>
        </div>
      </div>
    </div>
  )
}
