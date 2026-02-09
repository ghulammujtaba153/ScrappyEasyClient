import React from 'react';

const PrivacyPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
                    <p className="text-gray-500">Last updated: February 9, 2026</p>
                </div>

                <div className="prose prose-green max-w-none space-y-8 text-gray-700">
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
                        <p className="mb-4">
                            Welcome to <strong>Lead Buddy</strong> ("we," "our," or "us"). We are committed to protecting your privacy and ensuring you understand how we handle data.
                            Lead Buddy is a productivity tool designed to help users organize, save, and manage business contact information into a structured personal dashboard (the "Service").
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
                        <h3 className="text-xl font-medium text-gray-800 mb-2">2.1 Account Information</h3>
                        <p className="mb-4">
                            When you register for Lead Buddy, we collect personal information such as your name, email address, and password to provide secure access to your saved lead database.
                        </p>

                        <h3 className="text-xl font-medium text-gray-800 mb-2">2.2 Organized Lead Data</h3>
                        <p className="mb-4">
                            Our Service allows you to capture and organize business details from public map listings for market research purposes. 
                            The data processed is <strong>publicly available information</strong> and is only collected upon a direct action by the user (e.g., clicking "Save" or "Analyze Page").
                            This information may include:
                        </p>
                        <ul className="list-disc pl-5 mb-4 space-y-1">
                            <li>Business Names</li>
                            <li>Professional Addresses</li>
                            <li>Business Phone Numbers</li>
                            <li>Official Websites</li>
                            <li>Public Ratings and Review counts</li>
                        </ul>
                        <p className="mb-4">
                            We do not collect private personal data or non-public information. You retain full ownership and control over the lead lists you generate using our tools.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
                        <p className="mb-4">We use the collected information for the following purposes:</p>
                        <ul className="list-disc pl-5 mb-4 space-y-1">
                            <li>To provide and maintain the Lead Buddy organization tools.</li>
                            <li>To manage your secure account and authentication.</li>
                            <li>To facilitate the syncing of your organized leads between the extension and the web dashboard.</li>
                            <li>To improve the accuracy of our lead-organization algorithms.</li>
                            <li>To provide technical support and security alerts.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Storage and Security</h2>
                        <p className="mb-4">
                            We implement industry-standard technical measures to protect your lead lists against unauthorized access.
                            Data is stored securely on our cloud servers to ensure you can access your research from any device.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Browser Permissions</h2>
                        <p className="mb-4">
                            The Lead Buddy browser extension requires specific permissions (such as `scripting` and `activeTab`) to function. 
                            These permissions are used solely to parse the text of the public map page you are currently viewing so that it can be formatted into your personal CRM list.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Changes to This Policy</h2>
                        <p className="mb-4">
                            We may update our Privacy Policy to reflect changes in our service or regulatory requirements. We will notify users of any significant changes by updating the "Last updated" date.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Contact Us</h2>
                        <p className="mb-4">
                            If you have any questions about Lead Buddy’s privacy practices, please contact our support team at:
                        </p>
                        <p className="font-medium text-green-700">support@mapharvest.com</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPage;