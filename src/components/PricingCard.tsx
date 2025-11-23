import { formatGhs, getUsdEquivalent } from '@/lib/paystack/utils';
import Link from 'next/link';

interface PricingCardProps {
    name: string;
    price: number; // in GHS
    features: string[];
    highlighted?: boolean;
    ctaText?: string;
    ctaHref?: string;
}

export function PricingCard({
    name,
    price,
    features,
    highlighted = false,
    ctaText = 'Get Started',
    ctaHref = '/signup',
}: PricingCardProps) {
    return (
        <div
            className={`rounded-lg border-2 p-8 ${highlighted
                    ? 'border-blue-600 shadow-xl scale-105'
                    : 'border-gray-200'
                }`}
        >
            <h3 className="text-2xl font-bold mb-2">{name}</h3>

            {price === 0 ? (
                <div className="mb-6">
                    <span className="text-4xl font-bold">Free</span>
                </div>
            ) : (
                <div className="mb-6">
                    <span className="text-4xl font-bold">{formatGhs(price)}</span>
                    <span className="text-gray-600 ml-2">/user/month</span>
                    <div className="text-sm text-gray-500 mt-1">
                        {getUsdEquivalent(price)}
                    </div>
                </div>
            )}

            <ul className="space-y-3 mb-8">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                        <svg
                            className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                    </li>
                ))}
            </ul>

            <Link
                href={ctaHref}
                className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-colors ${highlighted
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
            >
                {ctaText}
            </Link>
        </div>
    );
}
