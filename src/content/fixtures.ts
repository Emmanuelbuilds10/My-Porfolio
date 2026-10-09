import { estimateReadTime } from "@/lib/format";
import type { Category, ContentItem, Fact, SiteSettings } from "@/lib/types";

/**
 * Sample content.
 *
 * This file is the single source for both the Phase 1 UI and the Phase 2 seed
 * script (`supabase/seed.ts`), so the site looks identical before and after the
 * database is connected. Cover images follow one convention:
 *
 *     /images/covers/<slug>.jpg
 *
 * Drop a file at that path and it appears; until then `CoverImage` draws its
 * violet placeholder.
 */

const cover = (slug: string) => `/images/covers/${slug}.jpg`;

export const categories: Category[] = [
  // The ten chips shown in the Writing page design, in design order.
  { id: "cat-technology", name: "Technology", slug: "technology" },
  { id: "cat-dev-code", name: "Dev & Code", slug: "dev-code" },
  { id: "cat-lessons", name: "Lessons", slug: "lessons" },
  {
    id: "cat-programming-development",
    name: "Programming & Development",
    slug: "programming-development",
  },
  {
    id: "cat-learning-experiences",
    name: "Learning Experiences",
    slug: "learning-experiences",
  },
  {
    id: "cat-innovative-solutions",
    name: "Innovative Solutions",
    slug: "innovative-solutions",
  },
  { id: "cat-tech-innovations", name: "Tech Innovations", slug: "tech-innovations" },
  {
    id: "cat-software-engineering",
    name: "Software Engineering",
    slug: "software-engineering",
  },
  {
    id: "cat-educational-insights",
    name: "Educational Insights",
    slug: "educational-insights",
  },
  // Categories that appear on post cards.
  { id: "cat-design", name: "Design", slug: "design" },
  { id: "cat-marketing", name: "Marketing", slug: "marketing" },
  { id: "cat-analytics", name: "Analytics", slug: "analytics" },
  {
    id: "cat-creative-solutions",
    name: "Creative Solutions",
    slug: "creative-solutions",
  },
  { id: "cat-brand-strategy", name: "Brand Strategy", slug: "brand-strategy" },
  { id: "cat-data-insights", name: "Data Insights", slug: "data-insights" },
  {
    id: "cat-software-development",
    name: "Software Development",
    slug: "software-development",
  },
  { id: "cat-digital-marketing", name: "Digital Marketing", slug: "digital-marketing" },
  { id: "cat-data-analytics", name: "Data Analytics", slug: "data-analytics" },
  {
    id: "cat-business-consulting",
    name: "Business Consulting",
    slug: "business-consulting",
  },
];

const categoryBySlug = new Map(categories.map((category) => [category.slug, category]));
const category = (slug: string): Category => {
  const found = categoryBySlug.get(slug);
  if (!found) throw new Error(`Unknown category slug in fixtures: ${slug}`);
  return found;
};

/** Shared defaults so a post only declares the fields that differ. */
function makeContent(
  seed: Pick<ContentItem, "id" | "type" | "title" | "slug" | "excerpt" | "body"> &
    Partial<Omit<ContentItem, "id" | "type" | "title" | "slug" | "excerpt" | "body">>,
): ContentItem {
  const { id, type, title, slug, excerpt, body, ...rest } = seed;
  const publishedAt = rest.publishedAt ?? null;
  const timestamp = publishedAt ?? "2026-08-01T09:00:00.000Z";

  return {
    id,
    type,
    title,
    slug,
    excerpt,
    body,
    coverImageUrl: cover(slug),
    category: null,
    tags: [],
    techStack: [],
    liveUrl: null,
    repoUrl: null,
    projectStatus: null,
    featured: false,
    publishStatus: "published",
    publishedAt,
    readTime: estimateReadTime(body),
    createdAt: timestamp,
    updatedAt: timestamp,
    ...rest,
  };
}

