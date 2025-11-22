import Link from 'next/link'
import { Check } from 'lucide-react'

export function Pricing() {
    return (
        <section className="bg-white py-16 md:py-24">
            <div className="max-w-4xl mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Simple pricing
                    </h2>
                    <p className="text-lg text-gray-600">
                        Start free. Upgrade when you need to.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">

                    {/* Free Plan */}
                    <div className="bg-white rounded-lg p-8 border border-gray-200">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                        <p className="text-gray-600 mb-6">For trying it out</p>

                        <div className="mb-6">
                            <span className="text-4xl font-bold text-gray-900">$0</span>
                            <span className="text-gray-600">/month</span>
                        </div>

                        <ul className="space-y-3 mb-8">
                            <li className="flex items-start gap-2">
                                <Check className="w-5 h-5 text-blue-500 mt-0.5" />
                                <span className="text-gray-600">Up to 50 prompts</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check className="w-5 h-5 text-blue-500 mt-0.5" />
                                <span className="text-gray-600">Up to 5 team members</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check className="w-5 h-5 text-blue-500 mt-0.5" />
                                <span className="text-gray-600">Basic version history</span>
                            </li>
                        </ul>

                        <Link href="/signup" className="block w-full bg-white hover:bg-gray-50 text-gray-700 font-medium px-6 py-3 rounded-md border border-gray-300 transition-colors text-center">
                            Get Started
                        </Link>
                    </div>

                    {/* Pro Plan */}
                    <div className="bg-blue-50 rounded-lg p-8 border-2 border-blue-500 relative">
                        {/* Popular Badge */}
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                            <span className="bg-blue-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                                Most Popular
                            </span>
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
                        <p className="text-gray-600 mb-6">For serious teams</p>

                        <div className="mb-6">
                            <span className="text-4xl font-bold text-gray-900">$29</span>
                            <span className="text-gray-600">/month</span>
                        </div>

                        <ul className="space-y-3 mb-8">
                            <li className="flex items-start gap-2">
                                <Check className="w-5 h-5 text-blue-500 mt-0.5" />
                                <span className="text-gray-600">Unlimited prompts</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check className="w-5 h-5 text-blue-500 mt-0.5" />
                                <span className="text-gray-600">Unlimited team members</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check className="w-5 h-5 text-blue-500 mt-0.5" />
                                <span className="text-gray-600">Full version history</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check className="w-5 h-5 text-blue-500 mt-0.5" />
                                <span className="text-gray-600">Advanced search & tags</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check className="w-5 h-5 text-blue-500 mt-0.5" />
                                <span className="text-gray-600">Priority support</span>
                            </li>
                        </ul>

                        <Link href="/signup" className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-md shadow-sm transition-colors text-center">
                            Start 14-Day Trial
                        </Link>
                    </div>

                </div>
            </div>
        </section>
    )
}
