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
                <h1 className="text-lg font-semibold">Terms Of Service</h1>
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
              By accessing our app, you agree to be bound by these terms of
              service and to use the app in accordance with these terms.
            </p>

            <p>
              <b>2. Use of Our App</b>
            </p>
            <p>
              You agree to use our app only for lawful purposes and in a way
              that does not infringe the rights of, restrict, or inhibit anyone
              else&apos;s use and enjoyment of the app. Prohibited behavior
              includes harassing or causing distress or inconvenience to any
              other user, transmitting obscene or offensive content, or
              disrupting the normal flow of dialogue within our app.
            </p>

            <p>
              <b>3. User Accounts</b>
            </p>
            <p>
              If you create an account on our app, you are responsible for
              maintaining the security of your account, and you are fully
              responsible for all activities that occur under the account. You
              must immediately notify us of any unauthorized uses of your
              account or any other breaches of security.
            </p>

            <p>
              <b>4. Intellectual Property</b>
            </p>
            <p>
              All content included on the app, such as text, graphics, logos,
              images, and software, is the property of UrbanPulse or its content
              suppliers and protected by applicable copyright and trademark
              laws.
            </p>

            <p>
              <b>5. Termination</b>
            </p>
            <p>
              We may terminate or suspend your account and bar access to the app
              immediately, without prior notice or liability, under our sole
              discretion, for any reason whatsoever and without limitation,
              including but not limited to a breach of the terms.
            </p>

            <p>
              <b>6. Limitation of Liability</b>
            </p>
            <p>
              In no event shall UrbanPulse, nor its directors, employees,
              partners, agents, suppliers, or affiliates, be liable for any
              indirect, incidental, special, consequential, or punitive damages,
              including without limitation, loss of profits, data, use,
              goodwill, or other intangible losses, resulting from your access
              to or use of or inability to access or use the app.
            </p>

            <p>
              <b>7. Changes to These Terms</b>
            </p>
            <p>
              We reserve the right, at our sole discretion, to modify or replace
              these terms at any time. If a revision is material we will make
              reasonable efforts to provide at least 30 days&apos; notice prior
              to any new terms taking effect. What constitutes a material change
              will be determined at our sole discretion.
            </p>

            <p>
              <b>8. Governing Law</b>
            </p>
            <p>
              These terms shall be governed and construed in accordance with the
              laws of Malaysia, without regard to its conflict of law
              provisions.
            </p>

            <p>
              <b>9. Contact Us</b>
            </p>
            <p>
              If you have any questions about these terms, please contact us.
            </p>
          </div>
          {/* End Body */}
        </div>
      </div>
    </main>
  );
}
