import { PageHeader, Panel, Badge } from "../../../components/ui";
import { demoAdminUsers } from "../../../lib/demo-data";

export default function AdminElevesPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Administration"
        title="Élèves"
        description="Liste des comptes — vue restreinte, aucune donnée pédagogique détaillée n'est affichée ici."
      />

      <Panel className="!p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink-900/8 text-left text-xs uppercase tracking-wide text-ink-900/40 dark:border-white/8 dark:text-white/40">
              <th className="px-5 py-3 font-medium">Nom</th>
              <th className="px-5 py-3 font-medium">Niveau</th>
              <th className="px-5 py-3 font-medium">Plan</th>
              <th className="px-5 py-3 font-medium">Dernière activité</th>
              <th className="px-5 py-3 font-medium">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-900/8 dark:divide-white/8">
            {demoAdminUsers.map((u) => (
              <tr key={u.name}>
                <td className="px-5 py-3 text-ink-900 dark:text-white">{u.name}</td>
                <td className="px-5 py-3 text-ink-900/65 dark:text-white/65">{u.level}</td>
                <td className="px-5 py-3">
                  <Badge tone={u.plan === "PREMIUM" ? "gold" : "neutral"}>{u.plan}</Badge>
                </td>
                <td className="px-5 py-3 text-ink-900/50 dark:text-white/50">{u.lastActive}</td>
                <td className="px-5 py-3">
                  <Badge tone={u.status === "Actif" ? "mastery" : "neutral"}>{u.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <p className="mt-4 text-xs text-ink-900/40 dark:text-white/40">
        Tableau de démonstration — la vraie vue admin devra respecter le
        principe de minimisation des données (docs/SECURITY.md).
      </p>
    </div>
  );
}
