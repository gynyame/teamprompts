import { NextRequest, NextResponse } from 'next/server';
import { redirect } from 'next/navigation';
import { paystackClient } from '@/lib/paystack/client';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'
);

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const reference = searchParams.get('reference');

    if (!reference) {
        return redirect('/dashboard?payment=failed');
    }

    try {
        // Verify transaction with Paystack
        const verification = await paystackClient.verifyTransaction(reference);

        if (verification.data.status !== 'success') {
            // Update transaction status
            await supabase
                .from('paystack_transactions')
                .update({ status: 'failed' })
                .eq('reference', reference);

            return redirect('/dashboard?payment=failed');
        }

        const { metadata, authorization, customer } = verification.data;
        const teamId = metadata.team_id;

        // Update transaction record
        await supabase
            .from('paystack_transactions')
            .update({
                status: 'success',
                authorization_code: authorization.authorization_code,
                customer_code: customer.customer_code,
                paid_at: new Date().toISOString(),
                channel: authorization.channel,
            })
            .eq('reference', reference);

        // Update team subscription status
        await supabase
            .from('teams')
            .update({
                plan: 'team',
                paystack_customer_code: customer.customer_code,
                paystack_authorization_code: authorization.authorization_code,
            })
            .eq('id', teamId);

        // Create subscription on Paystack
        // Note: You need to create a plan in Paystack dashboard first
        // Or create it programmatically using paystackClient.createPlan()

        return redirect('/dashboard?payment=success');
    } catch (error) {
        console.error('Payment callback error:', error);
        return redirect('/dashboard?payment=error');
    }
}
