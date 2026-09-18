import { PageHeader, Panel, Badge } from "../../../components/ui";
import { prisma } from "@scolyra/db";
import { getLevel, type SchoolLevelCode } from "../../../lib/curriculum";

export default async function AdminElevesPage() {
  const users = await prisma.user.findMany({
    where: { role: "STUDENT" },
    orderBy: { createdAt: "desc" },
    include: { profile: true, studentProfile: true, subscription: true },
  });

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
              <th className="px-5 py-3 font-medium">Créé le</th>
              <th className="px-5 py-3 font-medium">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-900/8 dark:divide-white/8">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="px-5 py-3 text-ink-900 dark:text-white">{u.profile?.firstName ?? u.email}</td>
                <td className="px-5 py-3 text-ink-900/65 dark:text-white/65">
                  {u.studentProfile ? getLevel(u.studentProfile.schoolLevel as SchoolLevelCode)?.label : "—"}
                </td>
                <td className="px-5 py-3">
                  <Badge tone={u.subscription?.plan === "PREMIUM" ? "gold" : "neutral"}>{u.subscription?.plan ?? "FREE"}</Badge>
                </td>
                <td className="px-5 py-3 text-ink-900/50 dark:text-white/50">{u.createdAt.toLocaleDateString("fr-FR")}</td>
                <td className="px-5 py-3">
                  <Badge tone={u.isMinor ? "warn" : "mastery"}>{u.isMinor ? "Mineur" : "Majeur"}</Badge>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-6 text-center text-ink-900/45 dark:text-white/45">Aucun compte pour l'instant.</td></tr>
            )}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}
