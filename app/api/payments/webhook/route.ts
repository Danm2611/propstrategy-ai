import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import Stripe from "stripe"

export async function POST(req: Request) {
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  const body = await req.text()
  const signature = headers().get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    console.error('Webhook error:', error.message)
    return NextResponse.json(
      { error: `Webhook Error: ${error.message}` },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        if (session.payment_status === 'paid') {
          const userId = session.metadata?.userId
          const type = session.metadata?.type

          if (!userId) {
            console.error('No userId in session metadata')
            break
          }

          if (type === 'credits') {
            // Handle one-time credit purchase
            const credits = parseInt(session.metadata?.credits || '0')
            
            if (credits > 0) {
              // Update user credits
              const user = await prisma.user.update({
                where: { id: userId },
                data: { credits: { increment: credits } },
                select: { credits: true }
              })

              // Create payment record
              await prisma.payment.create({
                data: {
                  userId,
                  amount: session.amount_total! / 100,
                  currency: session.currency!,
                  status: 'succeeded',
                  stripePaymentId: session.payment_intent as string,
                  description: `${credits} credit${credits > 1 ? 's' : ''} purchase`,
                  metadata: session.metadata as any,
                }
              })

              // Log credit transaction
              await prisma.creditLog.create({
                data: {
                  userId,
                  creditsChange: credits,
                  creditsAfter: user.credits,
                  transactionType: 'purchase',
                  description: `Purchased ${credits} credit${credits > 1 ? 's' : ''}`,
                  relatedId: session.payment_intent as string,
                }
              })
            }
          } else if (type === 'subscription') {
            // Handle subscription creation
            const subscriptionId = session.subscription as string
            const subscription = await stripe.subscriptions.retrieve(subscriptionId)
            
            // Create subscription record
            await prisma.subscription.create({
              data: {
                stripeCustomerId: session.customer as string,
                stripeSubscriptionId: subscriptionId,
                stripePriceId: subscription.items.data[0].price.id,
                status: subscription.status,
                currentPeriodEnd: new Date(subscription.current_period_end * 1000),
              }
            })

            // Update user subscription
            const plan = session.metadata?.plan
            const credits = parseInt(session.metadata?.credits || '0')
            
            await prisma.user.update({
              where: { id: userId },
              data: {
                subscription: plan,
                subscriptionEnd: new Date(subscription.current_period_end * 1000),
                credits: { increment: credits },
              }
            })

            // Log initial credits
            if (credits > 0) {
              await prisma.creditLog.create({
                data: {
                  userId,
                  creditsChange: credits,
                  creditsAfter: credits, // Assuming new subscription
                  transactionType: 'subscription',
                  description: `${plan} subscription - monthly credits`,
                  relatedId: subscriptionId,
                }
              })
            }
          }
        }
        break
      }

      case 'invoice.payment_succeeded': {
        // Handle subscription renewal
        const invoice = event.data.object as Stripe.Invoice
        
        if (invoice.billing_reason === 'subscription_cycle') {
          const subscriptionId = invoice.subscription as string
          const subscription = await stripe.subscriptions.retrieve(subscriptionId)
          
          // Find user by subscription
          const subRecord = await prisma.subscription.findUnique({
            where: { stripeSubscriptionId: subscriptionId }
          })

          if (subRecord) {
            // Get subscription plan details from metadata
            const metadata = subscription.metadata
            const credits = parseInt(metadata.credits || '0')
            const userId = metadata.userId

            if (userId && credits > 0) {
              // Add monthly credits
              const user = await prisma.user.update({
                where: { id: userId },
                data: { 
                  credits: { increment: credits },
                  subscriptionEnd: new Date(subscription.current_period_end * 1000),
                },
                select: { credits: true }
              })

              // Log credit addition
              await prisma.creditLog.create({
                data: {
                  userId,
                  creditsChange: credits,
                  creditsAfter: user.credits,
                  transactionType: 'subscription',
                  description: `Monthly subscription credits`,
                  relatedId: invoice.id,
                }
              })

              // Create payment record
              await prisma.payment.create({
                data: {
                  userId,
                  amount: invoice.amount_paid / 100,
                  currency: invoice.currency,
                  status: 'succeeded',
                  stripePaymentId: invoice.payment_intent as string,
                  stripeInvoiceId: invoice.id,
                  description: 'Subscription renewal',
                }
              })
            }
          }
        }
        break
      }

      case 'customer.subscription.deleted': {
        // Handle subscription cancellation
        const subscription = event.data.object as Stripe.Subscription
        
        await prisma.subscription.update({
          where: { stripeSubscriptionId: subscription.id },
          data: { 
            status: 'cancelled',
            cancelAtPeriodEnd: true,
          }
        })

        // Update user subscription status
        const metadata = subscription.metadata
        if (metadata.userId) {
          await prisma.user.update({
            where: { id: metadata.userId },
            data: { 
              subscription: null,
            }
          })
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}