import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentEditor } from "@/components/admin/ContentEditor";
import {
  getAdminContentById,
  listCategoriesWithCounts,
  listTagSuggestions,
  listTechSuggestions,
} from "@/lib/admin/data";

export const metadata: Metadata = { title: "Edit item" };

export default async function EditContentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getAdminContentById(id);
  if (!item) notFound();

  const [categories, tagSuggestions, techSuggestions] = await Promise.all([
    listCategoriesWithCounts(),
    listTagSuggestions(),
    listTechSuggestions(),
  ]);

  return (
    <ContentEditor
      initial={item}
      categories={categories}
      tagSuggestions={tagSuggestions}
      techSuggestions={techSuggestions}
    />
  );
}
