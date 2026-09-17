import { PageHeader, Panel } from "../../../components/ui";
import { demoAdminAuditLog } from "../../../lib/demo-data";

export default function AdminJournalPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Administration"
        title="Journal d'audit"
        description="Actions sensibles tracées (modèle AuditLog) — instrumentation à compléter au fil des fonctionnalités."
      />

      <Panel className="!p-0">
        <div className="divide-y divide-ink-900/8 dark:divide-white/8">
          {demoAdminAuditLog.map((entry, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-3 text-sm">
              <div>
                <p className="text-ink-900 dark:text-white">{entry.action}</p>
                <p className="text-xs text-ink-900/45 dark:text-white/45">{entry.user}</p>
              </div>
              <span className="text-xs text-ink-900/40 dark:text-white/40">{entry.when}</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
