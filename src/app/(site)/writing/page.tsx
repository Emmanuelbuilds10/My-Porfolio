import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { SearchInput } from "@/components/ui/SearchInput";
import { CategoryChip } from "@/components/ui/CategoryChip";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { PostCard } from "@/components/content/PostCard";
import { FeaturedPost } from "@/components/content/FeaturedPost";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { HERO_ART } from "@/lib/hero-image";
import { buildQueryHref, firstParam, PAGE_SIZE, parsePage } from "@/lib/pagination";
import { getCategories, getFeaturedPost, getPosts } from "@/lib/queries";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Writing",
  description: site.writingHeroSubtitle,
  alternates: { canonical: "/writing" },
};

interface WritingPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function WritingPage({ searchParams }: WritingPageProps) {
  const params = await searchParams;
  const category = firstParam(params.category);
  const q = firstParam(params.q).trim();
  const page = parsePage(params.page);

  const [categories, featured] = await Promise.all([getCategories(), getFeaturedPost()]);
  let result = await getPosts({ category, q, page, pageSize: PAGE_SIZE });
  // `?page=` beyond the last page: refetch inside the real range instead of
  // rendering an empty grid.
  if (result.total > 0 && page > result.totalPages) {
    result = await getPosts({ category, q, page: result.totalPages, pageSize: PAGE_SIZE });
  }

  const { items, total, totalPages, page: currentPage } = result;
  const filtered = Boolean(category || q);
  /** The promoted post heads the unfiltered first page only. */
  const showFeatured = !filtered && currentPage === 1 && featured !== null;
  /**
   * Once the promoted post is up top, it comes out of the grid so the same
   * entry is not listed twice. It is still the newest row of page one either
   * way, so nothing drops out of the archive.
   */
  const gridPosts =
    showFeatured && featured ? items.filter((item) => item.id !== featured.id) : items;

  return (
    <>
      <PageHero
        title="Writing"
        subtitle={site.writingHeroSubtitle}
        imageUrl={HERO_ART.writing}
        priority
      />

      {showFeatured && featured ? (
        <Container className="mt-section">
          {/* A real heading, not a decorative label: this is the one entry on
              the page that is promoted, and the label is what tells a reader
              (and a crawler) that. */}
          <Eyebrow as="h2">Featured Post</Eyebrow>
          <Reveal className="mt-6">
            <FeaturedPost post={featured} />
          </Reveal>
        </Container>
      ) : null}

      <Container className={showFeatured && featured ? "mt-stack" : "mt-section"}>
        <div className="flex flex-col items-center gap-6">
          <SearchInput action="/writing" defaultValue={q} placeholder="Search posts" />

          <div className="flex flex-wrap justify-center gap-2">
            <CategoryChip
              label="ALL"
              href={buildQueryHref("/writing", { q })}
              active={!category}
            />
            {categories.map((item) => (
              <CategoryChip
                key={item.id}
                label={item.name}
                href={buildQueryHref("/writing", { category: item.slug, q })}
                active={item.slug === category}
              />
            ))}
          </div>
        </div>

        <p className="mt-8 text-sm text-faint" aria-live="polite">
          Showing {total} {total === 1 ? "post" : "posts"}
        </p>

        {items.length > 0 ? (
          <div
            key={`${category}-${q}-${currentPage}`}
            className="mt-6 grid gap-card sm:grid-cols-2 lg:grid-cols-3"
          >
            {gridPosts.map((post, index) => (
              <Reveal key={post.id} delay={(index % 3) * 70} className="h-full">
                <PostCard post={post} priority={index < 3} />
              </Reveal>
            ))}
          </div>
        ) : (
          <EmptyState
            className="mt-6"
            title="No posts found"
            description={
              filtered
                ? "Nothing matches those filters yet. Try a different search or clear the filters."
                : "The first post is still being written. Check back soon."
            }
            action={
              filtered ? (
                <ButtonLink href="/writing" variant="secondary">
                  Clear filters
                </ButtonLink>
              ) : null
            }
          />
        )}

        <Pagination
          className="mt-12"
          page={currentPage}
          total={totalPages}
          hrefFor={(target) => buildQueryHref("/writing", { category, q, page: target })}
        />
      </Container>
    </>
  );
}
