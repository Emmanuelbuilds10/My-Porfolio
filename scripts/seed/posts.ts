import { unsplash } from "./data";

/**
 * 12 sample posts. Bodies are real markdown (headings, lists, quotes, code
 * blocks) so the renderer, read-time and highlighting are all exercised.
 */
export interface SeedPost {
  type: "post";
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  category_slug: string;
  tags: string[];
  featured?: boolean;
  published_at: string;
  cover_image_url: string;
}

export const seedPosts: SeedPost[] = [
  {
    type: "post",
    title: "Elevate Your Development Game Today",
    slug: "elevate-your-development-game-today",
    excerpt:
      "As a dedicated web developer, I strive to craft innovative web solutions that truly elevate user experiences.",
    category_slug: "technology",
    tags: ["nextjs", "performance", "craft"],
    featured: true,
    published_at: "2026-08-28T09:00:00Z",
    cover_image_url: unsplash("1461749280684-dccba630e2f6"),
    body: `### Elevate Your Development Game Today: Tips for Web Developers

In the fast-paced world of web development, staying ahead of the curve is essential. Whether you're a seasoned pro or just starting out, there are always new techniques and tools to learn that can enhance your skills and improve your projects.

1. **Embrace Modern Frameworks:** Frameworks like React, Next.js, and Angular can streamline your development process. They offer powerful features that help you build dynamic and responsive applications more efficiently.
2. **Focus on User Experience:** Always keep the user in mind. Conduct user testing and gather feedback to understand how your designs impact usability.
3. **Stay Updated with Trends:** The tech landscape is constantly evolving. Follow industry blogs, attend webinars, and participate in forums to keep your skills sharp.
4. **Optimize Performance:** A fast-loading website is crucial for retaining users. Learn about image compression, lazy loading, and minimizing HTTP requests.
5. **Collaborate and Share Knowledge:** Join developer communities, contribute to open-source projects, and share your insights.
6. **Invest in Continuous Learning:** Take online courses, read books, and attend workshops to expand your knowledge.

By implementing these strategies, you can significantly elevate your development game and create web solutions that not only meet but exceed user expectations.`,
  },
  {
    type: "post",
    title: "Revolutionize Your UI with Us",
    slug: "revolutionize-your-ui-with-us",
    excerpt:
      "Our design team is committed to creating visually stunning interfaces that engage and captivate users.",
    category_slug: "design",
    tags: ["ui", "design-systems"],
    published_at: "2026-09-28T09:00:00Z",
    cover_image_url: unsplash("1526495124232-a04e1849168c"),
    body: `### Interfaces that earn a second look

A good interface disappears. A great one is remembered. The difference is rarely decoration — it is rhythm, contrast and restraint applied consistently across every screen.

### Start with the type scale

Pick a scale, then refuse to break it. Two families and six sizes will carry an entire product further than a drawer full of display faces.

### Colour should have one job per hue

Give every colour a single responsibility: one accent for interaction, one neutral ramp for surfaces, one family for semantics.

### Motion is feedback, not decoration

Animation should explain where something came from and where it went. If a transition cannot be described in a sentence, it is probably hiding a layout problem.`,
  },
  {
    type: "post",
    title: "Boost Your Brand Visibility",
    slug: "boost-your-brand-visibility",
    excerpt:
      "We specialize in strategies that enhance your online presence and drive customer engagement.",
    category_slug: "career",
    tags: ["growth"],
    published_at: "2026-09-26T09:00:00Z",
    cover_image_url: unsplash("1556761175-5973dc0f32e7"),
    body: `### Visibility is a system, not a campaign

Most brands treat visibility as a series of one-off pushes. The teams that compound treat it as a system: a small number of channels, run consistently, measured honestly.

### Pick two channels and go deep

Being adequate everywhere is the same as being invisible everywhere.

### Measure attention, not impressions

Impressions count delivery. Replies, saves and direct traffic count attention. Optimise for the second list and the first one tends to follow.`,
  },
  {
    type: "post",
    title: "Unlock Insights with Data-Driven Decisions",
    slug: "unlock-insights-with-data-driven-decisions",
    excerpt:
      "Our analytics services help businesses harness data to make informed strategic choices.",
    category_slug: "analytics",
    tags: ["data"],
    published_at: "2026-09-24T09:00:00Z",
    cover_image_url: unsplash("1551288049-bebda4e38f71"),
    body: `### From dashboards to decisions

A dashboard that nobody acts on is decoration. The point of analytics is not to know more, it is to be less wrong when you commit.

### Define the decision first

Write down the decision the data is meant to inform. "Should we keep the free tier?" produces a measurable question. "How are we doing?" does not.

### Prefer one honest metric

One metric that the team trusts, with a shared definition and a known way of being wrong, beats a wall of numbers nobody can reconcile.`,
  },
  {
    type: "post",
    title: "Transform Your User Experience with Us",
    slug: "transform-your-user-experience-with-us",
    excerpt:
      "Our talented design team focuses on crafting eye-catching interfaces that engage and inspire users.",
    category_slug: "design",
    tags: ["ux", "research"],
    published_at: "2026-09-21T09:00:00Z",
    cover_image_url: unsplash("1586717791821-3f44a563fa4c"),
    body: `### Experience is what is left after the polish

Users do not experience your colour palette. They experience how quickly they found what they came for, and whether they trusted it enough to finish.

### Watch five people use it

Five sessions will surface the majority of usability problems in a flow.

### Remove, then refine

The fastest way to improve a screen is to delete something from it.`,
  },
  {
    type: "post",
    title: "Elevate Your Brand Awareness",
    slug: "elevate-your-brand-awareness",
    excerpt:
      "We excel in developing strategies that boost your digital footprint and enhance customer interaction.",
    category_slug: "career",
    tags: ["brand"],
    published_at: "2026-09-18T09:00:00Z",
    cover_image_url: unsplash("1493421419110-74f4e85ba126"),
    body: `### Awareness is repetition with a point of view

People remember brands that keep saying the same specific thing. Consistency is not boring; it is the mechanism.

### Say the unglamorous thing

The clearest position is usually the one a competitor would be embarrassed to claim.

### Audit what you actually ship

Your brand is the sum of your emails, invoices, error messages and docs — not just the logo.`,
  },
  {
    type: "post",
    title: "Gain Clarity with Data-Driven Strategies",
    slug: "gain-clarity-with-data-driven-strategies",
    excerpt:
      "Our analytics solutions empower businesses to leverage data for strategic decision-making.",
    category_slug: "analytics",
    tags: ["strategy"],
    published_at: "2026-09-15T09:00:00Z",
    cover_image_url: unsplash("1460925895917-afdab827c52f"),
    body: `### Clarity beats volume

More data does not produce better decisions; better questions do. The work is deciding what would change your mind.

### Instrument the decision, not the page

Track the step where a user commits. Page views tell you where people were; the commit step tells you whether they believed you.

### Write the finding before the chart

Draft the sentence the chart is meant to support. If the sentence is vague, the chart will be too.`,
  },
  {
    type: "post",
    title: "Enhance Your App with Powerful Features",
    slug: "enhance-your-app-with-powerful-features",
    excerpt:
      "Our development team creates scalable applications that improve user experience.",
    category_slug: "software-engineering",
    tags: ["architecture", "scalability"],
    published_at: "2026-09-12T09:00:00Z",
    cover_image_url: unsplash("1555066931-4365d14bab8c"),
    body: `### Features are a budget

Every capability you add is a permanent cost: code to maintain, a surface to test, a concept for a new user to learn.

### Ship the smallest complete thing

A narrow feature that works end to end teaches you more in a week than a broad one that mostly works teaches you in a quarter.

### Make the boring choice

For persistence, queues, auth and payments, pick the option with the most documentation and the fewest novel ideas. Save your novelty for the part users actually notice.

\`\`\`ts
// Deliberately boring persistence choice
const db = postgres(DATABASE_URL, { max: 10 });
\`\`\``,
  },
  {
    type: "post",
    title: "The Reconnect Storm Nobody Tested For",
    slug: "the-reconnect-storm-nobody-tested-for",
    excerpt:
      "Backoff, presence and what happens when every client returns at the same moment.",
    category_slug: "software-engineering",
    tags: ["realtime", "resilience"],
    published_at: "2026-09-09T09:00:00Z",
    cover_image_url: unsplash("1544197150-b99a580bb7a8"),
    body: `### Everyone comes back at once

Your realtime service goes down for ninety seconds. When it returns, every client reconnects in the same instant — and the recovery becomes a second outage.

### Backoff with jitter

Exponential backoff without jitter synchronises your clients. Add randomness to the delay:

\`\`\`ts
const delay = Math.min(base * 2 ** attempt, cap) * (0.5 + Math.random() * 0.5);
\`\`\`

### Presence needs a heartbeat

A client that closed its laptop is not a client that left. Decide how stale presence is allowed to get, and publish that decision.`,
  },
  {
    type: "post",
    title: "Why I Stopped Fighting TypeScript",
    slug: "why-i-stopped-fighting-typescript",
    excerpt:
      "The type errors were not the problem. The shapes I was asking the compiler to accept were.",
    category_slug: "dev-code",
    tags: ["typescript"],
    published_at: "2026-09-06T09:00:00Z",
    cover_image_url: unsplash("1555949963-ff9fe0c870eb"),
    body: `### The error is usually a design smell

When a type error takes an hour to fix, the honest reading is that the data really does have two possible shapes and the code was pretending otherwise.

### Model the states, not the fields

Three optionals that are never all present should be a discriminated union:

\`\`\`ts
type Result =
  | { status: "loading" }
  | { status: "ready"; data: Post[] }
  | { status: "error"; message: string };
\`\`\`

### Let inference do the work

Annotate the boundaries — function arguments and return types — and leave the middle alone.`,
  },
  {
    type: "post",
    title: "Lessons from Shipping My First SaaS",
    slug: "lessons-from-shipping-my-first-saas",
    excerpt:
      "What I would keep, what I would cut, and the two weeks I lost to building a dashboard nobody opened.",
    category_slug: "lessons",
    tags: ["saas", "indie"],
    published_at: "2026-09-03T09:00:00Z",
    cover_image_url: unsplash("1454165804606-c3d57bc86b40"),
    body: `### Billing teaches you the product

Writing the pricing page forces you to say who it is for and what it replaces. I should have written it first.

### The dashboard I built for myself

Two weeks on an internal analytics view, used exactly four times. If a number does not change a decision you make weekly, it does not need a chart.

### Launch small, tell ten people

A quiet launch to ten specific people produced better feedback than three weeks of waiting for a big one.`,
  },
  {
    type: "post",
    title: "Building a Design System That Scales",
    slug: "building-a-design-system-that-scales",
    excerpt:
      "Tokens, primitives and the discipline that keeps an interface consistent as a product grows.",
    category_slug: "dev-code",
    tags: ["design-systems", "tokens"],
    published_at: "2026-08-30T09:00:00Z",
    cover_image_url: unsplash("1507721997478-f9fb627b4a56"),
    body: `### Tokens are the contract

A design system is a set of decisions written down once. Tokens are how those decisions reach every component without being retyped.

### Three layers, no more

Primitives (colour ramps, spacing, radii), semantic tokens (surface, accent, danger) and components. If a component reaches past the semantic layer, the system has started to rot.

### Version it like a product

Breaking a token is a breaking change. Announce it, migrate it, and keep the old name working for one release.

| Layer | Owner | Example |
| --- | --- | --- |
| Primitives | Design | \`violet-500\` |
| Semantic | Design + eng | \`accent\` |
| Component | Engineering | \`<Button>\` |`,
  },
];
