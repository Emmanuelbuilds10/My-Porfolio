import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { getAdminUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/queries";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (await getAdminUser()) redirect("/admin");

  const configured = isSupabaseConfigured() && Boolean(process.env.ADMIN_EMAIL);

  return (
    <main className="grid min-h-dvh place-items-center px-4 py-16">
      <div className="w-full max-w-[400px]">
        <p className="mb-6 text-center font-serif text-xl text-fg">{site.name}</p>
        <LoginForm configured={configured} />
      </div>
    </main>
  );
}
