import {
  demoStudent,
  demoSubjects,
  demoGoals,
  demoUpcomingDeadlines,
  demoRevisionRecommendations,
  demoAIRecommendation,
} from "../../lib/demo-data";

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <h2 className="mb-3 text-sm font-semibold text-neutral-500 dark:text-neutral-400">
        {title}
      </h2>
      {children}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Bonjour {demoStudent.firstName} 👋</h1>
          <p className="text-sm text-neutral-500">
            {demoStudent.schoolLevel} · {demoStudent.establishment}
          </p>
        </div>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
          Données de démonstration
        </span>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Card title="Résumé des matières">
          <ul className="space-y-2">
            {demoSubjects.map((s) => (
              <li key={s.name} className="flex items-center justify-between text-sm">
                <span>{s.name}</span>
                <span className="text-neutral-500">
                  {s.average}/20{" "}
                  <span className="text-brand-600">→ {s.target}/20</span>
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Objectifs actifs">
          <ul className="space-y-2">
            {demoGoals.map((g) => (
              <li key={g.title} className="text-sm">
                <div className="font-medium">{g.title}</div>
                <div className="text-neutral-500">
                  {g.currentValue !== null
                    ? `${g.currentValue}/20 → ${g.targetValue}/20`
                    : "Suivi qualitatif"}{" "}
                  · {g.deadline}
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Prochaines échéances">
          <ul className="space-y-2">
            {demoUpcomingDeadlines.map((d) => (
              <li key={d.title} className="flex justify-between text-sm">
                <span>{d.title}</span>
                <span className="text-neutral-500">J-{d.inDays}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Révisions recommandées">
          <ul className="space-y-2">
            {demoRevisionRecommendations.map((r) => (
              <li key={r.skill} className="flex justify-between text-sm">
                <span>{r.skill}</span>
                <span className="text-neutral-500">{r.priority}</span>
              </li>
            ))}
          </ul>
        </Card>

        <div className="md:col-span-2">
          <Card title="Recommandation du coach IA">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {demoAIRecommendation}
            </p>
            <p className="mt-2 text-xs text-neutral-400">
              Généré en mode AI_PROVIDER=mock — aucune estimation n'est une
              garantie de résultat.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
