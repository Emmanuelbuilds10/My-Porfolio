import type { Metadata } from "next";
import { CategoryManager } from "@/components/admin/CategoryManager";
import { listCategoriesWithCounts } from "@/lib/admin/data";

export const metadata: Metadata = { title: "Categories" };

export default async function AdminCategoriesPage() {
  const categories = await listCategoriesWithCounts();

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-serif text-2xl text-fg">Categories</h1>
        <p className="mt-1 text-sm text-faint">
          Used by posts. Deleting one that is in use asks where to move its posts.
        </p>
      </header>
      <CategoryManager categories={categories} />
    </div>
  );
}
