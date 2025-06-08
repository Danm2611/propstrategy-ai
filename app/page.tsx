import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Container } from "@/components/ui/container"
import { 
  ArrowRight, 
  Building2, 
  CheckCircle2, 
  Clock, 
  FileText, 
  LineChart, 
  Sparkles,
  Users,
  Zap
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-primary/5 to-background">
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 flex justify-center">
              <Image 
                src="/propstrategylogo.png" 
                alt="PropStrategy AI" 
                width={80} 
                height={80}
                className="h-20 w-20"
              />
            </div>
            <Badge className="mb-4" variant="secondary">
              <Sparkles className="mr-1 h-3 w-3" />
              Powered by Claude 3.5 Sonnet
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Investment-Grade Property Analysis in Minutes
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              PropStrategy AI delivers comprehensive property development analysis powered by advanced AI. 
              Get professional reports analyzing multiple exit strategies, development costs, and optimal investment approaches.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link href="/auth/signup">
                <Button size="lg" className="gap-2">
                  Start Free Analysis
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#pricing">
                <Button size="lg" variant="outline">
                  View Pricing
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              No credit card required • 1 free report included
            </p>
          </div>
        </Container>
      </section>

      {/* Features Grid */}
      <section className="py-20" id="features">
        <Container>
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Professional Analysis, Simplified
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Everything you need to make informed property investment decisions
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Lightning Fast</CardTitle>
                <CardDescription>
                  Get comprehensive reports in under 2 minutes instead of weeks
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <LineChart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Multiple Strategies</CardTitle>
                <CardDescription>
                  Analyze HMO conversion, apartment development, flips, and more
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Professional PDFs</CardTitle>
                <CardDescription>
                  Download beautifully formatted reports ready for investors
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>All Property Types</CardTitle>
                <CardDescription>
                  Residential, commercial, care homes, offices - we analyze them all
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>AI-Powered Insights</CardTitle>
                <CardDescription>
                  Leveraging Claude Opus 4 for institutional-grade analysis
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Trusted by Pros</CardTitle>
                <CardDescription>
                  Used by developers, investors, and agents across the UK
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </Container>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-muted/50">
        <Container>
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              PropStrategy AI vs Traditional Methods
            </h2>
          </div>

          <div className="mx-auto max-w-4xl">
            <div className="overflow-hidden rounded-lg border bg-background">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-6 py-4 text-left"></th>
                    <th className="px-6 py-4 text-center font-semibold">PropStrategy AI</th>
                    <th className="px-6 py-4 text-center font-semibold text-muted-foreground">Traditional Consultant</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="px-6 py-4 font-medium">Time to Report</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2 text-green-600">
                        <Clock className="h-4 w-4" />
                        2 minutes
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-muted-foreground">2-4 weeks</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-6 py-4 font-medium">Cost per Analysis</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-green-600 font-semibold">From £49</span>
                    </td>
                    <td className="px-6 py-4 text-center text-muted-foreground">£2,000-£5,000</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-6 py-4 font-medium">Exit Strategies Analyzed</td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-semibold">3-4 strategies</span>
                    </td>
                    <td className="px-6 py-4 text-center text-muted-foreground">1-2 strategies</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-6 py-4 font-medium">24/7 Availability</td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center text-muted-foreground">Business hours only</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium">Data-Driven Analysis</td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Container>
      </section>

      {/* Pricing Section */}
      <section className="py-20" id="pricing">
        <Container>
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Choose the plan that works for your investment strategy
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-3">
            {/* Pay Per Report */}
            <Card>
              <CardHeader>
                <CardTitle>Pay Per Report</CardTitle>
                <CardDescription>Perfect for occasional analysis</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">£49</span>
                  <span className="text-muted-foreground">/report</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Professional analysis report
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    3 exit strategies
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Financial projections
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    PDF download
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/auth/signup" className="w-full">
                  <Button className="w-full" variant="outline">Get Started</Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Basic Subscription */}
            <Card className="border-primary">
              <CardHeader>
                <Badge className="w-fit mb-2">Most Popular</Badge>
                <CardTitle>Basic</CardTitle>
                <CardDescription>For active property sourcers</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">£97</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    3 professional reports/month
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    All property types
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Priority support
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Save £50/month
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/auth/signup" className="w-full">
                  <Button className="w-full">Start Free Trial</Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Pro Subscription */}
            <Card>
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <CardDescription>For property developers</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">£297</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    10 professional reports/month
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Development appraisals
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    API access
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    White-label options
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/auth/signup" className="w-full">
                  <Button className="w-full" variant="outline">Contact Sales</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to revolutionize your property analysis?
            </h2>
            <p className="mt-4 text-lg opacity-90">
              Join hundreds of property professionals saving time and money with AI-powered insights
            </p>
            <div className="mt-8">
              <Link href="/auth/signup">
                <Button size="lg" variant="secondary" className="gap-2">
                  Start Your Free Analysis
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}