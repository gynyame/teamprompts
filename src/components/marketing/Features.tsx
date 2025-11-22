export function Features() {
    return (
        <section className="bg-gray-50 py-16 md:py-24">
            <div className="max-w-6xl mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Stop searching Slack. Stop asking around.
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Everything your team needs to share and reuse prompts that actually work.
                    </p>
                </div>

                {/* Feature Grid */}
                <div className="grid md:grid-cols-3 gap-8">

                    {/* Feature 1: Store */}
                    <div className="bg-white rounded-lg p-6 border border-gray-200 hover:border-gray-300 transition-colors">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                            Save the good ones
                        </h3>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                            You finally got Claude to write exactly what you needed. Someone tweaked a prompt for hours until it worked perfectly.
                        </p>
                        <p className="text-gray-900 font-medium">
                            Save it to your team workspace. One click, it's there forever.
                        </p>
                    </div>

                    {/* Feature 2: Version */}
                    <div className="bg-white rounded-lg p-6 border border-gray-200 hover:border-gray-300 transition-colors">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                            See what changed
                        </h3>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                            Sarah improved the prompt. Then Mike tweaked it. Now nobody knows which version actually works.
                        </p>
                        <p className="text-gray-900 font-medium">
                            Every change is tracked. Go back to any version. Know what works.
                        </p>
                    </div>

                    {/* Feature 3: Share */}
                    <div className="bg-white rounded-lg p-6 border border-gray-200 hover:border-gray-300 transition-colors">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                            One link, everyone's synced
                        </h3>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                            "Hey, where's that prompt for writing product descriptions?" happens five times a week in your Slack.
                        </p>
                        <p className="text-gray-900 font-medium">
                            Share a link. They get the latest version. No more copy-paste into DMs.
                        </p>
                    </div>

                    {/* Feature 4: Discover */}
                    <div className="bg-white rounded-lg p-6 border border-gray-200 hover:border-gray-300 transition-colors">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                            Find what you need
                        </h3>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                            Your team has great prompts. Nobody knows they exist because they're buried in chat history.
                        </p>
                        <p className="text-gray-900 font-medium">
                            Search by name, tag, or what it does. Find the prompt you need in seconds.
                        </p>
                    </div>

                    {/* Feature 5: Organize */}
                    <div className="bg-white rounded-lg p-6 border border-gray-200 hover:border-gray-300 transition-colors">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                            Keep it organized
                        </h3>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                            Marketing prompts mixed with engineering prompts mixed with customer support prompts. It's chaos.
                        </p>
                        <p className="text-gray-900 font-medium">
                            Create folders. Add tags. Your way of organizing, not ours.
                        </p>
                    </div>

                    {/* Feature 6: Collaborate */}
                    <div className="bg-white rounded-lg p-6 border border-gray-200 hover:border-gray-300 transition-colors">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                            Build on each other's work
                        </h3>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                            Someone else already solved this. You just don't know it yet.
                        </p>
                        <p className="text-gray-900 font-medium">
                            See what works for others. Remix it. Make it better. Everyone wins.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    )
}