export const posts: ContentItem[] = [
  makeContent({
    id: "post-elevate-development",
    type: "post",
    title: "Elevate Your Development Game Today",
    slug: "elevate-your-development-game-today",
    excerpt:
      "As a dedicated web developer, I strive to craft innovative web solutions that truly elevate user experiences.",
    category: category("technology"),
    tags: ["nextjs", "performance", "craft"],
    featured: true,
    publishedAt: "2026-08-28T09:00:00.000Z",
    body: `### Elevate Your Development Game Today: Tips for Web Developers

In the fast-paced world of web development, staying ahead of the curve is essential. Whether you're a seasoned pro or just starting out, there are always new techniques and tools to learn that can enhance your skills and improve your projects. Here are some key strategies to elevate your development game today:

1. **Embrace Modern Frameworks:** Frameworks like React, Next.js, and Angular can streamline your development process. They offer powerful features that help you build dynamic and responsive applications more efficiently.
2. **Focus on User Experience:** Always keep the user in mind. Conduct user testing and gather feedback to understand how your designs impact usability. Small tweaks can lead to significant improvements in user satisfaction.
3. **Stay Updated with Trends:** The tech landscape is constantly evolving. Follow industry blogs, attend webinars, and participate in forums to keep your skills sharp and stay informed about the latest trends.
4. **Optimize Performance:** A fast-loading website is crucial for retaining users. Learn about performance optimization techniques, such as image compression, lazy loading, and minimizing HTTP requests.
5. **Collaborate and Share Knowledge:** Join developer communities, contribute to open-source projects, and share your insights. Collaboration can lead to new ideas and approaches that can enhance your work.
6. **Invest in Continuous Learning:** Take online courses, read books, and attend workshops to expand your knowledge. The more you learn, the more versatile and valuable you become as a developer.

By implementing these strategies, you can significantly elevate your development game and create web solutions that not only meet but exceed user expectations.`,
  }),
  makeContent({
    id: "post-revolutionize-ui",
    type: "post",
    title: "Revolutionize Your UI with Us",
    slug: "revolutionize-your-ui-with-us",
    excerpt:
      "Our design team is committed to creating visually stunning interfaces that engage and captivate users.",
    category: category("design"),
    tags: ["ui", "design-systems"],
    publishedAt: "2026-09-28T09:00:00.000Z",
    body: `### Interfaces that earn a second look

A good interface disappears. A great one is remembered. The difference is rarely decoration — it is rhythm, contrast and restraint applied consistently across every screen.

### Start with the type scale

Pick a scale, then refuse to break it. Two families and six sizes will carry an entire product further than a drawer full of display faces. When a heading needs emphasis, change its weight before you change its size.

### Colour should have one job per hue

Give every colour a single responsibility: one accent for interaction, one neutral ramp for surfaces, one family for semantics. When a hue has two jobs, users cannot tell which one it is doing.

### Motion is feedback, not decoration

Animation should explain where something came from and where it went. If a transition cannot be described in a sentence, it is probably hiding a layout problem instead of solving one.`,
  }),
  makeContent({
    id: "post-boost-brand-visibility",
    type: "post",
    title: "Boost Your Brand Visibility",
    slug: "boost-your-brand-visibility",
    excerpt:
      "We specialize in strategies that enhance your online presence and drive customer engagement.",
    category: category("marketing"),
    tags: ["growth"],
    publishedAt: "2026-09-26T09:00:00.000Z",
    body: `### Visibility is a system, not a campaign

Most brands treat visibility as a series of one-off pushes. The teams that compound treat it as a system: a small number of channels, run consistently, measured honestly.

### Pick two channels and go deep

Being adequate everywhere is the same as being invisible everywhere. Choose the two channels where your audience already spends attention and publish there until you are unmistakably good at them.

### Measure attention, not impressions

Impressions count delivery. Replies, saves, replies-to-replies and direct traffic count attention. Optimise for the second list and the first one tends to follow.`,
  }),
  makeContent({
    id: "post-unlock-insights",
    type: "post",
    title: "Unlock Insights with Data-Driven Decisions",
    slug: "unlock-insights-with-data-driven-decisions",
    excerpt:
      "Our analytics services help businesses harness data to make informed strategic choices.",
    category: category("analytics"),
    tags: ["data"],
    publishedAt: "2026-09-24T09:00:00.000Z",
    body: `### From dashboards to decisions

A dashboard that nobody acts on is decoration. The point of analytics is not to know more, it is to be less wrong when you commit.

### Define the decision first

Write down the decision the data is meant to inform. "Should we keep the free tier?" produces a measurable question. "How are we doing?" does not.

### Prefer one honest metric

One metric that the team trusts, with a shared definition and a known way of being wrong, beats a wall of numbers nobody can reconcile.`,
  }),
  makeContent({
    id: "post-transform-ux",
    type: "post",
    title: "Transform Your User Experience with Us",
    slug: "transform-your-user-experience-with-us",
    excerpt:
      "Our talented design team focuses on crafting eye-catching interfaces that engage and inspire users.",
    category: category("creative-solutions"),
    tags: ["ux", "research"],
    publishedAt: "2026-09-21T09:00:00.000Z",
    body: `### Experience is what is left after the polish

Users do not experience your colour palette. They experience how quickly they found what they came for, and whether they trusted it enough to finish.

### Watch five people use it

Five sessions will surface the majority of usability problems in a flow. You do not need a lab — you need the willingness to watch someone fail without helping.

### Remove, then refine

The fastest way to improve a screen is to delete something from it. Refinement is only worth doing on the elements that survive that cut.`,
  }),
  makeContent({
    id: "post-elevate-brand-awareness",
    type: "post",
    title: "Elevate Your Brand Awareness",
    slug: "elevate-your-brand-awareness",
    excerpt:
      "We excel in developing strategies that boost your digital footprint and enhance customer interaction.",
    category: category("brand-strategy"),
    tags: ["brand"],
    publishedAt: "2026-09-18T09:00:00.000Z",
    body: `### Awareness is repetition with a point of view

People remember brands that keep saying the same specific thing. Consistency is not boring; it is the mechanism.

### Say the unglamorous thing

The clearest position is usually the one a competitor would be embarrassed to claim. "We are the slow, expensive, careful option" is a strategy. "We are innovative" is a shrug.

### Audit what you actually ship

Your brand is the sum of your emails, invoices, error messages and docs — not just the logo. Fix the surfaces nobody owns.`,
  }),
  makeContent({
    id: "post-gain-clarity",
    type: "post",
    title: "Gain Clarity with Data-Driven Strategies",
    slug: "gain-clarity-with-data-driven-strategies",
    excerpt:
      "Our analytics solutions empower businesses to leverage data for strategic decision-making.",
    category: category("data-insights"),
    tags: ["strategy"],
    publishedAt: "2026-09-15T09:00:00.000Z",
    body: `### Clarity beats volume

More data does not produce better decisions; better questions do. The work is deciding what would change your mind.

### Instrument the decision, not the page

Track the step where a user commits. Page views tell you where people were; the commit step tells you whether they believed you.

### Write the finding before the chart

Draft the sentence the chart is meant to support. If the sentence is vague, the chart will be too.`,
  }),
  makeContent({
    id: "post-enhance-app-features",
    type: "post",
    title: "Enhance Your App with Powerful Features",
    slug: "enhance-your-app-with-powerful-features",
    excerpt:
      "Our development team creates scalable applications that improve user experience.",
    category: category("software-development"),
    tags: ["architecture", "scalability"],
    publishedAt: "2026-09-12T09:00:00.000Z",
    body: `### Features are a budget

Every capability you add is a permanent cost: code to maintain, a surface to test, a concept for a new user to learn. Spend that budget deliberately.

### Ship the smallest complete thing

A narrow feature that works end to end teaches you more in a week than a broad one that mostly works teaches you in a quarter.

### Make the boring choice

For persistence, queues, auth and payments, pick the option with the most documentation and the fewest novel ideas. Save your novelty for the part users actually notice.`,
  }),
  makeContent({
    id: "post-brands-visibility",
    type: "post",
    title: "Elevate Your Brand's Visibility",
    slug: "elevate-your-brands-visibility",
    excerpt:
      "We focus on strategies that boost your online presence and increase customer engagement.",
    category: category("digital-marketing"),
    tags: ["seo", "content"],
    publishedAt: "2026-09-09T09:00:00.000Z",
    body: `### Own the questions, not the keywords

Search rewards the page that answers the question best. Write for the question a person typed, in the order they asked it.

### Technical hygiene first

Fast pages, descriptive titles, one canonical URL and a sitemap that matches reality. None of it is exciting and all of it compounds.

### Content that outlives the launch

A page that answers a durable question keeps earning attention for years. A launch announcement is a spike. You need both, in that ratio.`,
  }),
  makeContent({
    id: "post-insights-through-data",
    type: "post",
    title: "Gain Insights Through Data-Driven Decisions",
    slug: "gain-insights-through-data-driven-decisions",
    excerpt:
      "Our analytics services empower businesses to leverage data for informed strategic decisions.",
    category: category("data-analytics"),
    tags: ["metrics"],
    publishedAt: "2026-09-06T09:00:00.000Z",
    body: `### Decisions have a shelf life

Analysis is only useful while the decision is still open. Express findings with a deadline attached, or they become trivia.

### Segment before you average

Averages hide the two groups whose behaviour differs. Split by cohort, plan or channel before drawing a conclusion from a single number.

### Keep a decision log

Record what you decided, what you expected and what happened. Six months later it is the most valuable document your team owns.`,
  }),
  makeContent({
    id: "post-revolutionize-business",
    type: "post",
    title: "Revolutionize Your Business with Guidance",
    slug: "revolutionize-your-business-with-guidance",
    excerpt:
      "We offer customized consulting services to assist organizations in overcoming challenges.",
    category: category("business-consulting"),
    tags: ["consulting"],
    publishedAt: "2026-09-03T09:00:00.000Z",
    body: `### Consulting is borrowed focus

An outsider's main value is not knowledge; it is attention that is not already spent on the day job.

### Diagnose before prescribing

Most briefs describe a symptom. The first two weeks should be spent finding the constraint, because the constraint is rarely where the brief says it is.

### Leave the system behind

The engagement is a success when the team can run the practice without you: a written process, an owner, and a review cadence.`,
  }),
  makeContent({
    id: "post-turn-data-into-decisions",
    type: "post",
    title: "Turn Data Into Decisions",
    slug: "turn-data-into-decisions",
    excerpt:
      "Our analytics services help businesses harness data to make informed and strategic choices.",
    category: category("data-analytics"),
    tags: ["experimentation"],
    publishedAt: "2026-08-30T09:00:00.000Z",
    body: `### Experiments answer what opinions cannot

If two reasonable people disagree, that is a signal to run a test rather than schedule another meeting.

### Decide the threshold in advance

Write down the effect size that would justify the change before you look at the results. Otherwise every result is ambiguous.

### Losing experiments are assets

A well-run test that fails eliminates a hypothesis permanently. Document it, or you will run it again next year.`,
  }),
  makeContent({
    id: "post-design-system-scales",
    type: "post",
    title: "Building a Design System That Scales",
    slug: "building-a-design-system-that-scales",
    excerpt:
      "Tokens, primitives and the discipline that keeps an interface consistent as a product grows.",
    category: category("software-engineering"),
    tags: ["design-systems", "tokens"],
    publishedAt: "2026-08-22T09:00:00.000Z",
    body: `### Tokens are the contract

A design system is a set of decisions written down once. Tokens are how those decisions reach every component without being retyped.

### Three layers, no more

Primitives (colour ramps, spacing, radii), semantic tokens (surface, accent, danger) and components. If a component reaches past the semantic layer into a primitive, the system has already started to rot.

### Version it like a product

Breaking a token is a breaking change. Announce it, migrate it, and keep the old name working for one release.`,
  }),
  makeContent({
    id: "post-typescript-lessons",
    type: "post",
    title: "Why I Stopped Fighting TypeScript",
    slug: "why-i-stopped-fighting-typescript",
    excerpt:
      "The type errors were not the problem. The shapes I was asking the compiler to accept were.",
    category: category("dev-code"),
    tags: ["typescript"],
    publishedAt: "2026-08-18T09:00:00.000Z",
    body: `### The error is usually a design smell

When a type error takes an hour to fix, the honest reading is that the data really does have two possible shapes and the code was pretending otherwise.

### Model the states, not the fields

Three optionals that are never all present should be a discriminated union. The compiler then enforces the rule you were only keeping in your head.

### Let inference do the work

Annotating what TypeScript can already infer adds noise without adding safety. Annotate the boundaries — function arguments and return types — and leave the middle alone.`,
  }),
  makeContent({
    id: "post-first-saas-lessons",
    type: "post",
    title: "Lessons from Shipping My First SaaS",
    slug: "lessons-from-shipping-my-first-saas",
    excerpt:
      "What I would keep, what I would cut, and the two weeks I lost to building a dashboard nobody opened.",
    category: category("lessons"),
    tags: ["saas", "indie"],
    publishedAt: "2026-08-14T09:00:00.000Z",
    body: `### Billing teaches you the product

Writing the pricing page forces you to say who it is for and what it replaces. I should have written it first.

### The dashboard I built for myself

Two weeks on an internal analytics view, used exactly four times. If a number does not change a decision you make weekly, it does not need a chart.

### Launch small, tell ten people

A quiet launch to ten specific people produced better feedback than three weeks of waiting for a big one.`,
  }),

  /* ---------------------------------------------------------------------- *
   * Non-published rows. These prove the visibility rules: neither appears in
   * any public list, and `getContentBySlug` must refuse the draft.
   * ---------------------------------------------------------------------- */
  makeContent({
    id: "post-draft-edge-caching",
    type: "post",
    title: "Edge Caching Without the Surprises",
    slug: "edge-caching-without-the-surprises",
    excerpt: "A working note on cache keys, invalidation and the bugs that follow.",
    category: category("technology"),
    publishStatus: "draft",
    publishedAt: null,
    body: `### Draft

Notes on cache keys, stale-while-revalidate and the two invalidation bugs that cost me a weekend. Not finished.`,
  }),
  makeContent({
    id: "post-scheduled-realtime",
    type: "post",
    title: "Realtime Without the Reconnect Storm",
    slug: "realtime-without-the-reconnect-storm",
    excerpt:
      "Backoff, presence and what happens when every client returns at the same moment.",
    category: category("tech-innovations"),
    publishStatus: "scheduled",
    publishedAt: "2026-12-01T09:00:00.000Z",
    body: `### Scheduled

On exponential backoff with jitter, presence channels, and designing a reconnect path that does not take the database down with it.`,
  }),
];

