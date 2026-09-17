"use client";

import { PageHeader, Panel, StatBlock, Badge, ProgressBar } from "../../../components/ui";
import { StaggerGroup, StaggerItem } from "../../../components/motion";
import { AnimatedNumber } from "../../../components/animated-number";
import {
  demoStudent,
  demoSubjects,
  demoGoals,
  demoUpcomingDeadlines,
  demoRevisionPlan,
  demoAIRecommendation,
} from "../../../lib/demo-data";

export default function DashboardPage() {
  const weakest = [...demoSubjects].sort((a, b) => a.average - b.average)[0];
  const priorityRevisions = demoRevisionPlan.sessions.filter((s) => s.status !== "Fait").slice(0, 3);

  return (
    <div>
      <PageHeader
        eyebrow={`${demoStudent.schoolLevel} · ${demoStudent.establishment}`}
        title={`Bonjour ${demoStudent.firstName}`}
        description="Voici ce qui mérite ton attention cette semaine."
        action={<Badge tone="gold">Données de démonstration</Badge>}
      />

      <StaggerGroup className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        <StaggerItem>
          <StatBlock value={<AnimatedNumber value={13.9} decimals={1} />} unit="/20" label="Moyenne générale" tone="primary" />
        </StaggerItem>
        <StaggerItem>
          <StatBlock value={<AnimatedNumber value={15} />} unit="/20" label="Objectif principal" tone="gold" />
        </StaggerItem>
        <StaggerItem>
          <StatBlock value={<AnimatedNumber value={3} />} label="Échéances sous 15 jours" />
        </StaggerItem>
        <StaggerItem>
          <StatBlock value={weakest.name} label="Matière à surveiller" tone="mastery" />
        </StaggerItem>
      </StaggerGroup>

      <StaggerGroup className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <StaggerItem className="lg:col-span-2">
          <Panel hover>
            <h2 className="font-display text-lg text-ink-900 dark:text-white">Matières</h2>
            <div className="mt-4 space-y-4">
              {demoSubjects.map((s, i) => (
                <div key={s.slug}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="text-ink-900 dark:text-white">{s.name}</span>
                    <span className="text-ink-900/55 dark:text-white/55">
                      {s.average}/20 <span className="text-ink-900/30">→</span> {s.target}/20
                    </span>
                  </div>
                  <ProgressBar
                    value={s.average}
                    max={s.target}
                    tone={s.average >= s.target ? "mastery" : "primary"}
                    delay={0.1 + i * 0.05}
                  />
                </div>
              ))}
            </div>
          </Panel>
        </StaggerItem>

        <StaggerItem>
          <Panel hover>
            <h2 className="font-display text-lg text-ink-900 dark:text-white">Prochaines échéances</h2>
            <ul className="mt-4 space-y-3">
              {demoUpcomingDeadlines.slice(0, 4).map((d) => (
                <li key={d.title} className="flex items-start justify-between gap-3 text-sm">
                  <div>
                    <p className="text-ink-900 dark:text-white">{d.title}</p>
                    <p className="text-xs text-ink-900/45 dark:text-white/45">{d.kind}</p>
                  </div>
                  <Badge tone={d.inDays <= 7 ? "warn" : "neutral"}>J-{d.inDays}</Badge>
                </li>
              ))}
            </ul>
          </Panel>
        </StaggerItem>

        <StaggerItem>
          <Panel hover>
            <h2 className="font-display text-lg text-ink-900 dark:text-white">Objectifs actifs</h2>
            <ul className="mt-4 space-y-3">
              {demoGoals.map((g) => (
                <li key={g.title} className="text-sm">
                  <p className="text-ink-900 dark:text-white">{g.title}</p>
                  <p className="text-xs text-ink-900/50 dark:text-white/50">
                    {g.currentValue !== null ? `${g.currentValue}/20 → ${g.targetValue}/20` : "Suivi qualitatif"} · {g.deadline}
                  </p>
                </li>
              ))}
            </ul>
          </Panel>
        </StaggerItem>

        <StaggerItem>
          <Panel hover>
            <h2 className="font-display text-lg text-ink-900 dark:text-white">À réviser en priorité</h2>
            <ul className="mt-4 space-y-3">
              {priorityRevisions.map((r) => (
                <li key={r.skill} className="flex items-center justify-between text-sm">
                  <span className="text-ink-900 dark:text-white">{r.skill}</span>
                  <Badge tone={r.priority === "Haute" ? "warn" : "neutral"}>{r.priority}</Badge>
                </li>
              ))}
            </ul>
          </Panel>
        </StaggerItem>

        <StaggerItem className="lg:col-span-3">
          <Panel>
            <div className="flex items-start gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-50 font-display text-primary-600 dark:bg-primary-500/15">
                IA
              </div>
              <div>
                <h2 className="font-display text-lg text-ink-900 dark:text-white">Recommandation du coach</h2>
                <p className="mt-1 text-sm text-ink-900/65 dark:text-white/65">{demoAIRecommendation}</p>
                <p className="mt-2 text-xs text-ink-900/40 dark:text-white/40">
                  Généré en mode AI_PROVIDER=mock — jamais une garantie de résultat.
                </p>
              </div>
            </div>
          </Panel>
        </StaggerItem>
      </StaggerGroup>
    </div>
  );
}
