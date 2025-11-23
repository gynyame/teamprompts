'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { PaystackCheckout } from '@/components/PaystackCheckout';
import { formatGhs, getUsdEquivalent } from '@/lib/paystack/utils';

export default function BillingPage({ params }: { params: { teamSlug: string } }) {
    const [team, setTeam] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showCheckout, setShowCheckout] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        loadTeamData();
    }, []);

    async function loadTeamData() {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            router.push('/login');
            return;
        }

        const { data: teamData } = await supabase
            .from('teams')
            .select('*')
            .eq('slug', params.teamSlug)
            .single();

        setTeam(teamData);
        setLoading(false);
    }

    async function handlePaymentSuccess(reference: string) {
        // Verify payment on server
        const response = await fetch('/api/payments/callback?reference=' + reference, {
            method: 'GET',
        });

        if (response.ok) {
            // Reload team data
            await loadTeamData();
            setShowCheckout(false);
            alert('Payment successful! Your team has been upgraded.');
        }
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    const teamPrice = parseInt(process.env.NEXT_PUBLIC_TEAM_PLAN_PRICE || '45');

    return (
        <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8">Billing & Subscription</h1>

            <div className="bg-white rounded-lg border p-6 mb-8">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-xl font-semibold">Current Plan</h2>
                        <p className="text-gray-600 mt-1">
                            {team.plan === 'free' ? 'Free Plan' : 'Team Plan'}
                        </p>
                    </div>
                    <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${team.plan === 'free'
                                ? 'bg-gray-100 text-gray-700'
                                : 'bg-green-100 text-green-700'
                            }`}
                    >
                        {team.plan === 'free' ? 'Free' : 'Active'}
                    </span>
                </div>

                {team.plan === 'free' ? (
                    <div className="space-y-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h3 className="font-semibold mb-2">Upgrade to Team Plan</h3>
                            <ul className="text-sm text-gray-700 space-y-1 mb-4">
                                <li>✓ Unlimited prompts</li>
                                <li>✓ Unlimited team members</li>
                                <li>✓ Advanced features & analytics</li>
                                <li>✓ Priority support</li>
                            </ul>
                            <div className="flex items-baseline gap-2 mb-4">
                                <span className="text-2xl font-bold">{formatGhs(teamPrice)}</span>
                                <span className="text-gray-600">/user/month</span>
                                <span className="text-sm text-gray-500">
                                    {getUsdEquivalent(teamPrice)}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowCheckout(true)}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                            Upgrade Now
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-3 border-b">
                            <span className="text-gray-600">Amount</span>
                            <span className="font-semibold">{formatGhs(teamPrice)}/user/month</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b">
                            <span className="text-gray-600">Next Billing Date</span>
                            <span className="font-semibold">
                                {team.next_billing_date
                                    ? new Date(team.next_billing_date).toLocaleDateString()
                                    : 'N/A'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-3">
                            <span className="text-gray-600">Payment Method</span>
                            <span className="font-semibold">
                                {team.paystack_authorization_code ? 'Card on file' : 'None'}
                            </span>
                        </div>

                        <button
                            onClick={() => {
                                if (confirm('Are you sure you want to cancel your subscription?')) {
                                    // Handle cancellation
                                }
                            }}
                            className="text-red-600 hover:text-red-700 font-semibold"
                        >
                            Cancel Subscription
                        </button>
                    </div>
                )}
            </div>

            {showCheckout && team.plan === 'free' && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Upgrade to Team Plan</h2>
                            <button
                                onClick={() => setShowCheckout(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>

                        <PaystackCheckout
                            email={team.created_by_email || ''}
                            teamId={team.id}
                            amount={teamPrice}
                            planName="Team Plan"
                            onSuccess={handlePaymentSuccess}
                            onClose={() => setShowCheckout(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
