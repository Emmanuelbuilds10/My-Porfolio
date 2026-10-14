import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import { Container } from "@/components/ui/Container";
import { DribbbleIcon, GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/icons";
import { legal } from "@/lib/legal";
import { getSiteSettings } from "@/lib/queries";
import { footerWordmark, navLinks, site } from "@/lib/site";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

/**
 * Site footer: the oversized outline wordmark beside three link columns
 * (navigation, contact, socials) and a short legal line.
 *
 * Twitter, Github and the contact address come from `site_settings` so the
 * admin owns them; `site.ts` is the fallback when the database is not
 * configured. Links with no destination are omitted rather than rendered dead.
 */
export async function Footer() {
  const settings = await getSiteSettings();
  const year = new Date().getFullYear();

  const name = settings?.name ?? site.name;
  const email = settings ? settings.email : site.email;
  const location = settings?.location ?? site.location;

  const socials: { href: string; label: string; Icon: IconComponent }[] = [
    {
      href: settings?.dribbbleUrl ?? site.dribbbleUrl,
      label: "Dribbble",
      Icon: DribbbleIcon,
    },
    {
      href: settings?.linkedinUrl ?? site.linkedinUrl,
      label: "LinkedIn",
      Icon: LinkedinIcon,
    },
    { href: settings ? settings.twitterUrl : site.twitterUrl, label: "Twitter", Icon: TwitterIcon },
    { href: settings ? settings.githubUrl : site.githubUrl, label: "GitHub", Icon: GithubIcon },
  ].filter((social) => social.href.length > 0);

  const linkClasses = "text-sm text-muted transition-colors duration-200 hover:text-accent-text";

  return (
    <footer className="mt-section border-t border-line">
      <Container className="py-10 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] lg:gap-10">
          {/* ---- Wordmark ---- */}
          <div className="relative min-w-0">
            {/* `overflow-hidden` + a column-sized clamp keep the wordmark
                inside its cell instead of spilling over the link columns. */}
            <div className="overflow-hidden">
              <p
                aria-hidden
                className="wordmark-outline animate-fade-in text-[clamp(1.75rem,3.6vw,3rem)] leading-[0.9] font-bold tracking-[-0.02em] whitespace-nowrap uppercase"
              >
                {footerWordmark}
              </p>
            </div>
            <span
              aria-hidden
              className="animate-float absolute right-1 -bottom-5 text-3xl md:text-4xl"
            >
              ⭐
            </span>
          </div>

          {/* ---- Quick navigation ---- */}
          <nav aria-label="Footer">
            <h2 className="text-sm font-semibold text-fg">Quick Navigation</h2>
            <ul className="mt-4 space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClasses}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* ---- Contact information ---- */}
          <div>
            <h2 className="text-sm font-semibold text-fg">Contact Information</h2>
            <ul className="mt-4 space-y-2.5 text-sm text-muted">
              {email ? (
                <li>
                  <a href={`mailto:${email}`} className={linkClasses}>
                    {email}
                  </a>
                </li>
              ) : null}
              {site.phone ? <li>{site.phone}</li> : null}
              {location ? <li>{location}</li> : null}
              <li>
                <Link href="/#contact" className={linkClasses}>
                  Let&apos;s work together
                </Link>
              </li>
            </ul>
          </div>

          {/* ---- Social links ---- */}
          <div>
            <h2 className="text-sm font-semibold text-fg">Social Links</h2>
            <ul className="mt-4 flex items-center gap-3">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="grid size-9 place-items-center rounded-button bg-accent-fill text-on-accent transition-[background-color,transform] duration-200 ease-out-soft hover:-translate-y-0.5 hover:bg-accent-strong"
                  >
                    <social.Icon className="size-4" />
                    <span className="sr-only">{social.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-line pt-6 text-sm text-faint md:mt-14 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {name}
          </p>

          {/* Required reading for a public site in most jurisdictions, and
              always one click from every page. */}
          <nav aria-label="Legal">
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {legal.documents.map((document) => (
                <li key={document.href}>
                  <Link href={document.href} className={linkClasses}>
                    {document.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <p>Built with Next.js &amp; Supabase</p>
        </div>
      </Container>
    </footer>
  );
}
