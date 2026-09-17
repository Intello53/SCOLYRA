"use client";

import { PageHeader, Panel, StatBlock, Badge } from "../../components/ui";
import { StaggerGroup, StaggerItem } from "../../components/motion";
import { AnimatedNumber } from "../../components/animated-number";
import { demoAdminStats, demoAdminAlerts, demoAdminUsers } from "../../lib/demo-data";

const ALERT_TONE = { warn: "warn", mastery: "mastery" } as const;

export default function AdminOverviewPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Administration"
        title="Vue d'ensemble"
        description="État global de la plateforme — données de démonstration."
      />

      <StaggerGroup className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        <StaggerItem>
          <StatBlock value={<AnimatedNumber value={demoAdminStats.totalUsers} />} label="Comptes créés" />
        </StaggerItem>
        <StaggerItem>
          <StatBlock value={<AnimatedNumber value={demoAdminStats.activeThisWeek} />} label="Actifs cette semaine" tone="primary" />
        </StaggerItem>
        <StaggerItem>
          <StatBlock value={<AnimatedNumber value={demoAdminStats.premiumUsers} />} label="Abonnés Premium" tone="gold" />
        </StaggerItem>
        <StaggerItem>
          <StatBlock value={<AnimatedNumber value={demoAdminStats.aiCallsToday} />} label="Appels IA aujourd'hui" />
        </StaggerItem>
      </StaggerGroup>

      <StaggerGroup className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <StaggerItem>
          <Panel hover>
            <h2 className="font-display text-lg text-ink-900 dark:text-white">Alertes</h2>
            <ul className="mt-4 space-y-4">
              {demoAdminAlerts.map((a) => (
                <li key={a.title} className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-ink-900 dark:text-white">{a.title}</p>
                    <p className="text-xs text-ink-900/50 dark:text-white/50">{a.detail}</p>
                  </div>
                  <Badge tone={ALERT_TONE[a.tone]}>{a.tone === "warn" ? "À vérifier" : "OK"}</Badge>
                </li>
              ))}
            </ul>
          </Panel>
        </StaggerItem>

        <StaggerItem>
          <Panel hover>
            <h2 className="font-display text-lg text-ink-900 dark:text-white">Derniers comptes actifs</h2>
            <div className="mt-4 divide-y divide-ink-900/8 dark:divide-white/8">
              {demoAdminUsers.slice(0, 4).map((u) => (
                <div key={u.name} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm text-ink-900 dark:text-white">{u.name}</p>
                    <p className="text-xs text-ink-900/45 dark:text-white/45">{u.level} · {u.lastActive}</p>
                  </div>
                  <Badge tone={u.plan === "PREMIUM" ? "gold" : "neutral"}>{u.plan}</Badge>
                </div>
              ))}
            </div>
          </Panel>
        </StaggerItem>
      </StaggerGroup>
    </div>
  );
}
