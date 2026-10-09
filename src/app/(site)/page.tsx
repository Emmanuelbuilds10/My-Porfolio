import type { Metadata } from "next";
import { PortfolioHero } from "@/components/content/PortfolioHero";
import { SelectedWork } from "@/components/content/SelectedWork";
import { HowItWorks } from "@/components/content/HowItWorks";
import { AboutPreview } from "@/components/content/AboutPreview";
import { Testimonials } from "@/components/content/Testimonials";
import { ContactSection } from "@/components/content/ContactSection";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  // `absolute` opts out of the root layout's `%s — Emmanuel` template.
  title: { absolute: `${site.name} — ${site.role}` },
  description: site.description,
  alternates: { canonical: "/" },
};

/**
 * Landing page. A single scrolling pitch — hero, selected work, process,
 * about, testimonials, contact — with the writing/blog kept on `/writing`,
 * reached from the "Blog" nav item.
 */
export default function HomePage() {
  return (
    <>
      <PortfolioHero />
      <SelectedWork />
      <HowItWorks />
      <AboutPreview />
      <Testimonials />
      <ContactSection />
    </>
  );
}
