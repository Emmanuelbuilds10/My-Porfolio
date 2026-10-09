import type { Metadata } from "next";
import { ContentEditor } from "@/components/admin/ContentEditor";
import {
  listCategoriesWithCounts,
  listTagSuggestions,
  listTechSuggestions,
} from "@/lib/admin/data";

export const metadata: Metadata = { title: "New item" };

export default async function NewContentPage() {
  const [categories, tagSuggestions, techSuggestions] = await Promise.all([
    listCategoriesWithCounts(),
    listTagSuggestions(),
    listTechSuggestions(),
  ]);

  return (
    <ContentEditor
      initial={null}
      categories={categories}
      tagSuggestions={tagSuggestions}
      techSuggestions={techSuggestions}
    />
  );
}
