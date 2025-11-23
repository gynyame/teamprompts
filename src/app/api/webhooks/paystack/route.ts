import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyWebhookSignature } from '@/lib/paystack/utils';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'
);

export async function POST(req: NextRequest) {
    try {
        const signature = req.headers.get('x-paystack-signature');
        const body = await req.text();

        if (!signature || !verifyWebhookSignature(body, signature)) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        const event = JSON.parse(body);

        switch (event.event) {
            case 'charge.success':
                await handleChargeSuccess(event.data);
                break;

            case 'subscription.create':
                await handleSubscriptionCreate(event.data);
                break;

            case 'subscription.disable':
                await handleSubscriptionDisable(event.data);
                break;

            case 'invoice.payment_failed':
                await handlePaymentFailed(event.data);
                break;

            default:
                console.log('Unhandled event type:', event.event);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json(
            { error: 'Webhook processing failed' },
            { status: 500 }
        );
    }
}

async function handleChargeSuccess(data: any) {
    const { reference, metadata, customer, authorization } = data;

    await supabase
        .from('paystack_transactions')
        .update({
            status: 'success',
            authorization_code: authorization.authorization_code,
            customer_code: customer.customer_code,
            paid_at: new Date().toISOString(),
        })
        .eq('reference', reference);
}

async function handleSubscriptionCreate(data: any) {
    const { subscription_code, customer, plan } = data;
    const teamId = data.metadata?.team_id;

    if (teamId) {
        await supabase
            .from('teams')
            .update({
                plan: 'team',
                paystack_subscription_code: subscription_code,
                paystack_customer_code: customer.customer_code,
            })
            .eq('id', teamId);
    }
}

async function handleSubscriptionDisable(data: any) {
    const { subscription_code } = data;

    await supabase
        .from('teams')
        .update({
            plan: 'free',
            paystack_subscription_code: null,
        })
        .eq('paystack_subscription_code', subscription_code);
}

async function handlePaymentFailed(data: any) {
    const { subscription_code } = data;

    // Optionally downgrade team or send notification
    console.log('Payment failed for subscription:', subscription_code);
}
