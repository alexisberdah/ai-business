import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your Claude-powered SaaS application
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Claude Chat</CardTitle>
            <CardDescription>
              Experience streaming AI responses powered by Claude Sonnet 4.5
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/chat">
              <Button className="w-full">Start chatting</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Usage</CardTitle>
            <CardDescription>
              Track your Claude API consumption and costs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0 requests</p>
            <p className="text-sm text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documentation</CardTitle>
            <CardDescription>
              Learn how to integrate Claude into your app
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" asChild>
              <a
                href="https://docs.anthropic.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                View docs
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
