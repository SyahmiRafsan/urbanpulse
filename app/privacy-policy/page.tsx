import BackButton from "@/components/BackButton";
import Logo from "@/components/Logo";
import Nav from "@/components/Nav";
import React from "react";

export default function NotificationsPage() {
  return (
    <main className="flex flex-col items-center justify-between bg-neutral-50 pb-24 min-h-[100svh]">
      <div className="max-w-[700px] border-x w-full bg-background gap-4">
        <Nav />
        <div className="flex flex-col gap-4 pt-4">
          {/* Start Top */}
          <div className="items-start flex-col flex bg-card px-4">
            <div className="flex flex-row items-center gap-4 relative justify-start w-full">
              <BackButton />
              <div className="flex flex-row gap-1 items-center text-sm w-fit">
                <h1 className="text-lg font-semibold">Privacy Policy</h1>
              </div>
            </div>
          </div>

          {/* End Top */}
          {/* Start Body */}
          <div className="flex flex-col gap-4 items-start pb-4 px-4 border-b min-h-[60svh] justify-start">
            <div className="text-sm bg-neutral-100 border px-2 py-1">
              <pre>Last updated: 14 July 2024</pre>
            </div>

            <Logo />

            <p>
              <b>1. Introduction</b>
            </p>
            <p>
              At UrbanPulse, we are committed to protecting your personal
              information and your right to privacy.
            </p>

            <p>
              <b>2. Information We Collect</b>
            </p>
            <p>
              We collect personal information that you voluntarily provide to us
              when you register on our app, express an interest in obtaining
              information about us or our products and services, when you
              participate in activities on the app, or otherwise when you
              contact us.
            </p>

            <p>
              <b>3. How We Use Your Information</b>
            </p>
            <p>We use the information we collect or receive to:</p>
            <ul className="list-decimal pl-8">
              <li>Facilitate account creation and login processes.</li>
              <li>
                Facilitate public policy recommendations to the authorities.
              </li>
              <li>
                Request feedback and contact you about your use of our app.
              </li>
              <li>
                For other business purposes such as data analysis, identifying
                usage trends, and determining the effectiveness of our
                campaigns.
              </li>
              <li>Send you marketing and promotional communications.</li>
              <li>Send administrative information to you.</li>
              <li>Post testimonials with your consent.</li>
            </ul>

            <p>
              <b>4. Sharing Your Information</b>
            </p>
            <p>
              We only share and disclose your information in the following
              situations:
            </p>
            <ul className="list-decimal pl-8">
              <li>
                Compliance with Laws: We may disclose your information where we
                are legally required to do so in order to comply with applicable
                law, governmental requests, a judicial proceeding, court order,
                or legal process.
              </li>
              <li>
                Vendors, Consultants, and Other Third-Party Service Providers:
                We may share your data with third-party vendors, service
                providers, contractors, or agents who perform services for us or
                on our behalf and require access to such information to do that
                work.
              </li>
            </ul>

            <p>
              <b>5. Data Retention</b>
            </p>
            <p>
              We will only keep your personal information for as long as it is
              necessary for the purposes set out in this privacy policy, unless
              a longer retention period is required or permitted by law.
            </p>

            <p>
              <b>6. Security of Your Information</b>
            </p>
            <p>
              We aim to protect your personal information through a system of
              organizational and technical security measures.
            </p>

            <p>
              <b>7. Specific Usages and Security Considerations</b>
            </p>

            <p>User&apos;s Location</p>
            <ul className="list-decimal pl-8">
              <li>
                <b>Local Storage</b>: The user&apos;s location is securely saved
                on your device in local storage.
              </li>
              <li>
                <b>API Usage</b>: Location coordinates are sent to the Nominatim
                OpenStreetMap API to fetch the district&apos;s name.
              </li>
              <li>
                <b>Zero Personal Data</b>: No personal information is attached
                or transmitted during this process.
              </li>
            </ul>

            <p>Personal Information Encryption</p>
            <ul className="list-decimal pl-8">
              <li>
                <b>Data Protection</b>: All personal information is encrypted
                using AES-256 encryption.
              </li>
              <li>
                <b>Future Enhancements</b>: Encryption keys will be rotated in
                the future as needed to ensure ongoing security.
              </li>
            </ul>

            <p>
              <b>8. Your Privacy Rights</b>
            </p>
            <p>
              In some regions, you have certain rights under applicable data
              protection laws. These may include the right to request access to
              and obtain a copy of your personal information, to request
              rectification or erasure, to restrict the processing of your
              personal information, and if applicable, to data portability.
            </p>

            <p>
              <b>9. Changes to This Privacy Policy</b>
            </p>
            <p>
              We may update this privacy policy from time to time in order to
              reflect, for example, changes to our practices or for other
              operational, legal, or regulatory reasons.
            </p>

            <p>
              <b>10. Contact Us</b>
            </p>
            <p>
              If you have any questions or concerns about our policy, or our
              practices with regards to your personal information, please
              contact us.
            </p>
          </div>
          {/* End Body */}
        </div>
      </div>
    </main>
  );
}
