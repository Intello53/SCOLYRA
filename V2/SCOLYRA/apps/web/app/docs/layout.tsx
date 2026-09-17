import Link from "next/link";
import { DocsSidebar } from "../../components/docs-sidebar";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-ink-900/8">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-display text-lg text-ink-900">Scolyra</Link>
          <Link href="/dashboard" className="text-sm text-primary-600 hover:underline">
            Ouvrir l'app →
          </Link>
        </div>
      </header>
      <div className="mx-auto flex max-w-6xl gap-10 px-6">
        <DocsSidebar />
        <main className="min-w-0 flex-1 py-8">{children}</main>
      </div>
    </div>
  );
}
