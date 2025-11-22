import Link from 'next/link'

export function Hero() {
    return (
        <section className="bg-white border-b border-gray-200">
            <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
                {/* Main Heading */}
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                    Your team's best prompts,
                    <br />
                    finally in one place
                </h1>

                {/* Subheading */}
                <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl">
                    Someone on your team spent an hour perfecting that prompt.
                    Now nobody can find it. Stop reinventing the wheel.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/signup" className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-medium px-6 py-3 rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-center">
                        Get Started Free
                    </Link>
                    <Link href="#how-it-works" className="bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-700 font-medium px-6 py-3 rounded-md border border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-center">
                        See How It Works
                    </Link>
                </div>
            </div>
        </section>
    )
}
