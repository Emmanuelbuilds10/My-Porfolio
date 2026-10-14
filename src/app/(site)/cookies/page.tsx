import type { Metadata } from "next";
import Link from "next/link";
import { LegalShell } from "@/components/content/LegalShell";
import { legal } from "@/lib/legal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: `The cookies ${site.name} sets, why they exist, and why this site shows no consent banner.`,
  alternates: { canonical: "/cookies" },
  robots: { index: true, follow: true },
};

/**
 * Cookie policy.
 *
 * The site sets exactly one kind of cookie — Supabase's auth cookie, and only
 * after the owner signs in to /admin. Strictly-necessary cookies do not need
 * prior consent, which is why there is no banner; adding analytics or an embed
 * would change that, so this page is the checklist for what would have to be
 * added if such a service is ever introduced.
 */
export default function CookiesPage() {
  return (
    <LegalShell
      title="Cookie Policy"
      summary="This site uses no advertising or analytics cookies. The only cookie it can set is the one that keeps the admin area signed in — and only for the site owner."
    >
      <h2>What a cookie is</h2>
      <p>
        A cookie is a small file a site asks your browser to store, then sends back with later
        requests so the server can recognise the same browser. They are also used to remember
        preferences and to measure traffic — which is the part most cookie policies are about.
      </p>

      <h2>What this site sets</h2>
      <ul>
        <li>
          <strong>Strictly necessary (admin sign-in only).</strong> When the site owner signs in at{" "}
          <code>/admin/login</code>, Supabase Auth sets a short-lived cookie (names beginning{" "}
          <code>sb-</code>) that holds the session. It is <code>HttpOnly</code>, so scripts cannot
          read it, is sent only over HTTPS in production, and expires when the session ends. It is
          never set for ordinary visitors — if you have not signed in to the admin, this site has
          not given you a cookie.
        </li>
        <li>
          <strong>Analytics and advertising.</strong> None. There is no Google Analytics, no
          Meta pixel, no session recorder, no A/B testing tool and no advertising tag anywhere in
          this site.
        </li>
        <li>
          <strong>Third-party cookies.</strong> None set by this site. There are no embedded videos,
          maps, chat widgets or social embeds — links to X, Dribbble, GitHub and LinkedIn are plain
          links that only take effect when you click them, at which point those platforms may set
          their own cookies under their own policies.
        </li>
      </ul>

      <h2>Why there is no cookie banner</h2>
      <p>
        Rules such as the UK/EU ePrivacy rules and Nigeria&rsquo;s data protection framework
        require consent for cookies that are <em>not</em> strictly necessary — analytics and
        advertising being the usual examples. Everything this site stores falls into the
        strictly-necessary category, so there is nothing to ask permission for and no banner is
        shown. If an analytics or marketing tool is ever added, this page will be updated and a
        consent banner introduced first.
      </p>

      <h2>Managing cookies yourself</h2>
      <p>
        You are always in control of your browser. Deleting cookies after visiting a site, or
        blocking third-party cookies in your browser settings, will not stop this site working for
        you. Blocking all cookies will only affect the admin sign-in.
      </p>

      <h2>More detail</h2>
      <p>
        How the information sent through forms is used, and how to ask for it to be deleted, is in
        the <Link href="/privacy">Privacy Policy</Link>. Questions can go to{" "}
        <a href={`mailto:${legal.email}`}>{legal.email}</a>.
      </p>
    </LegalShell>
  );
}
