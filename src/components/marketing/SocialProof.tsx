export function SocialProof() {
    return (
        <section className="bg-gray-50 py-16 md:py-24">
            <div className="max-w-4xl mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Teams using TeamPrompts
                    </h2>
                    <p className="text-lg text-gray-600">
                        From startups to agencies, teams are done losing prompts.
                    </p>
                </div>

                {/* Testimonial Cards */}
                <div className="grid md:grid-cols-2 gap-8">

                    {/* Testimonial 1 */}
                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                        <p className="text-gray-600 mb-4 leading-relaxed">
                            "We were copy-pasting prompts in Slack DMs. Someone would improve one and nobody else knew. Now everyone uses the latest version."
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                            <div>
                                <p className="font-medium text-gray-900">Sarah Chen</p>
                                <p className="text-sm text-gray-600">Marketing Lead @ TechCo</p>
                            </div>
                        </div>
                    </div>

                    {/* Testimonial 2 */}
                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                        <p className="text-gray-600 mb-4 leading-relaxed">
                            "My team spent hours redoing prompts that someone else already perfected. This solved that instantly."
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                            <div>
                                <p className="font-medium text-gray-900">Mike Rodriguez</p>
                                <p className="text-sm text-gray-600">Product Manager @ StartupXYZ</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
