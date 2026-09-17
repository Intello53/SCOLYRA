"use client";

import { PageHeader, Panel, ProgressBar, Badge } from "../../../components/ui";
import { StaggerGroup, StaggerItem } from "../../../components/motion";
import { demoSubjects } from "../../../lib/demo-data";

const TREND_LABEL = { up: "En progression", down: "En baisse", flat: "Stable" } as const;
const TREND_TONE = { up: "mastery", down: "warn", flat: "neutral" } as const;

export default function MatieresPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Suivi"
        title="Matières"
        description="Ta moyenne et la maîtrise de chaque compétence, matière par matière."
      />

      <StaggerGroup className="space-y-6">
        {demoSubjects.map((s) => (
          <StaggerItem key={s.slug}>
            <Panel hover>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl text-ink-900 dark:text-white">{s.name}</h2>
                  <p className="text-sm text-ink-900/55 dark:text-white/55">
                    {s.average}/20 · objectif {s.target}/20
                  </p>
                </div>
                <Badge tone={TREND_TONE[s.trend]}>{TREND_LABEL[s.trend]}</Badge>
              </div>

              <div className="mt-4">
                <ProgressBar value={s.average} max={s.target} tone={s.average >= s.target ? "mastery" : "primary"} />
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {s.mastery.map((m) => (
                  <div key={m.skill}>
                    <div className="mb-1 flex items-center justify-between text-xs text-ink-900/60 dark:text-white/60">
                      <span>{m.skill}</span>
                      <span>{m.level}%</span>
                    </div>
                    <ProgressBar value={m.level} max={100} tone={m.level >= 70 ? "mastery" : m.level >= 45 ? "primary" : "gold"} />
                  </div>
                ))}
              </div>
            </Panel>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </div>
  );
}
