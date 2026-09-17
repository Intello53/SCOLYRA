import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SCOLYRA — copilote scolaire et orientation",
  description:
    "SCOLYRA construit et ajuste en continu le plan de travail d'un élève à partir de son niveau réel et de ses objectifs, et le relie à son orientation.",
};

const NAV_LINKS = [
  { href: "/dashboard", label: "Tableau de bord" },
  { href: "/profil", label: "Profil" },
  { href: "/matieres", label: "Matières" },
  { href: "/objectifs", label: "Objectifs" },
  { href: "/revisions", label: "Révisions" },
  { href: "/calendrier", label: "Calendrier" },
  { href: "/documents", label: "Documents" },
  { href: "/projets", label: "Projets" },
  { href: "/orientation", label: "Orientation" },
  { href: "/coach", label: "Coach IA" },
  { href: "/parametres", label: "Paramètres" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
        <div className="flex min-h-screen">
          <aside className="hidden w-64 flex-col border-r border-neutral-200 p-4 dark:border-neutral-800 md:flex">
            <div className="mb-6 px-2 text-xl font-semibold text-brand-600">
              SCOLYRA
            </div>
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-3 py-2 text-sm text-neutral-600 hover:bg-brand-50 hover:text-brand-700 dark:text-neutral-400 dark:hover:bg-brand-900/30 dark:hover:text-brand-300"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="mt-auto px-2 pt-4 text-xs text-neutral-400">
              Mode démonstration
            </div>
          </aside>
          <main className="flex-1 p-6 md:p-10">{children}</main>
        </div>
      </body>
    </html>
  );
}
