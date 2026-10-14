import type { Metadata } from "next";
import Link from "next/link";
import { LegalShell } from "@/components/content/LegalShell";
import { legal } from "@/lib/legal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `The terms for using ${site.name}'s portfolio site, including what is and is not offered here.`,
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

/**
 * Terms & conditions.
 *
 * This is a portfolio, not a shop: the terms say so plainly (no sales, so no
 * refund policy applies), set out who owns what, and limit liability for the
 * informational content. Client work is deliberately pushed to a separate
 * written agreement rather than being governed by these page terms.
 */
export default function TermsPage() {
  return (
    <LegalShell
      title="Terms & Conditions"
      summary={`These terms cover your use of ${site.name}. This is a portfolio site: nothing on it is for sale, no payment is ever taken here, and work is only ever agreed separately in writing.`}
    >
      <h2>Using this site</h2>
      <p>
        By browsing {site.name} you accept these terms. If you do not accept them, please stop using
        the site. They apply only to this website — if you hire me, the work is governed by a
        separate written agreement, not by this page.
      </p>

      <h2>What this site is</h2>
      <p>
        This site is an informational portfolio: it shows my work, writing and contact details.
        Nothing on it is an offer, a quotation, a price list, or a promise of any particular result.
        Project descriptions describe work as it was at the time, and client work shown here belongs
        to those clients.
      </p>

      <h2>No payments, so no refunds</h2>
      <p>
        This website does not sell goods, services, subscriptions or digital downloads, and never
        asks for payment details. No money changes hands through it, so there is no purchase to
        refund and no refund policy applies to it. If you engage me for paid work, the fees,
        deliverables, cancellation terms and refund arrangements are set out in that separate
        written agreement before any payment is made.
      </p>

      <h2>Ownership and copyright</h2>
      <ul>
        <li>
          <strong>This site.</strong> The text, layout, design and code of this website are
          &copy; {new Date().getFullYear()} {legal.controller}, all rights reserved. You are welcome
          to read, link to and quote it with credit and a link back; reproducing it as your own is
          not permitted.
        </li>
        <li>
          <strong>My work.</strong> Case studies, screenshots and images of client projects are
          shown with permission and remain the property of me or of the client concerned. Please do
          not reuse them without asking.
        </li>
        <li>
          <strong>Photography.</strong> Stock photography on this site comes from Unsplash and is
          used under the Unsplash Licence, which allows commercial use without attribution.
        </li>
        <li>
          <strong>Third-party names.</strong> Product, brand and company names mentioned on this
          site — including Next.js, Supabase, Vercel, X, GitHub, Dribbble and LinkedIn — belong to
          their respective owners, and are used only to describe tools and platforms accurately.
          Mentioning them does not imply any sponsorship or endorsement.
        </li>
      </ul>

      <h2>Acceptable use</h2>
      <p>Please use the site as intended. Do not:</p>
      <ul>
        <li>attempt to gain access to the private admin area or any account that is not yours;</li>
        <li>
          probe, scan or overload the site, or interfere with its security, rate limits or
          availability;
        </li>
        <li>scrape or bulk-copy the content, or republish it;</li>
        <li>use the contact or newsletter forms to send spam, malware, or anything unlawful;</li>
        <li>
          submit someone else&rsquo;s details to the forms, or impersonate anyone when you do.
        </li>
      </ul>
      <p>
        Submissions are rate limited and screened, access attempts are logged, and I will block
        abusive traffic.
      </p>

      <h2>Accuracy and availability</h2>
      <p>
        The content is provided as it is, for general information. I keep it as accurate as I can
        but make no warranty that it is complete, current or error-free, and nothing here is
        professional, legal, financial or technical advice for your own situation. Posts reflect
        what I knew when I wrote them. The site may be changed, taken offline for maintenance, or
        discontinued at any time.
      </p>

      <h2>Links to other sites</h2>
      <p>
        Links to X, Dribbble, GitHub, LinkedIn or anywhere else are provided for convenience. I do
        not control those sites, am not responsible for their content, availability or privacy
        practices, and a link does not imply endorsement of them.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent allowed by law, I am not liable for indirect or consequential loss,
        for lost profits or data, or for anything arising from your use of, or inability to use,
        this site or from reliance on its content. Nothing in these terms limits liability that
        cannot legally be limited, including for fraud, or for death or personal injury caused by
        negligence.
      </p>

      <h2>Privacy</h2>
      <p>
        Information you send through the forms is handled as described in the{" "}
        <Link href="/privacy">Privacy Policy</Link>, and the cookies this site uses are listed in
        the <Link href="/cookies">Cookie Policy</Link>.
      </p>

      <h2>Which law applies</h2>
      <p>
        These terms are governed by the laws of {legal.jurisdiction}, and any dispute about them
        falls to the courts of that country. If you are a consumer with mandatory protections in
        your own country, those protections still apply to you.
      </p>

      <h2>Changes to these terms</h2>
      <p>
        These terms may be updated as the site changes; the &ldquo;last updated&rdquo; date at the
        top shows when. Continuing to use the site after a change means you accept the updated
        terms.
      </p>

      <h2>Getting in touch</h2>
      <p>
        Questions about these terms, or about permission to reuse something from this site, go to{" "}
        <a href={`mailto:${legal.email}`}>{legal.email}</a>.
      </p>
    </LegalShell>
  );
}
