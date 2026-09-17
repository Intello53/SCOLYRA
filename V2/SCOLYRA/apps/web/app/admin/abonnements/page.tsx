import { PageHeader, Panel, StatBlock, Badge } from "../../../components/ui";
import { demoAdminStats, demoAdminUsers } from "../../../lib/demo-data";

export default function AdminAbonnementsPage() {
  const premium = demoAdminUsers.filter((u) => u.plan === "PREMIUM");

  return (
    <div>
      <PageHeader
        eyebrow="Administration"
        title="Abonnements"
        description="Suivi Stripe — architecture prête, webhooks non branchés en V0 (voir docs/PAYMENTS.md)."
      />

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
        <StatBlock value={demoAdminStats.premiumUsers.toString()} label="Abonnés Premium" tone="gold" />
        <StatBlock value="0" label="Paiements en échec" tone="mastery" />
        <StatBlock value="0" label="Comptes mineurs bloqués sans représentant vérifié" />
      </div>

      <div className="mt-8">
        <Panel>
          <h2 className="font-display text-lg text-ink-900 dark:text-white">Comptes Premium récents</h2>
          <div className="mt-4 divide-y divide-ink-900/8 dark:divide-white/8">
            {premium.map((u) => (
              <div key={u.name} className="flex items-center justify-between py-3 first:pt-0 last:pb-0 text-sm">
                <span className="text-ink-900 dark:text-white">{u.name}</span>
                <Badge tone="gold">{u.plan}</Badge>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
