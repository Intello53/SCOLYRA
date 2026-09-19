import Link from "next/link";
import { PublicNav } from "../../components/public-nav";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <PublicNav />
      <div className="mx-auto max-w-5xl px-6 py-14">{children}</div>
      <footer className="mt-20 border-t border-ink-900/8 py-8">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-6 text-sm text-ink-900/45">
          <span>SCOLYRA — projet de démonstration. Les données affichées sont fictives.</span>
          <nav className="flex flex-wrap gap-4">
            <Link href="/mentions-legales" className="hover:text-ink-900/70">Mentions légales</Link>
            <Link href="/confidentialite" className="hover:text-ink-900/70">Confidentialité</Link>
            <Link href="/cgu" className="hover:text-ink-900/70">CGU</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
