"use client";

import { PageHeader, Panel } from "../../../components/ui";
import { StaggerGroup, StaggerItem } from "../../../components/motion";
import { demoCalendarWeek } from "../../../lib/demo-data";

export default function CalendrierPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Travail"
        title="Calendrier"
        description="Tes sessions de travail réparties dans la semaine, en fonction de ton temps disponible."
      />

      <StaggerGroup className="grid grid-cols-1 gap-4 sm:grid-cols-7">
        {demoCalendarWeek.map((day) => (
          <StaggerItem key={day.day}>
            <Panel hover className="!p-4 h-full">
              <h3 className="font-display text-sm text-ink-900 dark:text-white">{day.day}</h3>
              <div className="mt-3 space-y-2">
                {day.sessions.length === 0 ? (
                  <p className="text-xs text-ink-900/35 dark:text-white/35">Libre</p>
                ) : (
                  day.sessions.map((s) => (
                    <div key={s.title} className="rounded-lg bg-primary-50 p-2 text-xs dark:bg-primary-500/10">
                      <p className="font-medium text-primary-700 dark:text-primary-200">{s.time}</p>
                      <p className="text-ink-900/70 dark:text-white/70">{s.title}</p>
                      <p className="text-ink-900/40 dark:text-white/40">{s.minutes} min</p>
                    </div>
                  ))
                )}
              </div>
            </Panel>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </div>
  );
}
