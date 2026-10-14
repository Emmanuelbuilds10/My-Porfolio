/**
 * Site-wide identity. Values that the admin edits later live in the database
 * (`site_settings`); this object holds the things that must exist before a
 * request is made — metadata, fallbacks and the canonical origin.
 */
export const site = {
  name: "Emmanuel",
  role: "Web developer and designer",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  description:
    "I'm a passionate web developer dedicated to creating innovative web products that enhance user experience.",

  /**
   * Home page. The hero is the portfolio landing; the blog sits behind
   * "Writing" in the navigation.
   */
  heroGreeting: "Hello",
  heroHandle: "Skyzkreative",
  heroTitle: "Building clean, fast websites that people enjoy using.",
  heroSubtitle:
    "I'm Emmanuel, a web developer and designer who builds clean, modern websites for brands that want to look professional and be trusted.",
  /** Small badge above the hero title. */
  availabilityLabel: "Available for work",
  /** Landing section labels (the violet-dot eyebrows). */
  workEyebrow: "Selected Work",
  processEyebrow: "How It Works",
  aboutEyebrow: "Hello",
  testimonialsEyebrow: "Testimonials",
  contactEyebrow: "Contact me",
  /** The headline in the "How it works" section. */
  processHeading: "A straightforward process designed to keep things clear, collaborative, and efficient.",
  /** The headline in the "How it works" section. */
  processSubtitle: "From idea to shipped product — here's how I turn concepts into usable experiences.",
  /** The headline above the testimonial carousel. */
  testimonialsSubtitle: "Here are a few kind words from people I've had the pleasure of working with.",
  /** The headline in the "Selected work" section. */
  workSubtitle:
    "A collection of websites and digital products I've designed and built, useful in the real world.",
  workSubtitleAside: "Real problems. Thoughtful solutions. Designed to be used, not just seen.",
  /** The button under each Selected Work card. */
  caseStudyLabel: "View full case study",
  /**
   * Fallback bio shown in the landing "Hello" section when `site_settings` is
   * not configured. The database copy wins whenever it is present.
   */
  aboutBio: [
    "I'm a UI/UX designer focused on building digital products that are simple, usable, and intentional.",
    "I care about clarity over decoration. For me, good design isn't just about how it looks — it's about how it works, how it feels, and how easily users can achieve their goals.",
    "I enjoy turning rough ideas into structured experiences, refining flows, improving usability, and creating interfaces that make sense. I believe strong products are built at the intersection of user needs, business goals, and thoughtful execution.",
    "Currently, I'm building in public — sharing my process, learning openly, and continuously improving my craft.",
  ],
  /** The call to action in the landing "Hello" section. */
  aboutCtaLabel: "Start a Project",
  /** Contact section copy. */
  contactTitle: "Let's create something great together.",
  contactBody:
    "I'm always open to new projects, collaborations, or just a quick chat about building for the web. Whether you have an idea in mind or need help bringing it to life, reach out. I'd love to hear from you.",
  phone: "+234 8142 052 254",
  location: "Remote",

  /** Headline and hero copy for the inner pages. */
  writingHeroTitle: "The Blog",
  writingHeroSubtitle:
    "I'm a passionate web developer dedicated to creating innovative web products that enhance user experience.",
  projectsHeroSubtitle:
    "Selected work — products, experiments and things I maintain",
  aboutHeroSubtitle: "The person behind the pixels",
  /** Copy for the About page's contact panel. */
  sayHelloTitle: "Say hello",
  sayHelloBody:
    "Open to interesting projects, collaborations, or just talking about building in public.",
  email: "emmanueluwadiegwu10@gmail.com",
  twitterUrl: "https://twitter.com/emmanuel",
  githubUrl: "https://github.com/emmanuel",
  dribbbleUrl: "https://dribbble.com/Skyezkreative",
  linkedinUrl: "https://www.linkedin.com/in/emmanuel",
} as const;

/**
 * Extract the @handle from a Twitter/X profile URL
 * (`https://x.com/handle` or `https://twitter.com/@handle` -> `handle`).
 * Returns null for any other URL, including relative or malformed ones.
 */
