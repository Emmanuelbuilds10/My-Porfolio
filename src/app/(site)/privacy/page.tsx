import type { Metadata } from "next";
import Link from "next/link";
import { LegalShell } from "@/components/content/LegalShell";
import { legal } from "@/lib/legal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.name} collects, uses and protects the information you send through this site.`,
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

/**
 * Privacy policy.
 *
 * Written against what this app actually does, not a template: the contact
 * form and the newsletter are the only places data is collected, the only
 * processors are Supabase and Vercel, and there is no analytics or advertising
 * anywhere in the codebase. Keep it that way, or update this page with the copy.
 */
export default function PrivacyPage() {
  return (
    <LegalShell
      title="Privacy Policy"
      summary={`This explains what happens to information you send through ${site.name}. The short version: only what you type into a form, only to reply to you or send you the updates you asked for, and nothing sold or shared for advertising.`}
    >
      <h2>Who is responsible</h2>
      <p>
        {legal.controller} (&ldquo;I&rdquo;, &ldquo;me&rdquo;) is responsible for this website and
        for the information described below. For anything in this policy, including any request to
        see, correct or delete your information, email{" "}
        <a href={`mailto:${legal.email}`}>{legal.email}</a>.
      </p>

      <h2>What I collect</h2>
      <ul>
        <li>
          <strong>Contact form.</strong> Your first and last name, email address, an optional phone
          number, and the message itself. Nothing else is required, and the phone field is genuinely
          optional — leave it blank.
        </li>
        <li>
          <strong>Newsletter.</strong> Your email address, and nothing else. If you use the same
          address twice the second attempt is ignored.
        </li>
        <li>
          <strong>Server logs.</strong> The hosting provider records standard request logs (IP
          address, browser, page requested) to keep the site online and to spot abuse. These are
          short-lived operational records, not a profile of you.
        </li>
        <li>
          <strong>Admin session.</strong> Signing in to the private admin area sets an
          authentication cookie. It is created only for the site owner&rsquo;s own account — regular
          visitors never receive one.
        </li>
      </ul>
      <p>
        There is no analytics service, no advertising network, no third-party tracking pixel, no
        embedded social widget and no profiling of any kind on this site.
      </p>

      <h2>Why I use it</h2>
      <ul>
        <li>To read your message and reply to it.</li>
        <li>To send the newsletter, if and only if you asked for it.</li>
        <li>To keep the site secure — blocking spam submissions and password-guessing attempts.</li>
      </ul>
      <p>
        Where the law requires a &ldquo;legal basis&rdquo;: the newsletter and the contact form run
        on your consent (transmitted when you submit the form), and the security measures —
        including the short-lived record of an IP address used to throttle repeated submissions —
        run on the legitimate interest of keeping the site working. You can withdraw consent at any
        time by emailing me or by using the unsubscribe link in any newsletter.
      </p>

      <h2>Who else sees it</h2>
      <p>
        Two service providers process data on my behalf, and no one else does:
      </p>
      <ul>
        <li>
          <strong>Supabase</strong> stores the contact messages, the subscriber list and any images
          uploaded through the admin, in a database protected by row-level security.
        </li>
        <li>
          <strong>Vercel</strong> hosts the site and answers the requests.
        </li>
      </ul>
      <p>
        Both are established providers with their own security and privacy commitments, and both may
        store data outside your country. Your information is never sold, rented, or shared for
        marketing.
      </p>
      <p>
        Links to X, Dribbble, GitHub and LinkedIn take you to those platforms. Once you follow one,
        you are on their site and covered by their privacy policy, not this one.
      </p>

      <h2>How long it is kept</h2>
      <ul>
        <li>
          <strong>Messages:</strong> kept while we are in touch about the work, and for up to 12
          months after the conversation ends, then deleted.
        </li>
        <li>
          <strong>Newsletter:</strong> kept until you unsubscribe — a link is in every email, and
          emailing me works too.
        </li>
        <li>
          <strong>Rate-limiting records:</strong> held in the server&rsquo;s memory for ten to
          fifteen minutes, then discarded.
        </li>
      </ul>

      <h2>Your rights</h2>
      <p>
        You can ask to see a copy of what I hold about you, have it corrected, have it deleted, or
        object to a particular use of it. Email <a href={`mailto:${legal.email}`}>{legal.email}</a>{" "}
        and I will respond within 30 days. Depending on where you live you may also have the right
        to complain to a data protection authority — in Nigeria, the Nigeria Data Protection
        Commission; in the EU or UK, your national supervisory authority.
      </p>

      <h2>Security</h2>
      <p>
        The site is served over HTTPS, the database enforces access rules per row rather than
        trusting the app, administrative sessions are short-lived, and the one account with write
        access is protected by a password hashed by Supabase Auth — this application never receives
        or stores passwords itself. No system is perfect; if I ever become aware of a breach
        affecting your information I will tell you and the relevant authority without delay.
      </p>

      <h2>Children</h2>
      <p>
        This site is aimed at businesses and adults. It is not intended for anyone under 16, and I
        do not knowingly collect their information. If you believe a child has submitted a form,
        email me and it will be removed.
      </p>

      <h2>Changes</h2>
      <p>
        If this policy changes, the &ldquo;last updated&rdquo; date at the top changes with it. Any
        material change to how information is used will be described here before it takes effect.
      </p>

      <h2>Related pages</h2>
      <p>
        See also the <Link href="/cookies">Cookie Policy</Link> and the{" "}
        <Link href="/terms">Terms &amp; Conditions</Link>.
      </p>
    </LegalShell>
  );
}
