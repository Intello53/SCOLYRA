const DOC_CHAPTERS = [
  { file: "QUICKSTART.md", title: "Démarrage rapide" },
  { file: "INSTALLATION.md", title: "Installation" },
  { file: "TUTORIEL.md", title: "Tutoriel complet" },
  { file: "ARCHITECTURE.md", title: "Architecture" },
  { file: "DATABASE.md", title: "Base de données" },
  { file: "AI.md", title: "Système IA" },
  { file: "SECURITY.md", title: "Sécurité" },
  { file: "PAYMENTS.md", title: "Paiements" },
  { file: "DEVELOPMENT.md", title: "Développement" },
  { file: "DEPLOYMENT.md", title: "Déploiement" },
  { file: "TROUBLESHOOTING.md", title: "Dépannage" },
  { file: "ROADMAP.md", title: "Roadmap" },
  { file: "STATUS.md", title: "État du projet" },
];

/**
 * NON EXÉCUTÉ ICI (§35) : dans une implémentation complète, cette page
 * lirait les fichiers docs/*.md via fs.readFileSync côté serveur et les
 * rendrait avec un parseur markdown (ex. next-mdx-remote). Cette V0
 * fournit la structure de navigation ; le rendu markdown→HTML réel est
 * à brancher (voir docs/ROADMAP.md).
 */
export default function DocsIndexPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-2 text-2xl font-bold">Documentation SCOLYRA</h1>
      <p className="mb-6 text-sm text-neutral-500">
        Les fichiers sources sont dans <code>docs/*.md</code>. Le rendu
        markdown→HTML de cette page n'est pas encore branché (voir
        docs/STATUS.md).
      </p>
      <ul className="space-y-2">
        {DOC_CHAPTERS.map((c) => (
          <li
            key={c.file}
            className="rounded-lg border border-neutral-200 px-4 py-3 text-sm dark:border-neutral-800"
          >
            <span className="font-medium">{c.title}</span>{" "}
            <span className="text-neutral-400">— docs/{c.file}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