export function twitterHandle(url: string): string | null {
  try {
    const { hostname, pathname } = new URL(url);
    if (!/(^|\.)x\.com$|(^|\.)twitter\.com$/.test(hostname)) return null;
    const handle = pathname.split("/")[1]?.replace(/^@/, "");
    return handle || null;
  } catch {
    return null;
  }
}

/**
 * X "Contact" deep link built from the stored profile URL.
 *
 * `messages/compose` is X's official DM deep link; the handle is taken from
 * the admin's Twitter/X URL so the button always points at the current
 * profile. X serves twitter.com links over x.com, and the compose URL also
 * accepts a numeric `recipient_id` — if a handle ever stops resolving, paste
 * the numeric ID (gettable from your X data archive or any ID lookup tool)
 * in its place. When the profile URL is not recognizable the profile link
 * itself is returned, so the button never points at a dead end.
 */
export function xContactUrl(twitterUrl: string): string {
  const handle = twitterHandle(twitterUrl);
  return handle
    ? `https://twitter.com/messages/compose?recipient_id=${handle}`
    : twitterUrl;
}

/**
 * Footer lockup. Kept separate from `site` because it is presentational: the
 * oversized outline wordmark is drawn from the name split across the design.
 */
export const footerWordmark = "Emmanuel";

/**
 * Primary navigation, rendered identically on every public page and reused by
 * the footer's "Quick Navigation". A short list: the landing page, the work
 * archive, about, and the blog. Testimonials, Process and Contact are landing
 * sections only and are intentionally kept out of the nav.
 */
export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/writing", label: "Blog" },
] as const;

/** The four skill chips floating around the hero portrait. */
export const heroSkills = [
  { label: "Framer", position: "top-left" },
  { label: "UX Research", position: "top-right" },
  { label: "Wireframing & Prototyping", position: "mid-left" },
  { label: "UI/UX Design", position: "mid-right" },
  { label: "Design Systems", position: "low-left" },
  { label: "Figma", position: "low-right" },
] as const;

/** The three steps in the home page's "How it works" band. */
export const processSteps = [
  {
    icon: "search",
    title: "Discover",
    description:
      "We talk through your goals, your audience, and what the site needs to do. I plan the pages and structure so we agree on the direction before anything is built.",
  },
  {
    icon: "pen-tool",
    title: "Design & Build",
    description:
      "I design the look and feel around your brand, then build it into a fast, responsive website that works on every screen. You see progress along the way and can give feedback.",
  },
  {
    icon: "rocket",
    title: "Launch & Support",
    description:
      "I test everything, launch the site, and stay available afterward for fixes, updates, and improvements.",
  },
] as const;

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  /** Falls back to the person's initial when there is no portrait. */
  avatarUrl?: string;
}

/**
 * Client quotes. The database has no testimonials table yet, so they live here
 * — the carousel reads the same shape a table would return.
 *
 * Deliberately empty. The three placeholder quotes that used to sit here
 * ("John Doe", "Ada Okafor", "Marco Silva") were invented copy, and publishing
 * fabricated reviews is a deceptive-practice risk in most jurisdictions —
 * including Nigeria's FCCPA and the FTC rules that apply if you sell to the
 * US. Add only quotes you actually received, with the person's permission and
 * their real name and role:
 *
 *   { id: "testimonial-<slug>", name: "…", role: "…", quote: "…" }
 *
 * The section renders nothing while this list is empty, so the landing page
 * just gets shorter until real quotes exist.
 */
export const testimonials: Testimonial[] = [];

/**
 * Contact panel's two quick details. Both come from `site` so the landing page
 * and the footer can never disagree about how to reach him.
 */
export const contactDetails = [
  { icon: "mail", label: "Email", value: site.email, href: `mailto:${site.email}` },
  { icon: "phone", label: "Phone", value: site.phone, href: `tel:${site.phone.replace(/\s+/g, "")}` },
] as const;

/** Footer rows — kept here so the wording can never drift between pages. */
export const footerLinks = [
  { href: "/", label: "Home", external: false },
  { href: "/projects", label: "Work", external: false },
  { href: "/about", label: "About", external: false },
  { href: "/writing", label: "Blog", external: false },
] as const;