"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Container } from "@/components/ui/container"
import { useToast } from "@/hooks/use-toast"
import { 
  CheckCircle2, 
  CreditCard,
  Loader2,
  Sparkles,
  TrendingUp,
  Zap
} from "lucide-react"

export default function PricingPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handlePurchase = async (type: 'credits' | 'subscription', plan: string) => {
    if (!session) {
      router.push("/auth/signin")
      return
    }

    // Handle free 10 credits pack
    if (plan === 'pack10-free') {
      setIsLoading(`${type}-${plan}`)
      try {
        const response = await fetch("/api/credits/add-free", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ credits: 10 }),
        })

        if (!response.ok) {
          throw new Error("Failed to add free credits")
        }

        toast({
          title: "🎉 Free Credits Added!",
          description: "10 free credits have been added to your account. Try the enhanced AI with live property data!",
        })
        
        router.push("/dashboard")
        return
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to add free credits. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(null)
      }
      return
    }

    setIsLoading(`${type}-${plan}`)

    try {
      const response = await fetch("/api/payments/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type, plan }),
      })

      if (!response.ok) {
        throw new Error("Failed to create checkout session")
      }

      const { url } = await response.json()
      
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start checkout process. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="container py-8">
      <div className="mx-auto max-w-4xl text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-lg text-muted-foreground">
          Choose between pay-as-you-go credits or save with a monthly subscription
        </p>
      </div>

      <Tabs defaultValue="credits" className="mx-auto max-w-6xl">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="credits">Credit Packages</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
        </TabsList>

        <TabsContent value="credits" className="mt-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Single Credit */}
            <Card>
              <CardHeader>
                <CardTitle>Single Credit</CardTitle>
                <CardDescription>Perfect for trying out</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">£49</span>
                  <span className="text-muted-foreground">/credit</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                    1 property analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                    Professional report
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                    Never expires
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => handlePurchase('credits', 'single')}
                  disabled={isLoading === 'credits-single'}
                >
                  {isLoading === 'credits-single' && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Buy 1 Credit
                </Button>
              </CardFooter>
            </Card>

            {/* 5 Credit Pack */}
            <Card>
              <CardHeader>
                <Badge className="w-fit mb-2" variant="secondary">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  Save £25
                </Badge>
                <CardTitle>5 Credits</CardTitle>
                <CardDescription>For regular users</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">£220</span>
                  <span className="text-muted-foreground"> (£44 each)</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                    5 property analyses
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                    Save £5 per report
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                    Never expires
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => handlePurchase('credits', 'pack5')}
                  disabled={isLoading === 'credits-pack5'}
                >
                  {isLoading === 'credits-pack5' && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Buy 5 Credits
                </Button>
              </CardFooter>
            </Card>

            {/* 10 Credit Pack - FREE */}
            <Card className="border-green-500 bg-green-50">
              <CardHeader>
                <Badge className="w-fit mb-2 bg-green-600 text-white">
                  <Sparkles className="mr-1 h-3 w-3" />
                  🎉 LIMITED TIME FREE
                </Badge>
                <CardTitle className="text-green-700">10 Credits</CardTitle>
                <CardDescription>Try enhanced AI with live data</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-green-600">FREE</span>
                  <span className="text-muted-foreground line-through ml-2">£400</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                    10 property analyses
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                    🔴 LIVE Land Registry data
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                    🔴 Real property comparables
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                    Enhanced AI analysis
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700" 
                  onClick={() => handlePurchase('credits', 'pack10-free')}
                  disabled={isLoading === 'credits-pack10-free'}
                >
                  {isLoading === 'credits-pack10-free' && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Get 10 FREE Credits
                </Button>
              </CardFooter>
            </Card>

            {/* 20 Credit Pack */}
            <Card>
              <CardHeader>
                <Badge className="w-fit mb-2" variant="secondary">
                  <Zap className="mr-1 h-3 w-3" />
                  Enterprise
                </Badge>
                <CardTitle>20 Credits</CardTitle>
                <CardDescription>For teams & agencies</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">£700</span>
                  <span className="text-muted-foreground"> (£35 each)</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                    20 property analyses
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                    Save £280 total
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                    Dedicated support
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => handlePurchase('credits', 'pack20')}
                  disabled={isLoading === 'credits-pack20'}
                >
                  {isLoading === 'credits-pack20' && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Buy 20 Credits
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="subscriptions" className="mt-8">
          <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
            {/* Basic Plan */}
            <Card>
              <CardHeader>
                <CardTitle>Basic</CardTitle>
                <CardDescription>For property sourcers</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">£97</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                    3 reports per month
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                    All property types
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                    Priority support
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                    Cancel anytime
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => handlePurchase('subscription', 'basic')}
                  disabled={isLoading === 'subscription-basic'}
                >
                  {isLoading === 'subscription-basic' && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Subscribe
                </Button>
              </CardFooter>
            </Card>

            {/* Pro Plan */}
            <Card className="border-primary">
              <CardHeader>
                <Badge className="w-fit mb-2">Most Popular</Badge>
                <CardTitle>Pro</CardTitle>
                <CardDescription>For active developers</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">£297</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                    10 reports per month
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                    Development appraisals
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                    API access (coming soon)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                    Priority support
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={() => handlePurchase('subscription', 'pro')}
                  disabled={isLoading === 'subscription-pro'}
                >
                  {isLoading === 'subscription-pro' && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Subscribe
                </Button>
              </CardFooter>
            </Card>

            {/* Enterprise Plan */}
            <Card>
              <CardHeader>
                <Badge className="w-fit mb-2" variant="secondary">
                  <CreditCard className="mr-1 h-3 w-3" />
                  Enterprise
                </Badge>
                <CardTitle>Enterprise</CardTitle>
                <CardDescription>For teams & agencies</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">£597</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                    30 reports per month
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                    White-label options
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                    API access
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                    Dedicated support
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => handlePurchase('subscription', 'enterprise')}
                  disabled={isLoading === 'subscription-enterprise'}
                >
                  {isLoading === 'subscription-enterprise' && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Contact Sales
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-16 mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4 text-left">
          <div>
            <h3 className="font-semibold mb-2">Do credits expire?</h3>
            <p className="text-muted-foreground">
              No, purchased credits never expire. Use them whenever you need them.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Can I cancel my subscription?</h3>
            <p className="text-muted-foreground">
              Yes, you can cancel anytime. You'll keep access until the end of your billing period.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
            <p className="text-muted-foreground">
              We accept all major credit cards and debit cards through our secure payment processor, Stripe.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Can I upgrade or downgrade?</h3>
            <p className="text-muted-foreground">
              Yes, you can change your subscription plan at any time. Changes take effect on your next billing cycle.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}