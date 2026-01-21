import React from 'react';

const PrivacyPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
                    <p className="text-gray-500">Last updated: January 21, 2026</p>
                </div>

                <div className="prose prose-green max-w-none space-y-8 text-gray-700">
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
                        <p className="mb-4">
                            Welcome to <strong>Map Harvest</strong> ("we," "our," or "us"). We are committed to protecting your privacy and ensuring you understand how we handle data.
                            This Privacy Policy explains how we collect, use, and safeguard your information when you use our Google Maps scraping extension and dashboard application (the "Service").
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
                        <h3 className="text-xl font-medium text-gray-800 mb-2">2.1 Account Information</h3>
                        <p className="mb-4">
                            When you register for Map Harvest, we collect personal information such as your name, email address, and password to create and manage your account.
                        </p>

                        <h3 className="text-xl font-medium text-gray-800 mb-2">2.2 Scraped Data</h3>
                        <p className="mb-4">
                            Our Service allows you to extract data from Google Maps. This data is <strong>publicly available information</strong> provided by businesses and entities on Google Maps.
                            The data we process on your behalf may include:
                        </p>
                        <ul className="list-disc pl-5 mb-4 space-y-1">
                            <li>Business Names</li>
                            <li>Addresses</li>
                            <li>Phone Numbers</li>
                            <li>Websites</li>
                            <li>Ratings and Reviews</li>
                        </ul>
                        <p className="mb-4">
                            We do not scrape private personal data. You retain ownership of the data you extract using our tools.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
                        <p className="mb-4">We use the collected information for the following purposes:</p>
                        <ul className="list-disc pl-5 mb-4 space-y-1">
                            <li>To provide and maintain the Service.</li>
                            <li>To manage your account and authentication (including session cookies).</li>
                            <li>To improve our tools and develop new features.</li>
                            <li>To communicate with you regarding updates, security alerts, and support.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Storage and Security</h2>
                        <p className="mb-4">
                            We implement appropriate technical and organizational measures to protect your data against unauthorized access, alteration, disclosure, or destruction.
                            However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Cookies</h2>
                        <p className="mb-4">
                            We use cookies to maintain your session and improve your experience. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent,
                            but some portions of our Service may not function properly without them.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Changes to This Policy</h2>
                        <p className="mb-4">
                            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Contact Us</h2>
                        <p className="mb-4">
                            If you have any questions about this Privacy Policy, please contact us at:
                        </p>
                        <p className="font-medium text-green-700">support@mapharvest.com</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPage;
