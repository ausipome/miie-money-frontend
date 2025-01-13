import React from "react";
import Footer from "./footer";

const TermsAndConditions = () => {
  return (
    <>
      {/* Header Section */}
      <section className="text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20 mt-12">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
          Terms and Conditions
        </h1>
      </section>

      {/* Subheader */}
      <section className="bg-gray-100 py-8 px-6 text-center">
        <p className="text-lg md:text-xl font-light text-gray-700">
        Please read our terms carefully to understand your obligations and rights. By using our platform, you agree to these terms.
        </p>
      </section>

      {/* Terms Content */}
      <section className="bg-gradient-to-r from-blue-950 to-blue-600 py-6">
        <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-8 lg:p-10">
          {/* Last Updated */}
          <p className="text-gray-600 text-sm mb-6 text-right">
            <strong>Last Updated:</strong> 18/11/2024
          </p>

          {/* Section Template */}
          <Section title="1. Introduction">
            <p>
              This <strong>Get Paid on the Web User Agreement</strong> (&quot;Agreement&quot;) is a legal contract between{" "}
              <strong>Blue Collar Industries</strong> (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) and the entity or individual (&quot;you&quot; or
              &quot;your&quot;) who accesses or uses our platform and services. By using our platform, you agree to this
              Agreement, our <strong>Privacy Policy</strong>, and our <strong>Cookie Policy</strong>. If you do not
              agree, you must not use our services.
            </p>
          </Section>

          <Section title="2. Definitions">
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>&quot;Services&quot;:</strong> The tools, web components, and features provided through our platform,
                including invoicing, payment links, and subscriptions.
              </li>
              <li>
                <strong>&quot;Affiliate Marketing&quot;:</strong> Advertising third-party products or services on our platform
                through affiliate arrangements.
              </li>
              <li>
                <strong>&quot;Subscription&quot;:</strong> A recurring payment model managed through our platform for user-provided
                services or products.
              </li>
            </ul>
          </Section>

          <Section title="3. Regional Compliance">
            <p>
              We operate in the <strong>United Kingdom, United States, Canada, Australia, and New Zealand</strong>. By
              using our platform in these regions, you agree to comply with the applicable laws and regulations:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>
                <strong>United Kingdom:</strong> Compliance with UK GDPR and Data Protection Act 2018.
              </li>
              <li>
                <strong>United States:</strong> Compliance with CAN-SPAM Act and federal/state laws.
              </li>
              <li>
                <strong>Canada:</strong> Adherence to PIPEDA and GST/HST tax obligations.
              </li>
              <li>
                <strong>Australia:</strong> Compliance with Privacy Act 1988 and ATO requirements.
              </li>
              <li>
                <strong>New Zealand:</strong> Adherence to New Zealand Privacy Act 2020 and IRD obligations.
              </li>
            </ul>
          </Section>

          <Section title="4. User Obligations">
            <ul className="list-disc list-inside space-y-2">
              <li>Maintain accurate and up-to-date account information.</li>
              <li>
                Ensure that payment methods for subscriptions are valid and have sufficient funds for recurring payments.
              </li>
              <li>
                Comply with all applicable laws and regulations when using our platform and services.
              </li>
            </ul>
          </Section>

          <Section title="5. Limitations of Liability">
            <p>
              To the maximum extent permitted by law, we are not liable for any indirect, incidental, special,
              consequential, or punitive damages, including loss of profits, data, or business opportunities. Our total
              liability is limited to the fees you paid in the last three months.
            </p>
          </Section>

          <Section title="6. Dispute Resolution">
            <p>
              Any disputes arising under this Agreement will be resolved through binding arbitration in accordance with
              ICC rules, conducted in English in a mutually agreed location.
            </p>
          </Section>

          <Section title="7. Privacy Policy">
            <p>
              We retain personal data as necessary to provide services and meet legal obligations. Payment records are
              retained for a minimum of seven years.
            </p>
          </Section>

          <Section title="8. Cookie Policy">
            <p>
              By using our platform, you consent to the use of cookies for essential site functionality, analytics, and
              personalized ads. You can manage or disable cookies in browser settings.
            </p>
          </Section>

          <Section title="9. Changes to These Policies">
            <p>
              We may update these Terms and Conditions periodically. Changes will be posted with a revised &quot;Last
              Updated&quot; date. Continued use after changes signifies acceptance.
            </p>
          </Section>

          {/* Contact Information */}
          <Section title="10. Contact Information">
            <address className="not-italic text-gray-600">
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
          </Section>
        </div>
      </section>
      <Footer />
    </>
  );
};

// Reusable Section Component
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">{title}</h2>
      <div className="text-gray-700 leading-relaxed">{children}</div>
    </section>
  );
};

export default TermsAndConditions;
