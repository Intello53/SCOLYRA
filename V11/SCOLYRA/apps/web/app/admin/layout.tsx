import type { Metadata } from "next";
import { AdminSidebar } from "../../components/admin-sidebar";
import { MobileAdminNav } from "../../components/mobile-admin-nav";
import { ToastProvider } from "../../components/toast";
import { requireAdmin } from "../../lib/session";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Défense en profondeur : le middleware filtre déjà, on revérifie le rôle côté serveur.
  await requireAdmin();
  return (
    <ToastProvider>
      <div className="flex min-h-screen flex-col bg-paper dark:bg-ink-950 md:flex-row">
        <AdminSidebar />
        <MobileAdminNav />
        <main id="contenu" tabIndex={-1} className="flex-1 px-6 py-8 outline-none md:px-10 md:py-10">
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>
      </div>
    </ToastProvider>
  );
}
