"use client";

import { PageHeader, Panel, Badge, EmptyState } from "../../../components/ui";
import { StaggerGroup, StaggerItem } from "../../../components/motion";
import { demoOrientation } from "../../../lib/demo-data";

export default function OrientationPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Suivi"
        title="Orientation"
        description="Domaines envisagés, candidatures et échéances — reliés à ton profil pédagogique."
      />

      <StaggerGroup className="space-y-6">
        <StaggerItem>
          <Panel hover>
            <h2 className="font-display text-lg text-ink-900 dark:text-white">Domaines envisagés</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {demoOrientation.desiredFields.map((f) => (
                <Badge key={f} tone="primary">{f}</Badge>
              ))}
            </div>
          </Panel>
        </StaggerItem>

        <StaggerItem>
          <h2 className="mb-3 font-display text-lg text-ink-900 dark:text-white">Candidatures</h2>
          <EmptyState
            title="Aucune formation officielle enregistrée"
            description="SCOLYRA n'invente jamais de données Parcoursup, de prérequis ou de statistiques officielles. Cette section reste vide tant qu'une source vérifiée n'est pas intégrée (voir docs/ROADMAP.md, V3)."
          />
        </StaggerItem>

        <StaggerItem>
          <Panel hover>
            <h2 className="font-display text-lg text-ink-900 dark:text-white">Échéances indicatives</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {demoOrientation.deadlines.map((d) => (
                <li key={d.title} className="flex justify-between text-ink-900/70 dark:text-white/70">
                  <span>{d.title}</span>
                  <span className="text-ink-900/40 dark:text-white/40">J-{d.inDays}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-ink-900/40 dark:text-white/40">
              Dates indicatives, à vérifier auprès d'une source officielle.
            </p>
          </Panel>
        </StaggerItem>
      </StaggerGroup>
    </div>
  );
}
