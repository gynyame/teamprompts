'use client';

import { usePaystackPayment } from 'react-paystack';
import { useState } from 'react';
import { ghsToPesewas, formatGhs, getUsdEquivalent } from '@/lib/paystack/utils';

interface PaystackCheckoutProps {
    email: string;
    teamId: string;
    amount: number; // in GHS
    planName: string;
    onSuccess: (reference: string) => void;
    onClose?: () => void;
}

export function PaystackCheckout({
    email,
    teamId,
    amount,
    planName,
    onSuccess,
    onClose,
}: PaystackCheckoutProps) {
    const [loading, setLoading] = useState(false);

    const config = {
        reference: `teamprompts_${teamId}_${Date.now()}`,
        email,
        amount: ghsToPesewas(amount), // Convert to pesewas
        currency: 'GHS',
        publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
        metadata: {
            team_id: teamId,
            plan_name: planName,
            custom_fields: [
                {
                    display_name: 'Team ID',
                    variable_name: 'team_id',
                    value: teamId,
                },
            ],
        },
        channels: ['card', 'mobile_money'], // Enable both payment methods
    };

    const initializePayment = usePaystackPayment(config);

    const handleSuccess = (reference: any) => {
        setLoading(true);
        onSuccess(reference.reference);
    };

    const handleClose = () => {
        setLoading(false);
        onClose?.();
    };

    return (
        <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                    <span className="text-gray-600">Plan:</span>
                    <span className="font-semibold">{planName}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-600">Amount:</span>
                    <div className="text-right">
                        <span className="font-bold text-lg">{formatGhs(amount)}</span>
                        <span className="text-sm text-gray-500 ml-2">
                            {getUsdEquivalent(amount)}
                        </span>
                    </div>
                </div>
                <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-600">Billing:</span>
                    <span className="text-sm">Monthly</span>
                </div>
            </div>

            <button
                onClick={() => {
                    (initializePayment as any)(handleSuccess, handleClose);
                }}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Processing...' : `Pay ${formatGhs(amount)}`}
            </button>

            <p className="text-xs text-center text-gray-500">
                Secure payment powered by Paystack
                <br />
                Supports cards and Mobile Money (MTN, Vodafone, AirtelTigo)
            </p>
        </div>
    );
}
