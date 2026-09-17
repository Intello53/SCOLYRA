import { PageHeader, Panel, Badge, EmptyState } from "../../../components/ui";
import { demoSubjects } from "../../../lib/demo-data";

export default function AdminContenusPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Administration"
        title="Contenus"
        description="Référentiel de matières et formations d'orientation."
      />

      <Panel>
        <h2 className="font-display text-lg text-ink-900 dark:text-white">Référentiel de matières</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {demoSubjects.map((s) => (
            <Badge key={s.slug} tone="primary">{s.name}</Badge>
          ))}
        </div>
      </Panel>

      <div className="mt-6">
        <h2 className="mb-3 font-display text-lg text-ink-900 dark:text-white">Formations (orientation)</h2>
        <EmptyState
          title="Aucune formation officielle importée"
          description="Le modèle Formation reste vide tant qu'aucune source de données vérifiée n'est branchée. Ne jamais saisir de prérequis ou statistiques inventés."
        />
      </div>
    </div>
  );
}
