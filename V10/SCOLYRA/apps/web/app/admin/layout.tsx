import { AdminSidebar } from "../../components/admin-sidebar";
import { MobileAdminNav } from "../../components/mobile-admin-nav";
import { ToastProvider } from "../../components/toast";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <div className="flex min-h-screen flex-col bg-paper dark:bg-ink-950 md:flex-row">
        <AdminSidebar />
        <MobileAdminNav />
        <main className="flex-1 px-6 py-8 md:px-10 md:py-10">
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>
      </div>
    </ToastProvider>
  );
}
