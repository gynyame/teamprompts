import Link from 'next/link'

export function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-400 py-12">
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-8">

                    {/* Company */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">TeamPrompts</h3>
                        <p className="text-sm leading-relaxed">
                            Stop losing your team's best AI prompts.
                        </p>
                    </div>

                    {/* Product */}
                    <div>
                        <h4 className="text-white font-medium mb-4">Product</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                            <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Changelog</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-white font-medium mb-4">Company</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-white font-medium mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                            <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
                        </ul>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
                    <p>© 2024 TeamPrompts. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
