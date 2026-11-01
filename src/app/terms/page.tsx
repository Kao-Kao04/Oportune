import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Terms of use",
  description: "The rules for using Oportune.",
};

// DRAFT. Not legal advice; must be reviewed by a Philippine lawyer before launch.
export default function TermsPage() {
  return (
    <LegalPage title="Terms of use" updated="November 1, 2026 (draft)">
      <section>
        <h2>1. About these terms</h2>
        <p className="mt-2">
          These terms apply when you use Oportune, operated by [legal name of the entity] (&quot;we&quot;). By using
          Oportune, you agree to them. Our{" "}
          <Link href="/privacy" className="text-teal underline">
            privacy notice
          </Link>{" "}
          explains how we handle your personal information.
        </p>
      </section>

      <section>
        <h2>2. What Oportune is, and is not</h2>
        <ul className="mt-2">
          <li>Oportune is free for students. We do not charge students and do not apply on your behalf.</li>
          <li>
            Listings are short summaries written by our team from each opportunity&apos;s official source. We check them,
            but organizers can change deadlines, requirements, or amounts at any time. Always confirm details on the
            official site before you apply.
          </li>
          <li>
            The &quot;Official .gov.ph&quot; or &quot;Official .edu.ph&quot; badge means the source link is a government or
            school website. It is not a guarantee that you qualify or will be selected.
          </li>
          <li>We are not the organizer of any listed opportunity and are not responsible for its selection decisions.</li>
        </ul>
      </section>

      <section>
        <h2>3. Your account</h2>
        <ul className="mt-2">
          <li>Keep your email account secure; anyone who can open your email can use your sign-in links.</li>
          <li>Give accurate profile information. You can edit it or delete your account at any time.</li>
          <li>Reminders are a convenience. A missed or late reminder does not extend any deadline.</li>
        </ul>
      </section>

      <section>
        <h2>4. Acceptable use</h2>
        <p className="mt-2">Do not:</p>
        <ul className="mt-2">
          <li>send false, abusive, or spam reports, or include other people&apos;s personal information in them;</li>
          <li>try to access other users&apos; information, the admin panel, or our systems without permission;</li>
          <li>scrape or copy the listings in bulk, or overload the service;</li>
          <li>use Oportune for anything illegal, including fraud or scams aimed at students.</li>
        </ul>
        <p className="mt-2">We may suspend accounts that break these rules.</p>
      </section>

      <section>
        <h2>5. Sharing an opportunity with us</h2>
        <p className="mt-2">
          When you send us a link or a post (through Submit or your phone&apos;s share menu), please:
        </p>
        <ul className="mt-2">
          <li>only share opportunities that are open to the public;</li>
          <li>
            not share posts from a private group or group chat unless the organizer agreed, or the same opportunity is
            posted publicly;
          </li>
          <li>leave out other people&apos;s phone numbers, email addresses, photos, and comments.</li>
        </ul>
        <p className="mt-2">
          We use what you send only to find and check the official source. Listings show the opportunity&apos;s details
          in our own words and link back to the organizer&apos;s post or page. We do not republish posts, posters, or
          photos, or the names and contact details of people in them.
        </p>
      </section>

      <section>
        <h2>6. For organizers: corrections and removal</h2>
        <p className="mt-2">
          If you run a listed opportunity and something is wrong, or you&apos;d rather not be listed, email us at [contact
          email address] or use &quot;Something wrong? Report this listing&quot; on the listing page. We fix or remove it within 48 hours. Organizers
          can also send their own opportunities through Submit for free.
        </p>
      </section>

      <section>
        <h2>7. Content and trademarks</h2>
        <p className="mt-2">
          Listing summaries, the design, and the Oportune name belong to us. Organization names and logos belong to their
          owners and are used only to identify the opportunity; a listing does not mean the organizer endorses or partners
          with Oportune. You may share links to listings freely.
        </p>
      </section>

      <section>
        <h2>8. Limits of our responsibility</h2>
        <p className="mt-2">
          Oportune is provided as is. To the extent allowed by Philippine law, we are not liable for losses that come from
          relying on a listing without checking the official source, from an organizer&apos;s decisions, or from service
          interruptions. Nothing in these terms removes rights you have under the law.
        </p>
      </section>

      <section>
        <h2>9. Changes and contact</h2>
        <p className="mt-2">
          We may update these terms and will post the new version here. These terms are governed by the laws of the
          Republic of the Philippines. Questions: [contact email address].
        </p>
      </section>
    </LegalPage>
  );
}
