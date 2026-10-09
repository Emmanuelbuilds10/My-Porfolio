import type { Metadata } from "next";
import { SubscribersTable } from "@/components/admin/SubscribersTable";
import { listSubscribers } from "@/lib/admin/data";
import { firstParam, parsePage } from "@/lib/pagination";

export const metadata: Metadata = { title: "Subscribers" };

export default async function AdminSubscribersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const q = firstParam(params.q).trim();
  const page = parsePage(params.page);

  const { items, totalPages, page: currentPage } = await listSubscribers({ q, page });

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-serif text-2xl text-fg">Subscribers</h1>
        <p className="mt-1 text-sm text-faint">
          Everyone who signed up for the newsletter.
        </p>
      </header>
      <SubscribersTable rows={items} q={q} page={currentPage} totalPages={totalPages} />
    </div>
  );
}
