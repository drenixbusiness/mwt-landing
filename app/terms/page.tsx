import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms & Conditions — MWT Transport LLC",
  description: "Terms and conditions for using the MWT Transport LLC driver recruiting website.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & conditions"
      sheet="Sheet L-02"
      updated="October 2, 2026"
      intro={
        <p>
          These terms govern your use of this website, operated by MWT Transport LLC (&quot;MWT&quot;,
          &quot;we&quot;, &quot;us&quot;). By using the site or sending an application, you agree to them. If you do
          not agree, please do not use the site.
        </p>
      }
    >
      <LegalSection n={1} title="Purpose of the site">
        <p>
          This site gives general information about MWT Transport LLC and lets CDL-A drivers and owner-operators
          express interest in working with us. It is not a job offer or an employment or lease contract.
        </p>
      </LegalSection>

      <LegalSection n={2} title="No guarantee of employment">
        <p>
          Sending an application does not guarantee an interview, a job offer or a lease agreement. All hiring is
          subject to our qualification standards, including a valid Class A CDL, a current DOT medical card, and
          satisfactory background, motor vehicle record and drug and alcohol testing as required by FMCSA
          regulations.
        </p>
      </LegalSection>

      <LegalSection n={3} title="Pay, benefits and positions">
        <p>
          Descriptions of pay, home time, equipment, benefits and hiring steps on this site are general summaries
          and may change at any time without notice. Actual terms depend on the position, your qualifications and
          lanes, and are set only in your written employment or independent contractor (lease) agreement. If
          anything on this site conflicts with that agreement, the agreement controls.
        </p>
      </LegalSection>

      <LegalSection n={4} title="Your information">
        <p>
          You agree that the information you submit is true, accurate and your own. Providing false information
          may disqualify you from consideration. How we handle your information is described in our{" "}
          <a href="/privacy">Privacy Policy</a>.
        </p>
      </LegalSection>

      <LegalSection n={5} title="Consent to contact">
        <p>
          By submitting the application form, you agree that MWT may contact you about your application by phone
          call, text message or email at the contact details you provide. Message and data rates may apply.
          Reply <strong>STOP</strong> to opt out of text messages at any time. Consent is not a condition of
          employment.
        </p>
      </LegalSection>

      <LegalSection n={6} title="Acceptable use">
        <p>You agree not to:</p>
        <ul>
          <li>Submit applications on behalf of someone else without their permission</li>
          <li>Send spam, automated submissions or harmful code</li>
          <li>Try to interfere with the site&apos;s security or operation</li>
          <li>Use the site for any unlawful purpose</li>
        </ul>
      </LegalSection>

      <LegalSection n={7} title="Intellectual property">
        <p>
          The MWT Transport name, site design and text belong to MWT Transport LLC. Photographs are used under
          their respective licenses. You may not copy or reuse site content for commercial purposes without our
          written permission.
        </p>
      </LegalSection>

      <LegalSection n={8} title="Third-party links">
        <p>
          The site links to third-party websites such as FMCSA SAFER. We do not control those sites and are not
          responsible for their content or practices.
        </p>
      </LegalSection>

      <LegalSection n={9} title="Disclaimer and limitation of liability">
        <p>
          The site is provided &quot;as is&quot; without warranties of any kind. We try to keep information
          accurate and current but do not guarantee it is complete or error-free. To the fullest extent permitted
          by law, MWT is not liable for any indirect or consequential damages arising from your use of the site.
        </p>
      </LegalSection>

      <LegalSection n={10} title="Governing law">
        <p>
          These terms are governed by the laws of the State of Tennessee, without regard to its conflict-of-law
          rules. Any dispute about the site will be handled in the state or federal courts located in Tennessee.
        </p>
      </LegalSection>

      <LegalSection n={11} title="Changes and contact">
        <p>
          We may update these terms at any time; the &quot;Last updated&quot; date shows the latest version.
          Questions? Contact {SITE.name}, {SITE.mailingAddress}, or call{" "}
          <a href={SITE.phoneHref}>{SITE.phoneDisplay}</a>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
