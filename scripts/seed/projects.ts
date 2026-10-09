import { unsplash } from "./data";

/** 6 sample projects with case-study bodies and Unsplash covers. */
export interface SeedProject {
  type: "project";
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  tech_stack: string[];
  live_url: string | null;
  repo_url: string | null;
  project_status: "live" | "in-progress" | "archived";
  featured?: boolean;
  published_at: string;
  cover_image_url: string;
}

export const seedProjects: SeedProject[] = [
  {
    type: "project",
    title: "Emmanuel — Portfolio & Blog",
    slug: "emmanuel-portfolio",
    excerpt:
      "The site you're reading: Next.js App Router, a single-table CMS, Supabase auth and a unified post/project editor.",
    tech_stack: ["Next.js", "TypeScript", "Tailwind", "Supabase"],
    live_url: "https://example.com",
    repo_url: "https://github.com/emmanuel/portfolio",
    project_status: "live",
    featured: true,
    published_at: "2026-09-20T09:00:00Z",
    cover_image_url: unsplash("1467232004584-a241de8bcf5d"),
    body: `### Why it exists

I wanted a place to write that I fully controlled, with an admin that does not fight me when I want to publish a project instead of a post.

### One table, two types

Posts and projects share a single \`content\` table with a \`type\` column. The editor switches which fields it shows, and the index pages filter by type. Sharing the row means tags, covers, scheduling and the publishing workflow only have to be written once.

\`\`\`sql
select title, type, publish_status
from content
where publish_status = 'published'
order by published_at desc;
\`\`\``,
  },
  {
    type: "project",
    title: "Pigment",
    slug: "pigment",
    excerpt:
      "A design-token pipeline that turns one JSON source into Tailwind config, CSS variables and Figma variables.",
    tech_stack: ["TypeScript", "Node", "Tailwind", "Figma API"],
    live_url: "https://example.com/pigment",
    repo_url: "https://github.com/emmanuel/pigment",
    project_status: "live",
    featured: true,
    published_at: "2026-07-11T09:00:00Z",
    cover_image_url: unsplash("1502691876148-a84978e59af8"),
    body: `### The problem

Every project ended up with a slightly different violet, and nobody could tell which one was correct.

### The fix

One \`tokens.json\` is the source of truth. A small build step emits the Tailwind theme, the CSS custom properties and the Figma variables, so all three agree by construction.

\`\`\`bash
npx pigment build --watch
\`\`\``,
  },
  {
    type: "project",
    title: "Digest",
    slug: "digest",
    excerpt:
      "A tiny service that turns an RSS folder into a weekly email, with a summary you can actually skim.",
    tech_stack: ["Node", "Postgres", "Resend"],
    live_url: null,
    repo_url: "https://github.com/emmanuel/digest",
    project_status: "in-progress",
    published_at: "2026-06-02T09:00:00Z",
    cover_image_url: unsplash("1499750310107-5fef28a66643"),
    body: `### In progress

Running it for my own reading list first. If it survives a month of my own use, it gets a landing page.

### Design notes

The digest is deliberately boring: title, two-line summary, link. No images, no tracking pixels, one send per week.`,
  },
  {
    type: "project",
    title: "Atlas Board",
    slug: "atlas-board",
    excerpt:
      "A kanban board that treats keyboard navigation as the primary interface, not an accessibility afterthought.",
    tech_stack: ["React", "TypeScript", "Postgres"],
    live_url: "https://example.com/atlas",
    repo_url: null,
    project_status: "live",
    published_at: "2026-05-14T09:00:00Z",
    cover_image_url: unsplash("1611224923853-80b023f02d71"),
    body: `### Keyboard first

Every interaction — moving cards, switching boards, editing titles — is reachable without a mouse, and the shortcuts are discoverable from a single overlay.

### Optimistic, then honest

Card moves apply instantly on the client and reconcile with the server. When reconciliation fails, the board tells you rather than silently reverting.`,
  },
  {
    type: "project",
    title: "Ledger Lite",
    slug: "ledger-lite",
    excerpt:
      "Double-entry bookkeeping for freelancers who find real accounting software to be a second job.",
    tech_stack: ["Next.js", "Postgres", "Plaid API"],
    live_url: null,
    repo_url: "https://github.com/emmanuel/ledger-lite",
    project_status: "in-progress",
    published_at: "2026-04-08T09:00:00Z",
    cover_image_url: unsplash("1554224155-6726b3ff858f"),
    body: `### The insight

Freelancers do not want accounting software. They want to know whether they can afford to say no to the next invoice.

### Scope discipline

No invoices, no client portal, no payroll. Bank sync in, one screen out: what came in, what went out, what is set aside for tax.`,
  },
  {
    type: "project",
    title: "Static Notes",
    slug: "static-notes",
    excerpt:
      "My previous blog: a hand-rolled static site generator written before I understood why frameworks exist.",
    tech_stack: ["Ruby", "Rake", "Markdown"],
    live_url: null,
    repo_url: "https://github.com/emmanuel/static-notes",
    project_status: "archived",
    published_at: "2026-03-01T09:00:00Z",
    cover_image_url: unsplash("1517842645767-c639042777db"),
    body: `### Archived

Kept for the write-ups. Superseded by this site.

### What it taught me

Reinventing pagination, feeds and incremental builds once is a fine education. Doing it twice is a decision to stop learning the wrong lessons.`,
  },
];
