import { PricingCard } from '@/components/PricingCard';

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-16 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold mb-4">
                        Simple, Transparent Pricing
                    </h1>
                    <p className="text-xl text-gray-600">
                        Start free. Upgrade when your team is ready.
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        Prices in Ghana Cedis (GHS). International pricing coming soon.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <PricingCard
                        name="Free"
                        price={0}
                        features={[
                            '50 prompts',
                            '3 team members',
                            'Basic search',
                            'Folders & tags',
                            'Email support',
                        ]}
                        ctaText="Get Started Free"
                        ctaHref="/signup"
                    />

                    <PricingCard
                        name="Team"
                        price={45}
                        features={[
                            'Unlimited prompts',
                            'Unlimited team members',
                            'Advanced search',
                            'Version control',
                            'Usage analytics',
                            'Browser extension',
                            'Priority support',
                            'Team roles & permissions',
                        ]}
                        highlighted={true}
                        ctaText="Start Free Trial"
                        ctaHref="/signup"
                    />
                </div>

                <div className="mt-16 text-center">
                    <h2 className="text-2xl font-bold mb-4">Payment Methods</h2>
                    <div className="flex justify-center items-center gap-8 flex-wrap">
                        <div className="text-gray-700">
                            💳 Visa & Mastercard
                        </div>
                        <div className="text-gray-700">
                            📱 MTN Mobile Money
                        </div>
                        <div className="text-gray-700">
                            📱 Vodafone Cash
                        </div>
                        <div className="text-gray-700">
                            📱 AirtelTigo Money
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-4">
                        Powered by Paystack - Secure payment processing
                    </p>
                </div>

                <div className="mt-16 bg-white rounded-lg p-8 max-w-2xl mx-auto">
                    <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>

                    <div className="space-y-6">
                        <div>
                            <h3 className="font-semibold mb-2">Can I pay with Mobile Money?</h3>
                            <p className="text-gray-600">
                                Yes! We accept MTN Mobile Money, Vodafone Cash, and AirtelTigo Money
                                in addition to credit/debit cards.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2">Is there a free trial?</h3>
                            <p className="text-gray-600">
                                Yes! Start with our Free plan (no credit card required).
                                When you're ready, upgrade to Team plan and get 14 days free trial.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
                            <p className="text-gray-600">
                                Absolutely. Cancel your subscription anytime from your dashboard.
                                No questions asked.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
                            <p className="text-gray-600">
                                Yes. If you're not satisfied within the first 7 days,
                                we'll refund your payment in full.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2">What about international pricing?</h3>
                            <p className="text-gray-600">
                                We're currently focused on the Ghanaian market.
                                International pricing (USD/EUR) will be available soon.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
