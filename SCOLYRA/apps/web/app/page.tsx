export default function HomePage() {
  return (
    <div className="mx-auto max-w-3xl">
      <p className="mb-2 text-sm font-medium uppercase tracking-wide text-brand-600">
        Copilote scolaire &amp; orientation
      </p>
      <h1 className="mb-4 text-4xl font-bold tracking-tight">
        SCOLYRA construit et ajuste en continu ton plan de travail — à
        partir de ton niveau réel, de tes objectifs, et le relie à ton
        orientation.
      </h1>
      <p className="mb-8 text-neutral-600 dark:text-neutral-400">
        Profil pédagogique centralisé, révisions priorisées, coach IA, et
        suivi d'orientation post-bac — dans un seul environnement.
      </p>
      <div className="flex gap-3">
        <a
          href="/dashboard"
          className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
        >
          Voir la démo
        </a>
        <a
          href="/docs"
          className="rounded-lg border border-neutral-300 px-5 py-2.5 text-sm font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-900"
        >
          Documentation
        </a>
      </div>
    </div>
  );
}
