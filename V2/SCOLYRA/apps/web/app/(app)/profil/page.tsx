"use client";

import { PageHeader, Panel, Badge } from "../../../components/ui";
import { StaggerGroup, StaggerItem } from "../../../components/motion";
import { demoStudent, demoSubjects } from "../../../lib/demo-data";

export default function ProfilPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Compte"
        title="Profil pédagogique"
        description="Ce que SCOLYRA sait de toi — la base de toutes les recommandations."
      />

      <StaggerGroup className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <StaggerItem>
          <Panel hover>
            <h2 className="font-display text-lg text-ink-900 dark:text-white">Identité scolaire</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-900/55 dark:text-white/55">Nom</dt>
                <dd className="text-ink-900 dark:text-white">{demoStudent.firstName} {demoStudent.lastName}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-900/55 dark:text-white/55">Niveau</dt>
                <dd className="text-ink-900 dark:text-white">{demoStudent.schoolLevel}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-900/55 dark:text-white/55">Établissement</dt>
                <dd className="text-ink-900 dark:text-white">{demoStudent.establishment}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-900/55 dark:text-white/55">Temps disponible</dt>
                <dd className="text-ink-900 dark:text-white">{demoStudent.weeklyAvailableHours} h / semaine</dd>
              </div>
            </dl>
          </Panel>
        </StaggerItem>

        <StaggerItem>
          <Panel hover>
            <h2 className="font-display text-lg text-ink-900 dark:text-white">Spécialités</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {demoStudent.specialties.map((s) => (
                <Badge key={s} tone="primary">{s}</Badge>
              ))}
            </div>
            <h2 className="mt-6 font-display text-lg text-ink-900 dark:text-white">Points faibles identifiés</h2>
            <ul className="mt-3 space-y-1.5 text-sm text-ink-900/65 dark:text-white/65">
              {demoSubjects
                .flatMap((s) => s.mastery.filter((m) => m.level < 50).map((m) => `${m.skill} (${s.name})`))
                .slice(0, 4)
                .map((m) => (
                  <li key={m}>— {m}</li>
                ))}
            </ul>
          </Panel>
        </StaggerItem>
      </StaggerGroup>
    </div>
  );
}
