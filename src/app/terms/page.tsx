export default function TermsPage() {
    return (
        <div className="container mx-auto py-12 px-4 max-w-3xl">
            <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
            <p className="mb-4 text-gray-500">Last Updated: {new Date().toLocaleDateString()}</p>

            <div className="prose dark:prose-invert">
                <p>Welcome to TeamPrompts ("we", "our", or "us"). By accessing or using teamprompts.io (the "Service"), you agree to these Terms of Service.</p>

                <h2 className="text-xl font-bold mt-8 mb-4">1. Service Description</h2>
                <p>TeamPrompts provides a collaborative platform for managing AI prompts. We allow teams to store, organize, and share prompts for use with AI models.</p>

                <h2 className="text-xl font-bold mt-8 mb-4">2. User Accounts</h2>
                <p>You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.</p>

                <h2 className="text-xl font-bold mt-8 mb-4">Contact</h2>
                <p>For questions about these Terms, contact us at:</p>
                <ul>
                    <li>Email: legal@teamprompts.io</li>
                    <li>Website: https://teamprompts.io/contact</li>
                </ul>
            </div>
        </div>
    )
}
