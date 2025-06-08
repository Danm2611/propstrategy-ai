import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { stripe, PRICES } from "@/lib/stripe"

export async function POST(req: Request) {
  try {
    if (!stripe) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
    }

    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { type, plan } = await req.json()

    let lineItems: any[] = []
    let mode: 'payment' | 'subscription' = 'payment'
    let metadata: any = {
      userId: session.user.id,
      type,
    }

    if (type === 'credits') {
      // One-time credit purchase
      const creditPlan = PRICES.credits[plan as keyof typeof PRICES.credits]
      if (!creditPlan) {
        return NextResponse.json(
          { error: "Invalid credit plan" },
          { status: 400 }
        )
      }

      lineItems = [{
        price_data: {
          currency: 'gbp',
          product_data: {
            name: creditPlan.name,
            description: `${creditPlan.credits} analysis credit${creditPlan.credits > 1 ? 's' : ''}`,
          },
          unit_amount: creditPlan.amount,
        },
        quantity: 1,
      }]

      metadata.credits = creditPlan.credits
      metadata.plan = plan
    } else if (type === 'subscription') {
      // Subscription
      mode = 'subscription'
      const subPlan = PRICES.subscriptions[plan as keyof typeof PRICES.subscriptions]
      if (!subPlan || !subPlan.priceId) {
        return NextResponse.json(
          { error: "Invalid subscription plan" },
          { status: 400 }
        )
      }

      lineItems = [{
        price: subPlan.priceId,
        quantity: 1,
      }]

      metadata.plan = plan
      metadata.credits = subPlan.credits
    } else {
      return NextResponse.json(
        { error: "Invalid purchase type" },
        { status: 400 }
      )
    }

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode,
      payment_method_types: ['card'],
      line_items: lineItems,
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?payment=success`,
      cancel_url: `${process.env.NEXTAUTH_URL}/pricing?payment=cancelled`,
      customer_email: session.user.email!,
      metadata,
      ...(mode === 'subscription' && {
        subscription_data: {
          metadata,
        },
      }),
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    )
  }
}