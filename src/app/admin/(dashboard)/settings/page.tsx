import type { Metadata } from "next";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { getSiteSettings } from "@/lib/queries";

export const metadata: Metadata = { title: "Settings" };

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-serif text-2xl text-fg">Settings</h1>
        <p className="mt-1 text-sm text-faint">
          Identity, bio and contact links shown across the public site.
        </p>
      </header>
      <SettingsForm settings={settings} />
    </div>
  );
}
