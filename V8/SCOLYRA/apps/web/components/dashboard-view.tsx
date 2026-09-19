"use client";

import { PageHeader, Panel, StatBlock, Badge, ProgressBar, EmptyState } from "./ui";
import { StaggerGroup, StaggerItem } from "./motion";
import { AnimatedNumber } from "./animated-number";
import { Button } from "./button";
import Link from "next/link";
import type { SubjectWithStats } from "../lib/grades";

type GoalSummary = { id: string; title: string; currentValue: number | null; targetValue: number | null; deadline: string | null };
type UpcomingItem = { title: string; date: string; kind: string };

export function DashboardView({
  firstName,
  schoolLevelLabel,
  establishment,
  overallAverage,
  subjects,
  goals,
  upcoming,
}: {
  firstName: string;
  schoolLevelLabel: string;
  establishment: string | null;
  overallAverage: number | null;
  subjects: SubjectWithStats[];
  goals: GoalSummary[];
  upcoming: UpcomingItem[];
}) {
  const weakest = [...subjects].filter((s) => s.average !== null).sort((a, b) => (a.average ?? 0) - (b.average ?? 0))[0];

  return (
    <div>
      <PageHeader
        eyebrow={[schoolLevelLabel, establishment].filter(Boolean).join(" · ")}
        title={`Bonjour ${firstName}`}
        description="Voici ce qui mérite ton attention cette semaine."
      />

      {subjects.length === 0 ? (
        <EmptyState
          title="Ton profil est encore vide"
          description="Ajoute tes premières notes et un objectif pour que ton tableau de bord prenne vie."
          action={
            <div className="flex gap-2">
              <Link href="/matieres"><Button>Ajouter des notes</Button></Link>
              <Link href="/objectifs"><Button variant="secondary">Créer un objectif</Button></Link>
            </div>
          }
        />
      ) : (
        <>
          <StaggerGroup className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <StaggerItem>
              {overallAverage !== null ? (
                <StatBlock value={<AnimatedNumber value={overallAverage} decimals={1} />} unit="/20" label="Moyenne générale" tone="primary" />
              ) : (
                <StatBlock value="—" label="Moyenne générale" />
              )}
            </StaggerItem>
            <StaggerItem>
              <StatBlock value={<AnimatedNumber value={goals.length} />} label="Objectifs actifs" tone="gold" />
            </StaggerItem>
            <StaggerItem>
              <StatBlock value={<AnimatedNumber value={upcoming.length} />} label="Échéances à venir" />
            </StaggerItem>
            <StaggerItem>
              <StatBlock value={weakest?.name ?? "—"} label="Matière à surveiller" tone="mastery" />
            </StaggerItem>
          </StaggerGroup>

          <StaggerGroup className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <StaggerItem className="lg:col-span-2">
              <Panel hover>
                <h2 className="font-display text-lg text-ink-900 dark:text-white">Matières</h2>
                <div className="mt-4 space-y-4">
                  {subjects.map((s, i) => (
                    <div key={s.userSubjectId}>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="text-ink-900 dark:text-white">{s.name}</span>
                        <span className="text-ink-900/55 dark:text-white/55">
                          {s.average !== null ? `${s.average}/20` : "Aucune note"}
                        </span>
                      </div>
                      <ProgressBar value={s.average ?? 0} max={20} tone="primary" delay={0.1 + i * 0.05} />
                    </div>
                  ))}
                </div>
              </Panel>
            </StaggerItem>

            <StaggerItem>
              <Panel hover>
                <h2 className="font-display text-lg text-ink-900 dark:text-white">Prochaines échéances</h2>
                {upcoming.length === 0 ? (
                  <p className="mt-3 text-sm text-ink-900/45 dark:text-white/45">
                    Rien de prévu — ajoute une session dans le calendrier.
                  </p>
                ) : (
                  <ul className="mt-4 space-y-3">
                    {upcoming.slice(0, 4).map((d) => (
                      <li key={d.title + d.date} className="flex items-start justify-between gap-3 text-sm">
                        <div>
                          <p className="text-ink-900 dark:text-white">{d.title}</p>
                          <p className="text-xs text-ink-900/45 dark:text-white/45">{d.kind}</p>
                        </div>
                        <Badge tone="neutral">{new Date(d.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" })}</Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </Panel>
            </StaggerItem>

            <StaggerItem>
              <Panel hover>
                <h2 className="font-display text-lg text-ink-900 dark:text-white">Objectifs actifs</h2>
                {goals.length === 0 ? (
                  <p className="mt-3 text-sm text-ink-900/45 dark:text-white/45">Aucun objectif actif.</p>
                ) : (
                  <ul className="mt-4 space-y-3">
                    {goals.map((g) => (
                      <li key={g.id} className="text-sm">
                        <p className="text-ink-900 dark:text-white">{g.title}</p>
                        <p className="text-xs text-ink-900/50 dark:text-white/50">
                          {g.currentValue !== null && g.targetValue !== null
                            ? `${g.currentValue}/20 → ${g.targetValue}/20`
                            : "Suivi qualitatif"}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </Panel>
            </StaggerItem>

            <StaggerItem className="lg:col-span-2">
              <Panel>
                <div className="flex items-start gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-50 font-display text-primary-600 dark:bg-primary-500/15">
                    IA
                  </div>
                  <div>
                    <h2 className="font-display text-lg text-ink-900 dark:text-white">Coach IA</h2>
                    <p className="mt-1 text-sm text-ink-900/65 dark:text-white/65">
                      Pose une question sur tes révisions ou ton orientation — je regarde ton vrai profil pour répondre.
                    </p>
                    <Link href="/coach" className="mt-2 inline-block text-sm text-primary-600 hover:underline">
                      Ouvrir le coach →
                    </Link>
                  </div>
                </div>
              </Panel>
            </StaggerItem>
          </StaggerGroup>
        </>
      )}
    </div>
  );
}
