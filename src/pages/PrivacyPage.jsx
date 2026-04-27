import React from 'react';
import Navbar from '../components/landing/Navbar';
import FooterSection from '../components/landing/FooterSection';

const PrivacyPage = () => {
    return (
        <div className="bg-white">
            <Navbar />
            <div className="pt-32 pb-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">Privacy Policy</h1>
                        <p className="text-gray-400 font-medium">Last updated: April 17, 2026</p>
                    </div>

                    <div className="space-y-10 text-gray-600 leading-relaxed text-sm md:text-base">
                        <section className="space-y-4">
                            <h2 className="text-xl font-black text-gray-900">1. Who We Are</h2>
                            <p>
                                Map Harvest is a product of <strong>Sleek AI SMC Pvt Ltd</strong>, a company registered in Pakistan.
                                In this policy, &ldquo;we,&rdquo; &ldquo;our,&rdquo; and &ldquo;us&rdquo; refer to Sleek AI SMC Pvt Ltd. &ldquo;Platform&rdquo; refers to the Map Harvest
                                web application, browser extension, APIs, and all associated services.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-black text-gray-900">2. Information We Collect</h2>

                            <h3 className="text-base font-bold text-gray-800">2.1 Account Information</h3>
                            <p>
                                When you register, we collect your name, email address, phone number, country, and a password.
                                This information is used solely to create and secure your account.
                            </p>

                            <h3 className="text-base font-bold text-gray-800">2.2 Payment Information</h3>
                            <p>
                                We collect payment confirmation screenshots and related transaction details submitted by you during
                                the manual payment process. We do not store credit card numbers or bank account credentials.
                            </p>

                            <h3 className="text-base font-bold text-gray-800">2.3 Business Data You Collect</h3>
                            <p>
                                The Platform enables you to extract, organise, and manage <strong>publicly available</strong> business
                                information from map listings and websites. This may include business names, addresses, phone numbers,
                                websites, ratings, and review counts. This data is collected only upon your explicit action and is stored
                                in your personal account.
                            </p>

                            <h3 className="text-base font-bold text-gray-800">2.4 Communication &amp; Outreach Data</h3>
                            <p>
                                If you use our WhatsApp verification, bulk messaging, email extraction, or cold calling features,
                                we process the data you provide (phone numbers, email addresses, message content) to facilitate
                                those actions. We do not use this data for our own marketing purposes.
                            </p>

                            <h3 className="text-base font-bold text-gray-800">2.5 Usage &amp; Technical Data</h3>
                            <p>
                                We automatically collect device type, browser type, IP address, pages visited, and feature usage
                                patterns to improve performance and security.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-black text-gray-900">3. How We Use Your Information</h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>To provide, maintain, and improve the Platform and its features.</li>
                                <li>To create, authenticate, and manage your account.</li>
                                <li>To verify payments and activate subscriptions.</li>
                                <li>To sync your data between the browser extension and the web dashboard.</li>
                                <li>To facilitate WhatsApp messaging, cold calling, email extraction, and lead qualification.</li>
                                <li>To enable team management and collaboration features.</li>
                                <li>To provide customer support and respond to enquiries.</li>
                                <li>To detect, prevent, and address fraud, abuse, and security issues.</li>
                                <li>To comply with legal obligations.</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-black text-gray-900">4. Data Ownership</h2>
                            <p>
                                You retain full ownership of all lead data, lists, and content you create or collect using the Platform.
                                We do not claim any intellectual property rights over your data. We do not sell, rent, or share your
                                personal data or collected leads with third parties for marketing purposes.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-black text-gray-900">5. Data Storage &amp; Security</h2>
                            <p>
                                Your data is stored on secure, encrypted cloud servers. We implement industry-standard security
                                measures including encryption in transit (TLS) and at rest, access controls, and regular security
                                audits. While we take every reasonable precaution, no method of electronic storage or transmission
                                is 100% secure, and we cannot guarantee absolute security.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-black text-gray-900">6. Browser Extension Permissions</h2>
                            <p>
                                The Map Harvest browser extension requires permissions such as <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">activeTab</code> and <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">scripting</code> to
                                read publicly visible content on map listing pages and websites you visit. These permissions are used
                                exclusively to extract business data at your request. The extension does not monitor your browsing
                                activity, collect personal data from other sites, or operate in the background without your action.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-black text-gray-900">7. Third-Party Services</h2>
                            <p>
                                We may use third-party services for hosting, analytics, and communication. These providers only
                                receive the minimum data necessary to perform their function and are bound by their own privacy
                                policies. We do not share your collected lead data with any third party.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-black text-gray-900">8. Data Retention</h2>
                            <p>
                                We retain your account data for as long as your account is active. If you delete your account,
                                we will delete your personal data and lead lists within 30 days, except where retention is required
                                by law or for legitimate business purposes (e.g., payment records).
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-black text-gray-900">9. Your Rights</h2>
                            <p>You have the right to:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Access, update, or correct your personal information.</li>
                                <li>Export your lead data at any time.</li>
                                <li>Request deletion of your account and associated data.</li>
                                <li>Withdraw consent for non-essential data processing.</li>
                            </ul>
                            <p>To exercise any of these rights, contact us at the address below.</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-black text-gray-900">10. Changes to This Policy</h2>
                            <p>
                                We may update this Privacy Policy to reflect changes in our practices or legal requirements.
                                Material changes will be communicated via email or a notice on the Platform. Continued use of the
                                Platform after changes constitutes acceptance of the updated policy.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-black text-gray-900">11. Contact Us</h2>
                            <p>If you have questions about this Privacy Policy or our data practices:</p>
                            <div className="bg-gray-50 rounded-xl p-6 space-y-1">
                                <p className="font-bold text-gray-900">Sleek AI SMC Pvt Ltd</p>
                                <p>Email: <a href="mailto:grow@mapharvest.com" className="text-primary font-bold hover:underline">grow@mapharvest.com</a></p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
            <FooterSection />
        </div>
    );
};

export default PrivacyPage;
