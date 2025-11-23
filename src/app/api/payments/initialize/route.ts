import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { paystackClient } from '@/lib/paystack/client';
import { ghsToPesewas, generateReference } from '@/lib/paystack/utils';

export async function POST(req: NextRequest) {
    try {
        const { teamId, planType } = await req.json();

        // Create Supabase client
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value;
                    },
                },
            }
        );

        // Get current user
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Verify user is admin of team
        const { data: membership } = await supabase
            .from('team_members')
            .select('role')
            .eq('team_id', teamId)
            .eq('user_id', user.id)
            .single();

        if (!membership || membership.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Get team details
        const { data: team } = await supabase
            .from('teams')
            .select('name')
            .eq('id', teamId)
            .single();

        // Calculate amount (GHS 45 per user per month for Team plan)
        const pricePerUser = parseInt(process.env.NEXT_PUBLIC_TEAM_PLAN_PRICE || '45');
        const amount = ghsToPesewas(pricePerUser);

        // Initialize Paystack transaction
        const reference = generateReference();
        const transaction = await paystackClient.initializeTransaction({
            email: user.email!,
            amount,
            currency: 'GHS',
            callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payments/callback`,
            metadata: {
                team_id: teamId,
                team_name: team?.name,
                user_id: user.id,
                plan_type: planType,
            },
            channels: ['card', 'mobile_money'],
        });

        // Store transaction reference in database
        await supabase.from('paystack_transactions').insert({
            team_id: teamId,
            reference: transaction.data.reference,
            amount,
            currency: 'GHS',
            status: 'pending',
            metadata: {
                plan_type: planType,
                user_id: user.id,
            },
        });

        return NextResponse.json({
            authorization_url: transaction.data.authorization_url,
            access_code: transaction.data.access_code,
            reference: transaction.data.reference,
        });
    } catch (error: any) {
        console.error('Payment initialization error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to initialize payment' },
            { status: 500 }
        );
    }
}
