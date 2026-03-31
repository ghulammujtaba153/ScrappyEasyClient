import React from "react";

const TermsCondition = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow">
        <h1 className="text-3xl font-bold mb-4">Terms & Conditions</h1>
        <p className="text-sm text-gray-500 mb-6">Last updated: March 31, 2026</p>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
          <p>
            Welcome to Lead Buddy ("we," "our," or "us"). By using our service, you agree to these Terms & Conditions. Lead Buddy helps users organize and manage publicly available business contact information.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">2. Use of Service</h2>
          <p>
            You agree to use the service only for lawful purposes. The platform is intended for organizing publicly available business data for productivity and research.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">3. User Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account and password and for all activities under your account.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">4. Data Ownership</h2>
          <p>
            You retain full ownership of the data you collect using Lead Buddy. We do not claim ownership over your lead lists.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">5. Acceptable Use</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>You will not misuse the service for unlawful scraping or privacy violations.</li>
            <li>You will not attempt to disrupt or interfere with the platform.</li>
            <li>You must comply with all applicable laws.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">6. Service Availability</h2>
          <p>
            We do not guarantee uninterrupted service and may modify or discontinue features at any time.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">7. Limitation of Liability</h2>
          <p>
            The service is provided "as is" without warranties. We are not liable for damages resulting from use of the service.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">8. Changes to Terms</h2>
          <p>
            We may update these terms at any time. Continued use of the service means you accept the updated terms.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">9. Contact Us</h2>
          <p>If you have any questions, contact us at:</p>
          <p className="mt-2 font-medium">support@mapharvest.com</p>
        </section>

        <footer className="mt-10 pt-4 border-t text-sm text-gray-500">
          © 2026 Lead Buddy. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default TermsCondition;
