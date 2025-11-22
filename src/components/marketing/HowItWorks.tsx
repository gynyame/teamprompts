export function HowItWorks() {
    return (
        <section id="how-it-works" className="bg-white py-16 md:py-24">
            <div className="max-w-4xl mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Dead simple to use
                    </h2>
                    <p className="text-lg text-gray-600">
                        No training required. If you can save a bookmark, you can use this.
                    </p>
                </div>

                {/* Steps */}
                <div className="space-y-12">

                    {/* Step 1 */}
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-blue-500 text-white rounded-lg flex items-center justify-center text-xl font-bold">
                                1
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Save your prompt
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                Copy your prompt, paste it into TeamPrompts, give it a name. Takes 30 seconds.
                            </p>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-blue-500 text-white rounded-lg flex items-center justify-center text-xl font-bold">
                                2
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Invite your team
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                Send them a link. They're in. No onboarding calls, no demos, no setup.
                            </p>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-blue-500 text-white rounded-lg flex items-center justify-center text-xl font-bold">
                                3
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Stop reinventing wheels
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                When someone needs a prompt, they search for it. It's right there. No asking around, no digging through Slack.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
