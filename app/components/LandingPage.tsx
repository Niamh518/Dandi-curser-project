import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  GitBranch,
  Star,
  GitPullRequest,
  Code,
  Zap,
  ArrowRight,
  Check,
  BarChart3,
  TrendingUp,
  Users,
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-primary text-primary-foreground sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GitBranch className="h-8 w-8 text-primary-foreground" />
            <span className="text-2xl font-bold text-primary-foreground">Dandi</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
              Pricing
            </a>
            <a href="#docs" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
              Docs
            </a>
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
            >
              Sign In
            </Button>
            <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
              Get Started
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-muted/30 to-accent/5">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-4 bg-accent/10 text-accent border-accent/20">
            <Zap className="h-3 w-3 mr-1" />
            Free Tier Available
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Unlock the Power of Your
            <span className="text-accent"> GitHub Repositories</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            Get comprehensive summaries, star tracking, cool facts, and important pull request insights for any open
            source repository through our powerful API
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 bg-accent text-accent-foreground hover:bg-accent/90">
              Get Started for Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              View Documentation
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">No credit card required • 1000 API calls/month free</p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Everything you need to analyze repositories</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our API provides deep insights into GitHub repositories with simple REST endpoints
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border hover:shadow-lg transition-shadow bg-card">
              <CardHeader>
                <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Code className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Repository Summaries</CardTitle>
                <CardDescription>
                  Get comprehensive summaries including language breakdown, commit activity, and code quality metrics
                  for any repository
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow bg-card">
              <CardHeader>
                <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Star Tracking</CardTitle>
                <CardDescription>
                  Monitor star growth patterns, identify trending periods, and track repository popularity over time
                  with detailed analytics
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow bg-card">
              <CardHeader>
                <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <GitPullRequest className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Important Pull Requests</CardTitle>
                <CardDescription>
                  Analyze the most significant PRs, merge patterns, contributor activity, and code review metrics
                  automatically
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow bg-card">
              <CardHeader>
                <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Cool Facts & Insights</CardTitle>
                <CardDescription>
                  Discover interesting statistics, contributor insights, and unique repository characteristics that make
                  each project special
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow bg-card">
              <CardHeader>
                <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Version Updates</CardTitle>
                <CardDescription>
                  Stay informed about the latest releases, version history, and update patterns to track project
                  evolution
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow bg-card">
              <CardHeader>
                <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Open Source Focus</CardTitle>
                <CardDescription>
                  Specialized analysis for open source repositories with community metrics, contribution patterns, and
                  project health indicators
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-6">Simple API Integration</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Get started in minutes with our RESTful API. No complex setup required - just make HTTP requests and get
                comprehensive JSON responses with all the insights you need.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-accent" />
                  <span>RESTful API with comprehensive JSON responses</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-accent" />
                  <span>Rate limiting and authentication included</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-accent" />
                  <span>Comprehensive documentation and code examples</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-accent" />
                  <span>Support for all major programming languages</span>
                </div>
              </div>
            </div>
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-sm font-mono">API Example</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm bg-muted p-4 rounded-lg overflow-x-auto">
                  <code>{`curl -X GET \\
  "https://api.dandi.dev/v1/analyze/facebook/react" \\
  -H "Authorization: Bearer YOUR_API_KEY"

{
  "repository": "facebook/react",
  "stars": 228000,
  "summary": "A declarative, efficient, and flexible JavaScript library for building user interfaces",
  "languages": {
    "JavaScript": 94.2,
    "TypeScript": 5.8
  },
  "cool_facts": [
    "Most starred JavaScript library",
    "Used by 70% of Fortune 500 companies"
  ],
  "important_prs": [
    {
      "title": "Add React 18 features",
      "impact": "high",
      "merged_at": "2024-01-15"
    }
  ],
  "latest_version": "18.2.0"
}`}</code>
                </pre>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Simple, transparent pricing</h2>
            <p className="text-xl text-muted-foreground">Start free, scale as you grow</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <CardDescription>Perfect for trying out the API</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-accent mr-2" />
                    1,000 API calls/month
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-accent mr-2" />
                    Basic repository analysis
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-accent mr-2" />
                    Community support
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-accent mr-2" />
                    Standard rate limits
                  </li>
                </ul>
                <Button className="w-full mt-6 bg-transparent" variant="outline">
                  Get Started
                </Button>
              </CardContent>
            </Card>

            <Card className="border-accent shadow-lg scale-105 bg-card">
              <CardHeader>
                <Badge className="w-fit mb-2 bg-accent text-accent-foreground">Most Popular</Badge>
                <CardTitle>Pro</CardTitle>
                <CardDescription>For growing projects and teams</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">$29</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-accent mr-2" />
                    50,000 API calls/month
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-accent mr-2" />
                    Advanced analytics & insights
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-accent mr-2" />
                    Priority support
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-accent mr-2" />
                    Historical data access
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-accent mr-2" />
                    Higher rate limits
                  </li>
                </ul>
                <Button className="w-full mt-6 bg-accent text-accent-foreground hover:bg-accent/90">
                  Start Pro Trial
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <CardDescription>For large-scale applications</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">Custom</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-accent mr-2" />
                    Unlimited API calls
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-accent mr-2" />
                    Custom integrations
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-accent mr-2" />
                    Dedicated support
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-accent mr-2" />
                    SLA guarantees
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-accent mr-2" />
                    White-label options
                  </li>
                </ul>
                <Button className="w-full mt-6 bg-transparent" variant="outline">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to unlock repository insights?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of developers using Dandi to analyze GitHub repositories
          </p>
          <Button size="lg" className="text-lg px-8 bg-accent text-accent-foreground hover:bg-accent/90">
            Start Your Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-muted/30 border-t border-border">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <GitBranch className="h-6 w-6 text-accent" />
                <span className="text-xl font-bold">Dandi</span>
              </div>
              <p className="text-muted-foreground">Powerful GitHub repository analysis through a simple API</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#features" className="hover:text-foreground transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-foreground transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    API Reference
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Dandi. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
