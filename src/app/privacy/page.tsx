export default function PrivacyPage() {
    return (
        <div className="container mx-auto py-12 px-4 max-w-3xl">
            <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
            <p className="mb-4 text-gray-500">Last Updated: {new Date().toLocaleDateString()}</p>

            <div className="prose dark:prose-invert">
                <p>TeamPrompts ("we", "our", or "us") operates teamprompts.io. This page informs you of our policies regarding the collection, use, and disclosure of personal data.</p>

                <h2 className="text-xl font-bold mt-8 mb-4">Information Collection</h2>
                <p>We collect information that you provide directly to us, such as when you create an account, update your profile, or use our interactive features.</p>

                <h2 className="text-xl font-bold mt-8 mb-4">Use of Data</h2>
                <p>We use the data to provide and improve our Service, including to monitor the usage of our Service and to detect, prevent and address technical issues.</p>

                <h2 className="text-xl font-bold mt-8 mb-4">Contact Us</h2>
                <p>If you have questions about this Privacy Policy, contact us:</p>
                <ul>
                    <li>Email: privacy@teamprompts.io</li>
                    <li>Website: https://teamprompts.io/contact</li>
                </ul>
            </div>
        </div>
    )
}
