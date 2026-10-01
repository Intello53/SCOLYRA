import Link from "next/link";
import { PublicNav } from "../../components/public-nav";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <PublicNav />
      <main id="contenu" tabIndex={-1} className="mx-auto max-w-5xl px-6 py-14 outline-none">{children}</main>
      <footer className="mt-20 border-t border-ink-900/8 py-8">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-6 text-sm text-ink-900/60">
          <span>SCOLYRA — copilote scolaire et orientation.</span>
          <nav aria-label="Informations légales" className="flex flex-wrap gap-4">
            <Link href="/mentions-legales" className="hover:text-ink-900">Mentions légales</Link>
            <Link href="/confidentialite" className="hover:text-ink-900">Confidentialité</Link>
            <Link href="/cgu" className="hover:text-ink-900">CGU</Link>
            <Link href="/cgv" className="hover:text-ink-900">CGV</Link>
            <Link href="/retractation" className="hover:text-ink-900">Rétractation</Link>
            <Link href="/cookies" className="hover:text-ink-900">Cookies</Link>
            <Link href="/accessibilite" className="hover:text-ink-900">Accessibilité</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
