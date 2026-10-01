import Link from "next/link";
import { DOC_CHAPTERS } from "../../lib/docs-content";

export default function DocsIndexPage() {
  const sections = Array.from(new Set(DOC_CHAPTERS.map((c) => c.section)));

  return (
    <div className="max-w-2xl">
      <p className="mb-2 text-sm text-primary-600">Documentation</p>
      <h1 className="font-display text-3xl text-ink-900">Tout comprendre sur SCOLYRA</h1>
      <p className="mt-3 text-sm text-ink-900/60">
        De l'installation sur Fedora à l'ajout d'un agent IA — choisis un chapitre.
      </p>

      <div className="mt-10 space-y-8">
        {sections.map((section) => (
          <div key={section}>
            <h2 className="mb-3 font-display text-lg text-ink-900">{section}</h2>
            <div className="space-y-2">
              {DOC_CHAPTERS.filter((c) => c.section === section).map((c) => (
                <Link
                  key={c.slug}
                  href={`/docs/${c.slug}`}
                  className="focus-ring block rounded-xl border border-ink-900/8 p-4 hover:border-primary-200 hover:bg-primary-50/40"
                >
                  <p className="font-medium text-ink-900">{c.title}</p>
                  <p className="mt-0.5 text-sm text-ink-900/55">{c.summary}</p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
