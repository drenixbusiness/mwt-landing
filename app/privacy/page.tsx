import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy — MWT Transport LLC",
  description: "How MWT Transport LLC collects, uses and protects information submitted by driver applicants.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy policy"
      sheet="Sheet L-01"
      updated="October 2, 2026"
      intro={
        <p>
          This policy explains what information MWT Transport LLC (&quot;MWT&quot;, &quot;we&quot;, &quot;us&quot;)
          collects through this website, how we use it, and the choices you have. It applies to this recruiting
          site and the driver application form on it.
        </p>
      }
    >
      <LegalSection n={1} title="Information we collect">
        <p>When you send the driver application form, we receive:</p>
        <ul>
          <li>Your full name, phone number and (optionally) email address</li>
          <li>Your home state, the position you are interested in and your CDL-A experience</li>
          <li>The date and time of your submission</li>
        </ul>
        <p>
          Our hosting provider also records standard technical data such as IP address, browser type and pages
          requested, for security and to keep the site running. We do not use advertising cookies or sell
          tracking data.
        </p>
      </LegalSection>

      <LegalSection n={2} title="How we use it">
        <ul>
          <li>To contact you by phone, text message or email about your application and open positions</li>
          <li>To evaluate your qualifications for a driving position</li>
          <li>To keep records required for hiring and to meet our legal obligations</li>
          <li>To protect the site against spam and abuse</li>
        </ul>
        <p>
          Background checks, motor vehicle record (MVR) reviews and drug tests are only performed later in the
          hiring process, with your separate written authorization as required by the Fair Credit Reporting Act
          and FMCSA regulations.
        </p>
      </LegalSection>

      <LegalSection n={3} title="Text messages and calls">
        <p>
          By sending the form you agree that an MWT recruiter may call or text the number you provided about your
          application. Message frequency varies. Message and data rates may apply. Reply <strong>STOP</strong> to
          any text to opt out, or <strong>HELP</strong> for help. Consent to receive messages is not a condition
          of employment. We do not share your mobile number with third parties for their marketing purposes.
        </p>
      </LegalSection>

      <LegalSection n={4} title="How we share information">
        <p>We do not sell or rent your personal information. We share it only with:</p>
        <ul>
          <li>
            Service providers that help us run this site and deliver applications to our recruiters (for example,
            website hosting, email and messaging services), who may use it only on our behalf
          </li>
          <li>Screening providers, once you authorize background, MVR and drug testing</li>
          <li>Government agencies or others when required by law or to protect our rights and safety</li>
        </ul>
      </LegalSection>

      <LegalSection n={5} title="How long we keep it">
        <p>
          We keep application information for as long as needed to consider you for a position and to meet
          record-keeping requirements under federal and state law. When it is no longer needed, we delete it or
          make it anonymous.
        </p>
      </LegalSection>

      <LegalSection n={6} title="Security">
        <p>
          The site is served over an encrypted (HTTPS) connection and access to applications is limited to staff
          who need it. No method of transmission or storage is completely secure, so we cannot guarantee
          absolute security.
        </p>
      </LegalSection>

      <LegalSection n={7} title="Your choices and rights">
        <p>
          You can ask us to access, correct or delete the information you submitted, or to stop contacting you,
          by calling <a href={SITE.phoneHref}>{SITE.phoneDisplay}</a> or writing to the address below. Depending
          on the state you live in, you may have additional rights under state privacy law. We will not
          discriminate against you for exercising them.
        </p>
      </LegalSection>

      <LegalSection n={8} title="Children">
        <p>
          This site is intended for adults seeking driving positions. We do not knowingly collect information
          from anyone under 18.
        </p>
      </LegalSection>

      <LegalSection n={9} title="Changes to this policy">
        <p>
          We may update this policy from time to time. The &quot;Last updated&quot; date at the top shows when it
          last changed.
        </p>
      </LegalSection>

      <LegalSection n={10} title="Contact">
        <p>
          {SITE.name}
          <br />
          {SITE.mailingAddress}
          <br />
          Phone: <a href={SITE.phoneHref}>{SITE.phoneDisplay}</a>
        </p>
      </LegalSection>
    </LegalPage>
  );
}
