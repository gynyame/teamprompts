import Link from 'next/link'

export function CTA() {
    return (
        <section className="bg-blue-500 py-16 md:py-24">
            <div className="max-w-3xl mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Stop losing your team's best work
                </h2>
                <p className="text-lg md:text-xl text-blue-100 mb-8">
                    Start saving prompts today. Free to try, easy to use.
                </p>
                <Link href="/signup" className="inline-block bg-white hover:bg-gray-100 text-blue-500 font-medium px-8 py-3 rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-500">
                    Get Started Free
                </Link>
            </div>
        </section>
    )
}
