import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-5xl font-bold tracking-tight mb-6">
            Claude SaaS Starter
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            The fastest way to build and launch AI-powered SaaS products with Claude Sonnet 4.5
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
          <Card>
            <CardHeader>
              <CardTitle>🔐 Authentication</CardTitle>
              <CardDescription>
                Secure auth with Supabase
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Email/password authentication</li>
                <li>• Protected routes with middleware</li>
                <li>• Session management</li>
                <li>• Email confirmation flow</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🤖 Claude Integration</CardTitle>
              <CardDescription>
                Streaming AI powered by Claude Sonnet 4.5
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Real-time streaming responses</li>
                <li>• Server-Sent Events (SSE)</li>
                <li>• Optimized API routes</li>
                <li>• Type-safe React hooks</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🎨 Modern UI</CardTitle>
              <CardDescription>
                Beautiful components out of the box
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• shadcn/ui components</li>
                <li>• Tailwind CSS styling</li>
                <li>• Dark mode support</li>
                <li>• Responsive design</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Tech Stack */}
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-6">Built with modern tools</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              'Next.js 14',
              'TypeScript',
              'Tailwind CSS',
              'shadcn/ui',
              'Supabase',
              'Claude Sonnet 4.5',
            ].map((tech) => (
              <div
                key={tech}
                className="px-4 py-2 bg-white dark:bg-slate-800 rounded-lg border shadow-sm"
              >
                {tech}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
