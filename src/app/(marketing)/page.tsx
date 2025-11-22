import { Hero } from '@/components/marketing/Hero'
import { Features } from '@/components/marketing/Features'
import { HowItWorks } from '@/components/marketing/HowItWorks'
import { SocialProof } from '@/components/marketing/SocialProof'
import { Pricing } from '@/components/marketing/Pricing'
import { CTA } from '@/components/marketing/CTA'
import { Footer } from '@/components/marketing/Footer'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function LandingPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
        redirect('/dashboard')
    }

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <span className="font-bold text-xl text-gray-900">TeamPrompts</span>
                    <nav className="flex gap-4 sm:gap-6 items-center">
                        <Link className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors" href="#how-it-works">How it Works</Link>
                        <Link className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors" href="#pricing">Pricing</Link>
                        <Link className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors" href="/login">Log In</Link>
                        <Link href="/signup" className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors">
                            Get Started
                        </Link>
                    </nav>
                </div>
            </header>
            <main className="flex-1">
                <Hero />
                <Features />
                <HowItWorks />
                <SocialProof />
                <Pricing />
                <CTA />
            </main>
            <Footer />
        </div>
    )
}
