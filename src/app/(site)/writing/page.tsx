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
import { HERO_IMAGE } from "@/lib/hero-image";
import { buildQueryHref, firstParam, PAGE_SIZE, parsePage } from "@/lib/pagination";
import { getCategories, getPosts } from "@/lib/queries";
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

  const categories = await getCategories();
  let result = await getPosts({ category, q, page, pageSize: PAGE_SIZE });
  // `?page=` beyond the last page: refetch inside the real range instead of
  // rendering an empty grid.
  if (result.total > 0 && page > result.totalPages) {
    result = await getPosts({ category, q, page: result.totalPages, pageSize: PAGE_SIZE });
  }

  const { items, total, totalPages, page: currentPage } = result;
  const filtered = Boolean(category || q);

  return (
    <>
      <PageHero title="Writing" subtitle={site.writingHeroSubtitle} imageUrl={HERO_IMAGE} priority />

      <Container className="mt-section">
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
            {items.map((post, index) => (
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
