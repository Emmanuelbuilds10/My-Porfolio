import type { Metadata } from "next";
import Link from "next/link";
import { FileText, FolderGit2, Inbox, PenLine, Plus } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { CategoryChip } from "@/components/ui/CategoryChip";
import { CoverImage } from "@/components/ui/CoverImage";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { StatCard } from "@/components/admin/StatCard";
import { StatusBadge, TypeBadge } from "@/components/admin/Badges";
import { ContentRowActions } from "@/components/admin/ContentRowActions";
import { DataTable, rowBase, tdBase } from "@/components/admin/DataTable";
import {
  getAdminStats,
  listAdminContent,
  type AdminTab,
} from "@/lib/admin/data";
import { formatMonthYear } from "@/lib/format";
import { buildQueryHref, firstParam, parsePage } from "@/lib/pagination";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Content" };

const TABS: { value: AdminTab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "post", label: "Posts" },
  { value: "project", label: "Projects" },
  { value: "landing", label: "Landing" },
  { value: "draft", label: "Drafts" },
  { value: "scheduled", label: "Scheduled" },
];

function parseTab(value: string): AdminTab {
  return TABS.some((tab) => tab.value === value) ? (value as AdminTab) : "all";
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const tab = parseTab(firstParam(params.tab));
  const q = firstParam(params.q).trim();
  const sort = firstParam(params.sort) === "published" ? "published" : "updated";
  const page = parsePage(params.page);

  const [stats, result] = await Promise.all([
    getAdminStats(),
    listAdminContent({ tab, q, sort, page, pageSize: 20 }),
  ]);

  const { items, total, totalPages, page: currentPage } = result;
  const filtered = tab !== "all" || Boolean(q);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl text-fg">Content</h1>
          <p className="mt-1 text-sm text-faint">
            One table for every post and project. Star a project to show it in
            Selected Work on the landing page.
          </p>
        </div>
        <ButtonLink href="/admin/new">
          <Plus aria-hidden className="size-4" />
          New item
        </ButtonLink>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Posts" value={stats.posts} icon={<FileText aria-hidden className="size-4" />} />
        <StatCard label="Projects" value={stats.projects} icon={<FolderGit2 aria-hidden className="size-4" />} />
        <StatCard label="Drafts" value={stats.drafts} icon={<PenLine aria-hidden className="size-4" />} />
        <StatCard label="Subscribers" value={stats.subscribers} icon={<Inbox aria-hidden className="size-4" />} />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {TABS.map((entry) => (
            <CategoryChip
              key={entry.value}
              label={entry.label}
              href={buildQueryHref("/admin", {
                tab: entry.value === "all" ? "" : entry.value,
                q,
                sort: sort === "updated" ? "" : sort,
              })}
              active={tab === entry.value}
            />
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <form action="/admin" method="get" role="search" className="flex flex-wrap items-center gap-2">
            {tab !== "all" ? <input type="hidden" name="tab" value={tab} /> : null}
            {sort !== "updated" ? <input type="hidden" name="sort" value={sort} /> : null}
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Search by title"
              className="h-10 w-[240px] rounded-button border border-line-strong bg-well px-4 text-sm text-fg outline-none transition-colors focus:border-accent"
            />
            <button
              type="submit"
              className="h-10 rounded-button border border-line-strong px-4 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
            >
              Search
            </button>
          </form>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-faint">Sort</span>
            {(["updated", "published"] as const).map((option) => (
              <Link
                key={option}
                href={buildQueryHref("/admin", {
                  tab: tab === "all" ? "" : tab,
                  q,
                  sort: option === "updated" ? "" : option,
                })}
                className={cn(
                  "rounded-button px-3 py-1.5 text-xs",
                  sort === option
                    ? "bg-accent-soft text-accent"
                    : "text-muted hover:text-fg",
                )}
              >
                {option === "updated" ? "Updated" : "Published"}
              </Link>
            ))}
          </div>
        </div>

        {items.length === 0 ? (
          <EmptyState
            title={filtered ? "Nothing matches those filters" : "No content yet"}
            description={
              filtered
                ? "Try a different tab or clear the search."
                : "Publish your first post or project and it will show up here."
            }
            action={
              filtered ? (
                <ButtonLink href="/admin" variant="secondary">
                  Clear filters
                </ButtonLink>
              ) : (
                <ButtonLink href="/admin/new">
                  <Plus aria-hidden className="size-4" />
                  Create your first item
                </ButtonLink>
              )
            }
          />
        ) : (
          <>
            <p className="text-sm text-faint">
              Showing {total} item{total === 1 ? "" : "s"}
            </p>
            <DataTable
              columns={["", "Title", "Type", "Category / status", "Publish", "Published", "Updated", "Actions"]}
            >
              {items.map((item) => (
                <tr key={item.id} className={rowBase}>
                  <td className={cn(tdBase, "w-16")}>
                    <div className="w-12">
                      <CoverImage
                        src={item.coverImageUrl}
                        alt=""
                        ratio="square"
                        sizes="48px"
                      />
                    </div>
                  </td>
                  <td className={cn(tdBase, "min-w-[220px]")}>
                    <Link
                      href={`/admin/${item.id}/edit`}
                      className="font-medium text-fg transition-colors hover:text-accent"
                    >
                      {item.title}
                    </Link>
                    <p className="mt-0.5 font-mono text-xs text-faint">{item.slug}</p>
                  </td>
                  <td className={tdBase}>
                    <TypeBadge type={item.type} />
                  </td>
                  <td className={cn(tdBase, "text-muted")}>
                    {item.type === "post"
                      ? (item.category?.name ?? "—")
                      : (item.projectStatus ?? "—")}
                  </td>
                  <td className={tdBase}>
                    <StatusBadge status={item.publishStatus} />
                  </td>
                  <td className={cn(tdBase, "whitespace-nowrap text-faint")}>
                    {item.publishedAt ? formatMonthYear(item.publishedAt) : "—"}
                  </td>
                  <td className={cn(tdBase, "whitespace-nowrap text-faint")}>
                    {formatMonthYear(item.updatedAt)}
                  </td>
                  <td className={tdBase}>
                    <ContentRowActions
                      id={item.id}
                      title={item.title}
                      type={item.type}
                      slug={item.slug}
                      publishStatus={item.publishStatus}
                      featured={item.featured}
                    />
                  </td>
                </tr>
              ))}
            </DataTable>
          </>
        )}

        <Pagination
          page={currentPage}
          total={totalPages}
          hrefFor={(target) =>
            buildQueryHref("/admin", {
              tab: tab === "all" ? "" : tab,
              q,
              sort: sort === "updated" ? "" : sort,
              page: target,
            })
          }
        />
      </div>
    </div>
  );
}
