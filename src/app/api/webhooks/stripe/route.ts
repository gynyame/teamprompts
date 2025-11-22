import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

export async function POST(req: Request) {
    const body = await req.text()
    const signature = (await headers()).get('Stripe-Signature') as string

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
    }

    const session = event.data.object as Stripe.Checkout.Session

    if (event.type === 'checkout.session.completed') {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string) as Stripe.Subscription

        if (!session?.metadata?.teamId) {
            return new NextResponse('Team ID is missing in metadata', { status: 400 })
        }

        const supabase = await createClient()

        // Update team subscription status
        await supabase
            .from('teams')
            .update({
                stripe_subscription_id: subscription.id,
                stripe_customer_id: subscription.customer as string,
                stripe_price_id: subscription.items.data[0].price.id,
                stripe_current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
            })
            .eq('id', session.metadata.teamId)
    }

    if (event.type === 'invoice.payment_succeeded') {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string) as Stripe.Subscription
        const supabase = await createClient()

        await supabase
            .from('teams')
            .update({
                stripe_price_id: subscription.items.data[0].price.id,
                stripe_current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
            })
            .eq('stripe_subscription_id', subscription.id)
    }

    return new NextResponse(null, { status: 200 })
}
