/**
 * Seed data — categories, facts, settings. Posts and projects live in their
 * own files; `scripts/seed.ts` assembles and upserts everything.
 */

export const ADMIN_EMAIL = "emmanuel@example.com";
export const ADMIN_PASSWORD = "change-me-immediately";

/** Unsplash CDN URL for a photo id (hotlinkable, no API key needed). */
export const unsplash = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=80`;

export interface SeedCategory {
  name: string;
  slug: string;
}

export const seedCategories: SeedCategory[] = [
  { name: "Technology", slug: "technology" },
  { name: "Dev & Code", slug: "dev-code" },
  { name: "Design", slug: "design" },
  { name: "Lessons", slug: "lessons" },
  { name: "Software Engineering", slug: "software-engineering" },
  { name: "Analytics", slug: "analytics" },
  { name: "Career", slug: "career" },
  { name: "Tools", slug: "tools" },
];

export interface SeedFact {
  icon: string;
  label: string;
  value: string;
  sort_order: number;
}

export const seedFacts: SeedFact[] = [
  { icon: "map-pin", label: "Based in", value: "Lisbon, Portugal", sort_order: 1 },
  { icon: "graduation-cap", label: "Studies", value: "BSc Computer Science", sort_order: 2 },
  { icon: "code", label: "Currently", value: "Freelance web developer", sort_order: 3 },
  { icon: "briefcase", label: "Experience", value: "6 years building for the web", sort_order: 4 },
  { icon: "heart", label: "Favourite stack", value: "Next.js, TypeScript, Postgres", sort_order: 5 },
  { icon: "book", label: "Now reading", value: "The Pragmatic Programmer", sort_order: 6 },
];

export interface SeedSettings {
  name: string;
  role: string;
  location: string;
  email: string;
  bio: string;
  avatar_url: string;
  twitter_url: string;
  github_url: string;
  behance_url: string;
  linkedin_url: string;
}

export const seedSettings: SeedSettings = {
  name: "Emmanuel",
  role: "Web developer and designer",
  location: "Lisbon, Portugal",
  email: "emmanueluwadiegwu10@gmail.com",
  bio: [
    "I'm a web developer and designer who likes the unglamorous parts of the craft: the type scale nobody notices, the loading state that arrives at the right moment, the query that stopped doing three round trips.",
    "Most of my work is with Next.js, TypeScript and Postgres. I care about interfaces that hold up on a slow phone, and about writing code the next person can change without fear.",
    "This site is where I write up what I learn while building. If something here saves you an afternoon, that's the whole point of publishing it.",
  ].join("\n\n"),
  // Default avatar: the local cut-out portrait so every environment shows the
  // same face (public/images/avatar.png, background removed).
  avatar_url: "/images/avatar.png",
  twitter_url: "https://twitter.com/emmanuel",
  github_url: "https://github.com/emmanuel",
  behance_url: "https://www.behance.net/emmanuel",
  linkedin_url: "https://www.linkedin.com/in/emmanuel",
};

/** Hero artwork for every PageHero until you drop your own file in. */
export const HERO_IMAGE = unsplash("1498050108023-c5249f4df085");
