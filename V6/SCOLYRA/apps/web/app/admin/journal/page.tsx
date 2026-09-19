import { PageHeader, Panel, Badge } from "../../../components/ui";
import { requireAdmin } from "../../../lib/session";
import { prisma } from "@scolyra/db";

export default async function AdminJournalPage() {
  await requireAdmin();
  const entries = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { user: { include: { profile: true } } },
  });

  return (
    <div>
      <PageHeader
        eyebrow="Administration"
        title="Journal d'audit"
        description="Actions sensibles réellement tracées (connexions, créations de compte, exports, suppressions, upgrades, modifications de fonctionnalités)."
      />

      <Panel className="!p-0">
        <div className="divide-y divide-ink-900/8 dark:divide-white/8">
          {entries.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between px-5 py-3 text-sm">
              <div>
                <p className="text-ink-900 dark:text-white">{entry.action}</p>
                <p className="text-xs text-ink-900/45 dark:text-white/45">
                  {entry.user?.profile?.firstName ?? entry.user?.email ?? "Compte supprimé"}
                  {entry.ip && ` · ${entry.ip}`}
                </p>
              </div>
              <Badge tone="neutral">{entry.createdAt.toLocaleString("fr-FR")}</Badge>
            </div>
          ))}
          {entries.length === 0 && (
            <p className="px-5 py-6 text-center text-sm text-ink-900/45 dark:text-white/45">Aucune entrée pour l'instant.</p>
          )}
        </div>
      </Panel>
    </div>
  );
}
