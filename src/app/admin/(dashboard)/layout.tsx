import type { ReactNode } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ToastProvider } from "@/components/admin/Toast";
import { isDemoMode, requireAdmin } from "@/lib/auth";

/**
 * Protected layout for every admin page except /admin/login. `requireAdmin`
 * redirects to the login screen when there is no matching session — the proxy
 * already did this, but the layout does not rely on it alone. With no Supabase
 * configured it opens on read-only sample data instead.
 */
export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const user = await requireAdmin();
  const demo = isDemoMode();

  return (
    <ToastProvider>
      <AdminShell email={user.email} demo={demo}>
        {children}
      </AdminShell>
    </ToastProvider>
  );
}
