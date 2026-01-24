'use client'

import { Button } from '@/components/ui/button'
import { useCheckout } from '@/lib/stripe/use-checkout'

export function ManageBillingButton() {
  const { manageBilling, isLoading } = useCheckout()

  return (
    <Button onClick={manageBilling} disabled={isLoading} variant="outline">
      {isLoading ? 'Loading...' : 'Manage Billing'}
    </Button>
  )
}
