import type { Metadata } from "next";
import { cache } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { CoverImage } from "@/components/ui/CoverImage";
import { TagPill } from "@/components/ui/TagPill";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContentGallery } from "@/components/content/ContentGallery";
import { Markdown } from "@/components/content/Markdown";
import { PostCard } from "@/components/content/PostCard";
import { AuthorCard } from "@/components/content/AuthorCard";
import { ContactOnXButton, CopyLinkButton } from "@/components/content/DetailActions";
import { formatPostMeta } from "@/lib/format";
import {
  getPostBySlug,
  getPublishedPostSlugs,
  getRelatedPosts,
  getSiteSettings,
} from "@/lib/queries";
import { site, xContactUrl } from "@/lib/site";

/** ISR: a published post re-renders at most once a minute. */
export const revalidate = 60;

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

/** Dedupe the lookup shared by `generateMetadata` and the page render. */
const getPost = cache(getPostBySlug);

export async function generateStaticParams() {
  const slugs = await getPublishedPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return { title: "Post not found", robots: { index: false, follow: false } };
  }

  const path = `/writing/${post.slug}`;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: path,
      publishedTime: post.publishedAt ?? undefined,
      images: post.coverImageUrl ? [{ url: post.coverImageUrl, alt: post.title }] : undefined,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const [related, settings] = await Promise.all([
    getRelatedPosts(post.id, post.category?.id ?? null, 3),
    getSiteSettings(),
  ]);
  const contactHref = xContactUrl(settings ? settings.twitterUrl : site.twitterUrl);

  return (
    <article className="pb-section">
      <Container>
        <div className="max-w-[760px] pt-16">
          <Link
            href="/writing"
            className="inline-flex items-center gap-2 text-sm text-muted transition-colors duration-200 hover:text-accent-text"
          >
            <ArrowLeft aria-hidden className="size-4" />
            All writing
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {post.publishedAt ? (
              <time
                dateTime={post.publishedAt}
                className="text-[11px] font-medium tracking-[0.14em] text-faint uppercase"
              >
                {formatPostMeta(post.publishedAt, post.readTime)}
              </time>
            ) : null}
            {post.category ? <TagPill>{post.category.name}</TagPill> : null}
          </div>

          <h1 className="mt-5 font-serif text-[clamp(1.9rem,4.5vw,3rem)] leading-[1.1] text-fg">
            {post.title}
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted">{post.excerpt}</p>
        </div>
      </Container>

      <Container className="mt-10">
        <CoverImage
          src={post.coverImageUrl}
          alt={`Cover for “${post.title}”`}
          ratio="cover"
          priority
          sizes="(min-width: 1240px) 1240px, 100vw"
        />
      </Container>

      <Container size="prose" className="mt-12">
        <Markdown content={post.body} />
      </Container>

      {post.gallery.length > 0 ? (
        <Container className="mt-12">
          <ContentGallery images={post.gallery} title={post.title} />
        </Container>
      ) : null}

      <Container size="prose" className="mt-section">
        <AuthorCard
          name={settings?.name ?? site.name}
          role={settings?.role ?? site.role}
          avatarUrl={settings?.avatarUrl ?? null}
        >
          <ContactOnXButton href={contactHref} />
          <CopyLinkButton />
        </AuthorCard>
      </Container>

      {related.length > 0 ? (
        <Container className="mt-section">
          <SectionHeading title="More like this" />
          <div className="mt-8 grid gap-card sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item, index) => (
              <PostCard key={item.id} post={item} priority={index === 0} />
            ))}
          </div>
        </Container>
      ) : null}
    </article>
  );
}
