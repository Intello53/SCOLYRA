import type { ReactNode } from "react";
import { LEGAL, missingLegalFields } from "../lib/legal";

/** Valeur légale : affiche la donnée, ou un repère visible si elle manque (jamais une valeur inventée). */
export function L({ v, label }: { v: string | null | undefined; label?: string }) {
  if (v && v.trim()) return <>{v}</>;
  return (
    <mark className="rounded bg-amber-100 px-1 text-amber-900">
      [À COMPLÉTER{label ? ` : ${label}` : ""}]
    </mark>
  );
}

export function LegalPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  const missing = missingLegalFields();
  return (
    <article className="max-w-2xl text-ink-900/80">
      <h1 className="font-display text-3xl text-ink-900">{title}</h1>
      {intro && <p className="mt-3 text-base">{intro}</p>}
      {missing.length > 0 && (
        <p role="note" className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <strong>Informations légales incomplètes.</strong> Des champs obligatoires ne sont pas encore renseignés
          (repérés « À COMPLÉTER »). Ce site ne doit pas être ouvert au public tant que{" "}
          <code>apps/web/lib/legal.ts</code> n'est pas complété et relu par un professionnel du droit.
        </p>
      )}
      <div className="mt-6 space-y-6 text-sm leading-relaxed">{children}</div>
      <p className="mt-10 border-t border-ink-900/10 pt-4 text-xs text-ink-900/70">
        Version {LEGAL.version} — dernière mise à jour : {LEGAL.lastUpdated}. Ce document est un modèle rédigé à
        partir du fonctionnement réel du service ; il ne constitue pas un conseil juridique et doit être relu par un
        professionnel avant toute mise en ligne.
      </p>
    </article>
  );
}

export function Section({ id, title, children }: { id?: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id ? `${id}-titre` : undefined}>
      <h2 id={id ? `${id}-titre` : undefined} className="font-display text-xl text-ink-900">
        {title}
      </h2>
      <div className="mt-2 space-y-2">{children}</div>
    </section>
  );
}