export const projects: ContentItem[] = [
  makeContent({
    id: "project-portfolio",
    type: "project",
    title: "Emmanuel — Portfolio & Blog",
    slug: "emmanuel-portfolio",
    excerpt:
      "The site you are reading: a Next.js App Router build with a single-table CMS, Supabase auth and a unified post/project editor.",
    techStack: ["Next.js", "TypeScript", "Tailwind", "Supabase", "Framer Motion"],
    liveUrl: "https://example.com",
    repoUrl: "https://github.com/emmanuel/portfolio",
    projectStatus: "live",
    publishedAt: "2026-09-20T09:00:00.000Z",
    body: `### Why it exists

I wanted a place to write that I fully controlled, with an admin that does not fight me when I want to publish a project instead of a post.

### One table, two types

Posts and projects share a single \`content\` table with a \`type\` column. The editor switches which fields it shows, and the index pages filter by type. Sharing the row means tags, covers, scheduling and the publishing workflow only have to be written once.

### What I would do differently

I would add the newsletter before the third feature, not after the eighth.`,
  }),
  makeContent({
    id: "project-tokenizer",
    type: "project",
    title: "Pigment",
    slug: "pigment",
    excerpt:
      "A design-token pipeline that turns one JSON source into Tailwind theme config, CSS variables and Figma variables.",
    techStack: ["TypeScript", "Node", "Tailwind", "Figma API"],
    liveUrl: "https://example.com/pigment",
    repoUrl: "https://github.com/emmanuel/pigment",
    projectStatus: "live",
    publishedAt: "2026-07-11T09:00:00.000Z",
    body: `### The problem

Every project ended up with a slightly different violet, and nobody could tell which one was correct.

### The fix

One \`tokens.json\` is the source of truth. A small build step emits the Tailwind theme, the CSS custom properties and the Figma variables, so all three agree by construction.

### Usage

\`\`\`bash
npx pigment build --watch
\`\`\``,
  }),
  makeContent({
    id: "project-maildigest",
    type: "project",
    title: "Digest",
    slug: "digest",
    excerpt:
      "A tiny service that turns an RSS folder into a weekly email, with a summary you can actually skim.",
    techStack: ["Node", "Postgres", "Resend", "Cron"],
    repoUrl: "https://github.com/emmanuel/digest",
    projectStatus: "in-progress",
    publishedAt: "2026-06-02T09:00:00.000Z",
    body: `### In progress

Running it for my own reading list first. If it survives a month of my own use, it gets a landing page.

### Design notes

The digest is deliberately boring: title, two-line summary, link. No images, no tracking pixels, one send per week.`,
  }),
  makeContent({
    id: "project-old-blog",
    type: "project",
    title: "Static Notes",
    slug: "static-notes",
    excerpt:
      "My previous blog: a hand-rolled static site generator written before I understood why frameworks exist.",
    techStack: ["Ruby", "Rake", "Markdown"],
    repoUrl: "https://github.com/emmanuel/static-notes",
    projectStatus: "archived",
    publishStatus: "draft",
    publishedAt: null,
    body: `### Archived

Kept for the write-ups. Superseded by this site.`,
  }),
];

