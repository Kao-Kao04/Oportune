import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Privacy notice",
  description: "How Oportune collects, uses, and protects your personal information.",
};

// DRAFT. Prepared for compliance planning under the Data Privacy Act of 2012
// (Republic Act No. 10173) and its IRR. Not legal advice; must be reviewed by
// a Philippine lawyer and the DPO before launch.
export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy notice" updated="October 23, 2026 (draft)">
      <section>
        <h2>1. Who we are</h2>
        <p className="mt-2">
          Oportune (&quot;we&quot;) is a free website and app that lists scholarships, internships, competitions, and
          courses for college students in the Philippines, each checked by a person against its source. [Legal name of the entity operating Oportune, its
          address] is the personal information controller for the information described here, under the Data Privacy
          Act of 2012 (Republic Act No. 10173) and its Implementing Rules and Regulations.
        </p>
        <p className="mt-2">
          Data Protection Officer: [Name], [email address]. Contact the DPO for any question or request about your
          personal information.
        </p>
      </section>

      <section>
        <h2>2. What we collect</h2>
        <p className="mt-2">You can browse every listing without an account. We collect information only when you:</p>
        <ul className="mt-2">
          <li>
            <span className="font-semibold">Sign in:</span> your name and email address (from Google, or the email you type
            for a sign-in link). We do not receive your Google password.
          </li>
          <li>
            <span className="font-semibold">Answer the quick profile:</span> your school, field of study, course, year
            level, the kinds of opportunities you want, and whether you are 18 or older.
          </li>
          <li>
            <span className="font-semibold">Save listings and set reminders:</span> which listings you saved, your
            reminder choices, a record of reminders we sent, and, if you turn on phone notifications, a technical address
            for your browser that lets us deliver them (a &quot;push subscription&quot;).
          </li>
          <li>
            <span className="font-semibold">Report a listing:</span> the reason and any details you write. If you are
            signed in, the report is linked to your account.
          </li>
          <li>
            <span className="font-semibold">Submit an opportunity:</span> the link and any details you write (title,
            organizer, deadline, note, and whether you&apos;re a student or organizer), linked to your account so you can
            see its status.
          </li>
          <li>
            <span className="font-semibold">Use the site:</span> anonymous usage events (for example, that you visited
            today, that a listing was viewed, or that its official link was clicked), tied to a random ID stored in your
            browser, not to your name. If you opened a link shared by a student organization, we also note that
            organization&apos;s short link tag (for example, &quot;gdg-pup&quot;) so we know which groups bring visitors. To
            stop abuse, we keep a one-way scrambled (hashed) version of your internet address for up to two days; we do
            not store the address itself.
          </li>
        </ul>
        <p className="mt-2">
          We do not ask for government IDs, documents, grades, family income, or financial information. Please do not
          include personal details such as phone numbers in reports.
        </p>
      </section>

      <section>
        <h2>3. Why we use it, and on what basis</h2>
        <ul className="mt-2">
          <li>
            To give you an account, save listings, and send the deadline reminders you asked for: to provide the service
            you signed up for, and your consent.
          </li>
          <li>
            To show listings that fit your course and year level: your consent, which you give when you fill in the quick
            profile. Information about your schooling is treated with extra care because the law classifies education
            information as sensitive personal information.
          </li>
          <li>
            To keep the service safe and working (preventing spam reports, fixing errors) and to count how the service is
            used so we can improve it: our legitimate interests, using the least information needed.
          </li>
          <li>To meet legal obligations, such as responding to lawful requests from authorities.</li>
        </ul>
        <p className="mt-2">We do not sell your information, show you ads, or use it for automated decisions about you.</p>
      </section>

      <section>
        <h2>4. Who processes it for us</h2>
        <p className="mt-2">
          We use service providers that process information only on our instructions and under agreements that require
          them to protect it:
        </p>
        <ul className="mt-2">
          <li>Supabase: database and sign-in (servers in Singapore).</li>
          <li>Vercel: hosting of the website.</li>
          <li>Resend: sending reminder and sign-in emails.</li>
          <li>Google: &quot;Continue with Google&quot; sign-in, if you choose it.</li>
          <li>
            Browser push services (for example, Google, Apple, or Mozilla, depending on your browser): delivering phone
            notifications you turned on.
          </li>
        </ul>
        <p className="mt-2">
          Some of these providers store or process information outside the Philippines. We choose providers that apply
          security measures comparable to Philippine standards. [Confirm data processing agreements and transfer
          safeguards with each provider.]
        </p>
      </section>

      <section>
        <h2>5. How long we keep it</h2>
        <ul className="mt-2">
          <li>Account, profile, saved listings, reminder settings, and push subscriptions: until you delete your account.</li>
          <li>Reminder records: until you delete your account, or the listing is removed.</li>
          <li>Hashed internet addresses used against abuse: up to two days.</li>
          <li>
            Reports and submissions: kept to maintain listing quality. When you delete your account, they stay but are
            no longer linked to you.
          </li>
          <li>Anonymous usage events: 13 months, then deleted automatically.</li>
        </ul>
      </section>

      <section>
        <h2>6. Your rights</h2>
        <p className="mt-2">Under the Data Privacy Act, you have the right to:</p>
        <ul className="mt-2">
          <li>be informed about how your information is processed (this notice);</li>
          <li>access your information and get a copy of it;</li>
          <li>correct inaccurate information (you can edit your profile in Me → Edit profile);</li>
          <li>object to processing and withdraw consent (you can turn off reminders in Me);</li>
          <li>
            have your information erased (you can delete your account anytime in Me → Delete my account; it takes effect
            immediately);
          </li>
          <li>data portability, and to claim damages and file a complaint with the National Privacy Commission.</li>
        </ul>
        <p className="mt-2">
          To use a right that the app does not cover directly, email the DPO at [email address]. We respond within [15]
          days.
        </p>
      </section>

      <section>
        <h2>7. Users under 18</h2>
        <p className="mt-2">
          Some first-year students are 17. The quick profile asks whether you are 18 or older. [Describe the rule after
          legal review, e.g., whether a parent or guardian&apos;s consent is required for users under 18 and which features
          they may use.]
        </p>
      </section>

      <section>
        <h2>8. How we protect it</h2>
        <ul className="mt-2">
          <li>Encrypted connections (HTTPS) everywhere.</li>
          <li>Database rules that let each student see only their own information.</li>
          <li>Access to the admin panel only for named curators, with a log of their actions.</li>
          <li>Collecting only what the service needs.</li>
        </ul>
      </section>

      <section>
        <h2>9. If there is a data breach</h2>
        <p className="mt-2">
          If a breach of personal information is likely to put you at real risk of harm, we will notify the National
          Privacy Commission and the affected users within 72 hours of finding out, as the law requires, and tell you
          what we are doing about it.
        </p>
      </section>

      <section>
        <h2>10. Contact and complaints</h2>
        <p className="mt-2">
          Data Protection Officer: [Name], [email address], [postal address]. You may also contact the National Privacy
          Commission (privacy.gov.ph).
        </p>
        <p className="mt-2">
          We will post changes to this notice on this page and, for important changes, tell signed-in users. See also our{" "}
          <Link href="/terms" className="text-teal underline">
            terms of use
          </Link>
          .
        </p>
      </section>
    </LegalPage>
  );
}
