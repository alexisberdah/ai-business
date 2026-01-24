import { getUserUsageSummary } from '@/lib/usage/log-usage'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export async function UsageStats() {
  // Get usage for current billing period (last 30 days)
  const usage = await getUserUsageSummary()

  if (!usage) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>API Usage</CardTitle>
          <CardDescription>Your Claude API usage for the current period</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No usage data available</p>
        </CardContent>
      </Card>
    )
  }

  const stats = [
    {
      label: 'Total Requests',
      value: Number(usage.total_requests).toLocaleString(),
      description: 'API calls made',
    },
    {
      label: 'Total Messages',
      value: Number(usage.total_messages).toLocaleString(),
      description: 'Chat messages processed',
    },
    {
      label: 'Input Tokens',
      value: Number(usage.total_input_tokens).toLocaleString(),
      description: 'Tokens sent to Claude',
    },
    {
      label: 'Output Tokens',
      value: Number(usage.total_output_tokens).toLocaleString(),
      description: 'Tokens received from Claude',
    },
    {
      label: 'Total Tokens',
      value: Number(usage.total_tokens).toLocaleString(),
      description: 'Combined token usage',
    },
  ]

  // Calculate estimated cost (Claude Sonnet 4 pricing)
  // Input: $3/MTok, Output: $15/MTok
  const inputCost = (Number(usage.total_input_tokens) / 1_000_000) * 3
  const outputCost = (Number(usage.total_output_tokens) / 1_000_000) * 15
  const totalCost = inputCost + outputCost

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Usage</CardTitle>
        <CardDescription>Your Claude API usage for the last 30 days</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Usage Stats Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </div>
          ))}
        </div>

        {/* Cost Estimation */}
        <div className="rounded-lg border bg-muted/50 p-4">
          <p className="mb-2 text-sm font-medium">Estimated API Cost</p>
          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Input ({Number(usage.total_input_tokens).toLocaleString()} tokens)</span>
              <span>${inputCost.toFixed(4)}</span>
            </div>
            <div className="flex justify-between">
              <span>Output ({Number(usage.total_output_tokens).toLocaleString()} tokens)</span>
              <span>${outputCost.toFixed(4)}</span>
            </div>
            <div className="flex justify-between border-t pt-1 font-medium text-foreground">
              <span>Total</span>
              <span>${totalCost.toFixed(2)}</span>
            </div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Based on Claude Sonnet 4 pricing: $3/MTok input, $15/MTok output
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