export const facts: Fact[] = [
  { id: "fact-based-in", icon: "map-pin", label: "Based in", value: "Remote", order: 1 },
  {
    id: "fact-studies",
    icon: "graduation-cap",
    label: "Studies",
    value: "BSc Computer Science",
    order: 2,
  },
  {
    id: "fact-focus",
    icon: "briefcase",
    label: "Currently",
    value: "Freelance web developer",
    order: 3,
  },
  {
    id: "fact-experience",
    icon: "clock",
    label: "Experience",
    value: "6 years building for the web",
    order: 4,
  },
  {
    id: "fact-stack",
    icon: "sparkles",
    label: "Favourite stack",
    value: "Next.js, TypeScript, Postgres",
    order: 5,
  },
  { id: "fact-fuelled-by", icon: "coffee", label: "Fuelled by", value: "Flat whites", order: 6 },
];

export const siteSettings: SiteSettings = {
  name: "Emmanuel",
  role: "Web developer and designer",
  location: "Remote",
  bioParagraphs: [
    "I'm a web developer and designer who likes the unglamorous parts of the craft: the type scale nobody notices, the loading state that arrives at the right moment, the query that stopped doing three round trips.",
    "Most of my work is with Next.js, TypeScript and Postgres. I care about interfaces that hold up on a slow phone, and about writing code that the next person can change without fear.",
    "This site is where I write up what I learn while building. If something here saves you an afternoon, that's the whole point of publishing it.",
  ],
  avatarUrl: "/images/avatar.png",
  email: "hello@example.com",
  twitterUrl: "https://twitter.com/emmanuel",
  githubUrl: "https://github.com/emmanuel",
  behanceUrl: "https://www.behance.net/emmanuel",
  linkedinUrl: "https://www.linkedin.com/in/emmanuel",
};

/** Site-wide hero artwork — one file, used by every PageHero. */
export const heroImageUrl = "/images/hero.jpg";
