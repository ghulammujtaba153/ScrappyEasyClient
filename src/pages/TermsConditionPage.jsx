import React from "react";
import Navbar from "../components/landing/Navbar";
import FooterSection from "../components/landing/FooterSection";

const TermsCondition = () => {
    return (
        <div className="bg-white">
            <Navbar />
            <div className="pt-32 pb-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">Terms &amp; Conditions</h1>
                        <p className="text-gray-400 font-medium">Last updated: April 17, 2026</p>
                    </div>

                    <div className="space-y-10 text-gray-600 leading-relaxed text-sm md:text-base">
                        <section className="space-y-4">
                            <h2 className="text-xl font-black text-gray-900">1. Agreement</h2>
                            <p>
                                These Terms &amp; Conditions (&ldquo;Terms&rdquo;) govern your use of Map Harvest, a product of <strong>Sleek AI SMC Pvt Ltd</strong>, a company registered in Pakistan. By creating an account or using the Platform, you agree to be bound by these Terms. If you do not agree, do not use the Platform.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-black text-gray-900">2. Definitions</h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>&ldquo;Platform&rdquo;</strong> means the Map Harvest web application, browser extension, APIs, and all associated services.</li>
                                <li><strong>&ldquo;User,&rdquo; &ldquo;you,&rdquo; &ldquo;your&rdquo;</strong> means any individual or entity that creates an account or uses the Platform.</li>
                                <li><strong>&ldquo;We,&rdquo; &ldquo;us,&rdquo; &ldquo;our&rdquo;</strong> means Sleek AI SMC Pvt Ltd.</li>
                                <li><strong>&ldquo;Publicly Available Data&rdquo;</strong> means business information visible on public web pages, map listings, and directories.</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-black text-gray-900">3. Platform Features</h2>
                            <p>Map Harvest provides the following capabilities:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Extraction and organisation of publicly available business data from map listings and websites.</li>
                                <li>WhatsApp number verification and bulk message sending.</li>
                                <li>Email address extraction from business listings.</li>
                                <li>Built-in cold calling dialer.</li>
                                <li>Lead qualification and scoring tools.</li>
                                <li>Website screenshot viewing and qualification swiping.</li>
                                <li>Team management, collaboration, and performance tracking.</li>
                                <li>Smart suburb suggestions for lead pool expansion.</li>
                                <li>CSV import/export and CRM dashboard.</li>
                            </ul>
                            <p>
                                These tools are provided for legitimate business development, sales outreach, and market research purposes only.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-black text-gray-900">4. User Accounts</h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>You must provide accurate information when creating your account.</li>
                                <li>You are responsible for maintaining the security of your credentials and for all activity under your account.</li>
                                <li>You must notify us immediately if you suspect unauthorized access.</li>
                                <li>We reserve the right to suspend or terminate accounts that violate these Terms.</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-black text-gray-900">5. Acceptable Use</h2>
                            <p>You agree to use the Platform only for lawful purposes. You must NOT:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Use the Platform to collect or process private personal data not publicly available.</li>
                                <li>Send spam, unsolicited bulk messages, or harassing communications through our messaging tools.</li>
                                <li>Use extracted data to violate any applicable privacy, data protection, or anti-spam laws.</li>
                                <li>Attempt to reverse-engineer, decompile, or exploit the Platform&rsquo;s source code or infrastructure.</li>
                                <li>Use automated scripts or bots to access the Platform beyond the intended interface.</li>
                                <li>Resell, redistribute, or sublicense access to the Platform without written permission.</li>
                                <li>Impersonate another person or entity while using the Platform.</li>
                                <li>Interfere with, disrupt, or overload the Platform or its servers.</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-black text-gray-900">6. Payments &amp; Subscriptions</h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Payments are processed manually via JazzCash, Easypaisa, or other methods we specify.</li>
                                <li>Access is granted after we manually verify your payment and uploaded screenshot.</li>
                                <li>All prices are final and may be updated at our discretion. Existing paid plans are honoured at their original price.</li>
                                <li>Refund requests must be made within 7 days of account activation. Refunds are processed at our discretion.</li>
                                <li>We reserve the right to revoke access if a payment is found to be fraudulent or reversed.</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-black text-gray-900">7. Data &amp; Intellectual Property</h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>You own all lead data and lists you create using the Platform.</li>
                                <li>The Platform itself &mdash; including its design, code, branding, algorithms, and documentation &mdash; is the intellectual property of Sleek AI SMC Pvt Ltd.</li>
                                <li>You may not copy, modify, or create derivative works based on the Platform.</li>
                                <li>We may use anonymised, aggregated usage data to improve the Platform.</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-black text-gray-900">8. Disclaimer of Warranties</h2>
                            <p>
                                The Platform is provided <strong>&ldquo;as is&rdquo;</strong> and <strong>&ldquo;as available&rdquo;</strong> without warranties of any kind, express or implied. We do not guarantee that:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>The Platform will be uninterrupted, error-free, or available at all times.</li>
                                <li>Data extracted will be accurate, complete, or current.</li>
                                <li>The Platform will produce any specific business results.</li>
                            </ul>
                            <p>
                                You use the Platform at your own risk. We are not responsible for business decisions you make based on data collected through the Platform.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-black text-gray-900">9. Limitation of Liability</h2>
                            <p>
                                To the maximum extent permitted by law, Sleek AI SMC Pvt Ltd and its directors, employees, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Platform, including but not limited to loss of profits, data, or business opportunities &mdash; even if we have been advised of the possibility of such damages.
                            </p>
                            <p>
                                Our total liability for any claim related to the Platform shall not exceed the amount you paid us in the 12 months preceding the claim.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-black text-gray-900">10. Indemnification</h2>
                            <p>
                                You agree to indemnify and hold harmless Sleek AI SMC Pvt Ltd from any claims, damages, losses, or expenses (including legal fees) arising from your use of the Platform, violation of these Terms, or infringement of any third-party rights.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-black text-gray-900">11. Service Modifications</h2>
                            <p>
                                We reserve the right to modify, suspend, or discontinue any feature of the Platform at any time, with or without notice. We are not liable for any modification, suspension, or discontinuation of the service.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-black text-gray-900">12. Termination</h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>We may suspend or terminate your account at any time if you violate these Terms or engage in abusive behaviour.</li>
                                <li>Upon termination, your right to access the Platform ceases immediately.</li>
                                <li>We may retain data as required by law or for legitimate business purposes.</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-black text-gray-900">13. Governing Law</h2>
                            <p>
                                These Terms are governed by and construed in accordance with the laws of Pakistan. Any disputes shall be subject to the exclusive jurisdiction of the courts in Pakistan.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-black text-gray-900">14. Changes to These Terms</h2>
                            <p>
                                We may update these Terms at any time. Material changes will be communicated via email or a notice on the Platform. Continued use of the Platform after changes constitutes acceptance.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-black text-gray-900">15. Contact Us</h2>
                            <p>If you have questions about these Terms:</p>
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

export default TermsCondition;
