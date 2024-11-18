import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="bg-gray-50 py-10 px-5 lg:px-20">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-10">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center border-b-2 pb-4">
          Terms and Conditions
        </h1>
        <p className="text-gray-600 mb-4">
          <strong>Last Updated:</strong> 18/11/2024
        </p>

        {/* Introduction */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Introduction</h2>
          <p className="text-gray-600">
            This <strong>Get Paid on the Web User Agreement</strong> ("Agreement") is a legal contract between
            <strong> Blue Collar Industries</strong> ("we," "our," or "us") and the entity or individual ("you" or
            "your") who accesses or uses our platform and services. By using our platform, you agree to this Agreement,
            our <strong>Privacy Policy</strong>, and our <strong>Cookie Policy</strong>. If you do not agree, you must
            not use our services.
          </p>
        </section>

        {/* Definitions */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Definitions</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>
              <strong>“Services”:</strong> The tools, web components, and features provided through our platform,
              including invoicing, payment links, and subscriptions.
            </li>
            <li>
              <strong>“Affiliate Marketing”:</strong> Advertising third-party products or services on our platform
              through affiliate arrangements.
            </li>
            <li>
              <strong>“Subscription”:</strong> A recurring payment model managed through our platform for user-provided
              services or products.
            </li>
          </ul>
        </section>

        {/* Regional Compliance */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Regional Compliance</h2>
          <p className="text-gray-600">
            We operate in the <strong>United Kingdom, United States, Canada, Australia, and New Zealand</strong>. By
            using our platform in these regions, you agree to comply with the applicable laws and regulations outlined
            below:
          </p>
          <ul className="list-disc list-inside text-gray-600 mt-4 space-y-2">
            <li>
              <strong>United Kingdom:</strong> You must comply with the UK General Data Protection Regulation (UK GDPR)
              and the Data Protection Act 2018. Ensure compliance with HMRC regulations for VAT, income reporting, and
              financial activities.
            </li>
            <li>
              <strong>United States:</strong> You must comply with applicable federal and state laws, including the
              CAN-SPAM Act for electronic communications and relevant tax laws.
            </li>
            <li>
              <strong>Canada:</strong> You must adhere to the Personal Information Protection and Electronic Documents
              Act (PIPEDA) and comply with local tax obligations, such as GST/HST reporting and remittance.
            </li>
            <li>
              <strong>Australia:</strong> You must comply with the Privacy Act 1988 and Australian Taxation Office (ATO)
              requirements, including GST obligations.
            </li>
            <li>
              <strong>New Zealand:</strong> You must adhere to the New Zealand Privacy Act 2020 and comply with Inland
              Revenue Department (IRD) obligations for tax reporting and payment processing.
            </li>
          </ul>
        </section>

        {/* User Obligations */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">4. User Obligations</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Maintain accurate and up-to-date account information.</li>
            <li>
              Ensure that payment methods for subscriptions are valid and have sufficient funds for recurring payments.
            </li>
            <li>
              Comply with all applicable laws and regulations when using our platform and services.
            </li>
          </ul>
        </section>

        {/* Limitations of Liability */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Limitations of Liability</h2>
          <p className="text-gray-600">
            To the maximum extent permitted by law, we are not liable for any indirect, incidental, special,
            consequential, or punitive damages, including but not limited to loss of profits, data, or business
            opportunities, arising from your use of our platform. Our total liability is limited to the fees you have
            paid to us in the last three months.
          </p>
        </section>

        {/* Dispute Resolution */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Dispute Resolution</h2>
          <p className="text-gray-600">
            Any disputes arising under this Agreement will be resolved through binding arbitration in accordance with
            the rules of the International Chamber of Commerce (ICC). The arbitration will be conducted in English in
            your jurisdiction or another mutually agreed location.
          </p>
        </section>

        {/* Privacy Policy */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Privacy Policy</h2>
          <p className="text-gray-600">
            We retain personal data for as long as necessary to provide our services and comply with legal obligations.
            Data retention periods vary based on the nature of the information, but payment records are retained for a
            minimum of seven years.
          </p>
        </section>

        {/* Cookie Policy */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Cookie Policy</h2>
          <p className="text-gray-600">
            We use cookies to improve your experience on our platform. By using our site, you consent to the use of
            cookies in accordance with this policy:
          </p>
          <ul className="list-disc list-inside text-gray-600 mt-4 space-y-2">
            <li>
              <strong>Essential Cookies:</strong> Necessary for the basic functionality of our site, such as account
              login and navigation.
            </li>
            <li>
              <strong>Analytics Cookies:</strong> Help us understand how users interact with our site, allowing us to
              improve its performance.
            </li>
            <li>
              <strong>Advertising Cookies:</strong> Used for affiliate tracking and personalized advertisements.
            </li>
            <li>
              <strong>Managing Cookies:</strong> You can manage or disable cookies through your browser settings. Note
              that disabling cookies may affect site functionality.
            </li>
          </ul>
        </section>

        {/* Changes to Policies */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Changes to These Policies</h2>
          <p className="text-gray-600">
            We may update these Terms and Conditions, Privacy Policy, or Cookie Policy from time to time. Updates will
            be posted on this page with a revised “Last Updated” date. It is your responsibility to review this page
            periodically for changes. Continued use of our platform after any changes signifies your acceptance of the
            updated terms.
          </p>
        </section>

        {/* Contact Information */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Contact Information</h2>
          <address className="text-gray-600">
            <strong>Blue Collar Industries</strong>
            <br />
            7 Coxhill Gardens, CT17 0PY
            <br />
            United Kingdom
            <br />
            Email:{" "}
            <a href="mailto:martyn@getpaidontheweb.com" className="text-blue-500 underline">
              martyn@getpaidontheweb.com
            </a>
          </address>
        </section>
      </div>
    </div>
  );
};

export default TermsAndConditions;
