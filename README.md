This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Admin

The admin lives at `/admin` and is protected three ways: the `src/proxy.ts`
redirect, a re-check inside every Server Action, and the database RLS policies.

Set these in `.env.local`:

- `ADMIN_EMAIL` — the one email allowed in. Must match `app_settings.admin_email`
  (the seed writes it) so the app check and the RLS check agree.
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.

Create the admin user (either works):

1. `npm run seed` — creates an auth user from `ADMIN_EMAIL` / `ADMIN_PASSWORD`
   (defaults in `scripts/seed/data.ts`) and writes the RLS allowlist.
2. Or Supabase dashboard → Authentication → Users → Add user, then set
   `app_settings.admin_email` in the SQL editor.

## Scheduled publishing

A `scheduled` item goes live by itself once `published_at` passes: both the
public queries and the `content_public_read` RLS policy admit `published` **or**
`scheduled` rows whose date has arrived, so no status flip is needed.

Public pages use ISR (`revalidate = 60`), so on a warm deployment a scheduled
item appears within about a minute of its time. For exact-minute publishing, add
a cron (Supabase `pg_cron` or a Vercel Cron) that runs
`revalidatePath('/writing')` / `revalidatePath('/projects')`, or flips
`publish_status` to `published` at the scheduled time.
