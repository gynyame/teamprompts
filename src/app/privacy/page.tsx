export default function PrivacyPage() {
    return (
        <div className="container mx-auto py-12 px-4 max-w-3xl">
            <h1 className="text-3xl font-bold mb-6">Privacy Policy for TeamPrompts</h1>
            <p className="mb-4 text-gray-500">Last Updated: November 23, 2025</p>

            <div className="prose dark:prose-invert max-w-none">
                <h2 className="text-xl font-bold mt-8 mb-4">Introduction</h2>
                <p>TeamPrompts ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Chrome extension and web service.</p>

                <h2 className="text-xl font-bold mt-8 mb-4">Information We Collect</h2>

                <h3 className="text-lg font-semibold mt-6 mb-2">Information You Provide</h3>
                <ul className="list-disc pl-6 mb-4">
                    <li><strong>Account Information:</strong> Email address, name, and password (encrypted)</li>
                    <li><strong>Workspace Data:</strong> Team/workspace names and member information</li>
                    <li><strong>Prompt Templates:</strong> The AI prompt templates and collections you create, edit, and organize</li>
                    <li><strong>Usage Preferences:</strong> Settings and preferences for how you use TeamPrompts</li>
                </ul>

                <h3 className="text-lg font-semibold mt-6 mb-2">Automatically Collected Information</h3>
                <ul className="list-disc pl-6 mb-4">
                    <li><strong>Usage Data:</strong> Features used, frequency of use, and interaction patterns within the extension</li>
                    <li><strong>Device Information:</strong> Browser type, version, and basic device information</li>
                    <li><strong>Log Data:</strong> Error logs and diagnostic information to improve service performance</li>
                </ul>

                <h2 className="text-xl font-bold mt-8 mb-4">How We Use Your Information</h2>
                <p>We use collected information for the following purposes:</p>
                <ul className="list-disc pl-6 mb-4">
                    <li><strong>Service Delivery:</strong> To provide, maintain, and improve TeamPrompts functionality</li>
                    <li><strong>Synchronization:</strong> To sync your prompt templates across devices and team members</li>
                    <li><strong>Collaboration:</strong> To enable sharing and collaboration features within workspaces</li>
                    <li><strong>Account Management:</strong> To manage your account, subscriptions, and billing</li>
                    <li><strong>Communication:</strong> To send service-related announcements and respond to inquiries</li>
                    <li><strong>Security:</strong> To detect, prevent, and address technical issues and security threats</li>
                    <li><strong>Analytics:</strong> To understand usage patterns and improve user experience</li>
                </ul>

                <h2 className="text-xl font-bold mt-8 mb-4">Data Sharing and Disclosure</h2>
                <p>We do <strong>not</strong> sell your personal information. We may share your information only in the following circumstances:</p>
                <ul className="list-disc pl-6 mb-4">
                    <li><strong>With Team Members:</strong> Prompt templates and workspace data are shared with team members you invite</li>
                    <li><strong>Service Providers:</strong> Trusted third-party services that help us operate (payment processing, hosting, analytics) under strict confidentiality agreements</li>
                    <li><strong>Legal Requirements:</strong> When required by law, court order, or to protect our rights and safety</li>
                    <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets (users will be notified)</li>
                </ul>

                <h2 className="text-xl font-bold mt-8 mb-4">Data Storage and Security</h2>
                <ul className="list-disc pl-6 mb-4">
                    <li><strong>Encryption:</strong> Data is encrypted in transit (HTTPS/TLS) and at rest</li>
                    <li><strong>Secure Infrastructure:</strong> We use industry-standard security measures to protect your data</li>
                    <li><strong>Access Controls:</strong> Limited employee access to user data, only when necessary for support or maintenance</li>
                    <li><strong>Data Location:</strong> Data is stored on secure servers provided by reputable cloud service providers</li>
                </ul>

                <h2 className="text-xl font-bold mt-8 mb-4">Chrome Extension Permissions</h2>
                <p>Our Chrome extension requires the following permissions:</p>
                <ul className="list-disc pl-6 mb-4">
                    <li><strong>Storage:</strong> To save your prompt templates, preferences, and sync data locally</li>
                    <li><strong>Active Tab:</strong> To detect supported AI platforms and enable prompt insertion</li>
                    <li><strong>Host Permissions:</strong> To interact with AI chat interfaces (ChatGPT, Claude, etc.) when you choose to insert prompts</li>
                </ul>
                <p>We only access data necessary for core functionality and never access unrelated browsing data.</p>

                <h2 className="text-xl font-bold mt-8 mb-4">Your Rights and Choices</h2>
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 mb-4">
                    <li><strong>Access:</strong> Request a copy of your personal data</li>
                    <li><strong>Correction:</strong> Update or correct your information through account settings</li>
                    <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
                    <li><strong>Export:</strong> Download your prompt templates and workspace data</li>
                    <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications (service emails may still be sent)</li>
                    <li><strong>Data Portability:</strong> Request your data in a machine-readable format</li>
                </ul>
                <p>To exercise these rights, contact us at <a href="mailto:privacy@teamprompts.io" className="text-blue-600 hover:underline">privacy@teamprompts.io</a></p>

                <h2 className="text-xl font-bold mt-8 mb-4">Data Retention</h2>
                <ul className="list-disc pl-6 mb-4">
                    <li><strong>Active Accounts:</strong> We retain your data while your account is active</li>
                    <li><strong>Deleted Accounts:</strong> Data is deleted within 30 days of account deletion request</li>
                    <li><strong>Legal Obligations:</strong> Some data may be retained longer if required by law</li>
                    <li><strong>Backups:</strong> Deleted data may persist in backups for up to 90 days before permanent deletion</li>
                </ul>

                <h2 className="text-xl font-bold mt-8 mb-4">Children's Privacy</h2>
                <p>TeamPrompts is not intended for users under 13 years of age. We do not knowingly collect information from children under 13. If we learn we have collected such information, we will delete it promptly.</p>

                <h2 className="text-xl font-bold mt-8 mb-4">International Data Transfers</h2>
                <p>If you access TeamPrompts from outside Ghana, your information may be transferred to and processed in countries where our servers are located. We ensure appropriate safeguards are in place for such transfers.</p>

                <h2 className="text-xl font-bold mt-8 mb-4">Cookies and Tracking</h2>
                <p>We use cookies and similar technologies for:</p>
                <ul className="list-disc pl-6 mb-4">
                    <li><strong>Authentication:</strong> To keep you logged in</li>
                    <li><strong>Preferences:</strong> To remember your settings</li>
                    <li><strong>Analytics:</strong> To understand how users interact with our service (you can opt-out)</li>
                </ul>
                <p>You can control cookies through your browser settings.</p>

                <h2 className="text-xl font-bold mt-8 mb-4">Third-Party Services</h2>
                <p>TeamPrompts may integrate with third-party AI platforms (ChatGPT, Claude, etc.). This Privacy Policy does not cover those services. We encourage you to review their privacy policies.</p>

                <h2 className="text-xl font-bold mt-8 mb-4">Changes to This Privacy Policy</h2>
                <p>We may update this Privacy Policy periodically. We will notify you of significant changes via:</p>
                <ul className="list-disc pl-6 mb-4">
                    <li>Email notification to your registered address</li>
                    <li>Prominent notice on our website</li>
                    <li>In-app notification</li>
                </ul>
                <p>Continued use after changes constitutes acceptance of the updated policy.</p>

                <h2 className="text-xl font-bold mt-8 mb-4">Payment Information</h2>
                <p>Payment processing is handled by Paystack. We do not store your complete payment card information. Please review Paystack's privacy policy for information on how they handle payment data.</p>

                <h2 className="text-xl font-bold mt-8 mb-4">Contact Us</h2>
                <p>If you have questions or concerns about this Privacy Policy or our data practices, please contact us:</p>
                <ul className="list-disc pl-6 mb-4">
                    <li><strong>Email:</strong> <a href="mailto:support@teamprompts.io" className="text-blue-600 hover:underline">support@teamprompts.io</a></li>
                    <li><strong>Website:</strong> <a href="https://teamprompts.io" className="text-blue-600 hover:underline">https://teamprompts.io</a></li>
                    <li><strong>Address:</strong> Abbeville ST NS-162-1874</li>
                </ul>

                <h2 className="text-xl font-bold mt-8 mb-4">Ghana Data Protection Compliance</h2>
                <p>We comply with the Data Protection Act, 2012 (Act 843) of Ghana and are committed to protecting the rights of Ghanaian users as outlined in the Act.</p>

                <hr className="my-8 border-gray-200" />
                <p className="text-sm text-gray-500">© 2025 TeamPrompts. All rights reserved.</p>
            </div>
        </div>
    )
}
