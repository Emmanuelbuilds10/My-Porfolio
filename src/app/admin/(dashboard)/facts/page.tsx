import type { Metadata } from "next";
import { FactsManager } from "@/components/admin/FactsManager";
import { listFactsAdmin } from "@/lib/admin/data";

export const metadata: Metadata = { title: "Facts" };

export default async function AdminFactsPage() {
  const facts = await listFactsAdmin();

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-serif text-2xl text-fg">Facts</h1>
        <p className="mt-1 text-sm text-faint">
          The “A few facts” cards on the About page. Drag to reorder — the order saves
          automatically.
        </p>
      </header>
      <FactsManager facts={facts} />
    </div>
  );
}
