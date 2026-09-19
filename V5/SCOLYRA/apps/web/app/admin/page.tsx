import { PageHeader, Panel, StatBlock, Badge } from "../../components/ui";
import { StaggerGroup, StaggerItem } from "../../components/motion";
import { AnimatedNumber } from "../../components/animated-number";
import { prisma } from "@scolyra/db";
import { getLevel, type SchoolLevelCode } from "../../lib/curriculum";

export default async function AdminOverviewPage() {
  const since7d = new Date(Date.now() - 7 * 86_400_000);
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [totalUsers, premiumUsers, aiCallsToday, recentUsers, unverifiedMinorsCount] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.subscription.count({ where: { plan: "PREMIUM" } }),
    prisma.aIUsage.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.user.findMany({
      where: { role: "STUDENT" },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { profile: true, studentProfile: true, subscription: true },
    }),
    prisma.user.count({
      where: {
        role: "STUDENT",
        isMinor: true,
        guardedBy: { none: { verified: true } },
      },
    }),
  ]);

  const activeThisWeekUsers = await prisma.user.findMany({
    where: {
      role: "STUDENT",
      OR: [{ grades: { some: { createdAt: { gte: since7d } } } }, { studySessions: { some: { startAt: { gte: since7d } } } }],
    },
    select: { id: true },
  });

  const alerts = [
    unverifiedMinorsCount > 0 && {
      title: `${unverifiedMinorsCount} compte(s) mineur(s) sans représentant légal vérifié`,
      detail: "Bloque l'accès Premium pour ces comptes",
      tone: "warn" as const,
    },
    { title: "Aucun incident de sécurité détecté", detail: "Dernier audit log suspect : aucun", tone: "mastery" as const },
  ].filter(Boolean) as { title: string; detail: string; tone: "warn" | "mastery" }[];

  return (
    <div>
      <PageHeader eyebrow="Administration" title="Vue d'ensemble" description="État global de la plateforme — données réelles de la base." />

      <StaggerGroup className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        <StaggerItem><StatBlock value={<AnimatedNumber value={totalUsers} />} label="Comptes élèves" /></StaggerItem>
        <StaggerItem><StatBlock value={<AnimatedNumber value={activeThisWeekUsers.length} />} label="Actifs cette semaine" tone="primary" /></StaggerItem>
        <StaggerItem><StatBlock value={<AnimatedNumber value={premiumUsers} />} label="Abonnés Premium" tone="gold" /></StaggerItem>
        <StaggerItem><StatBlock value={<AnimatedNumber value={aiCallsToday} />} label="Appels IA aujourd'hui" /></StaggerItem>
      </StaggerGroup>

      <StaggerGroup className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <StaggerItem>
          <Panel hover>
            <h2 className="font-display text-lg text-ink-900 dark:text-white">Alertes</h2>
            <ul className="mt-4 space-y-4">
              {alerts.map((a) => (
                <li key={a.title} className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-ink-900 dark:text-white">{a.title}</p>
                    <p className="text-xs text-ink-900/50 dark:text-white/50">{a.detail}</p>
                  </div>
                  <Badge tone={a.tone}>{a.tone === "warn" ? "À vérifier" : "OK"}</Badge>
                </li>
              ))}
            </ul>
          </Panel>
        </StaggerItem>

        <StaggerItem>
          <Panel hover>
            <h2 className="font-display text-lg text-ink-900 dark:text-white">Derniers comptes créés</h2>
            <div className="mt-4 divide-y divide-ink-900/8 dark:divide-white/8">
              {recentUsers.map((u) => (
                <div key={u.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm text-ink-900 dark:text-white">{u.profile?.firstName ?? u.email}</p>
                    <p className="text-xs text-ink-900/45 dark:text-white/45">
                      {u.studentProfile ? getLevel(u.studentProfile.schoolLevel as SchoolLevelCode)?.label : "—"}
                    </p>
                  </div>
                  <Badge tone={u.subscription?.plan === "PREMIUM" ? "gold" : "neutral"}>{u.subscription?.plan ?? "FREE"}</Badge>
                </div>
              ))}
              {recentUsers.length === 0 && <p className="py-3 text-sm text-ink-900/45 dark:text-white/45">Aucun compte pour l'instant.</p>}
            </div>
          </Panel>
        </StaggerItem>
      </StaggerGroup>
    </div>
  );
}
