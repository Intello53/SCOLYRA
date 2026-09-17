"use client";

import { PageHeader, Panel, Badge } from "../../../components/ui";
import { StaggerGroup, StaggerItem } from "../../../components/motion";
import { demoSubscription } from "../../../lib/demo-data";

export default function ParametresPage() {
  return (
    <div>
      <PageHeader eyebrow="Compte" title="Paramètres" description="Abonnement, notifications et confidentialité." />

      <StaggerGroup className="space-y-6">
        <StaggerItem>
          <Panel hover>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-lg text-ink-900 dark:text-white">Abonnement</h2>
                <p className="mt-1 text-sm text-ink-900/55 dark:text-white/55">{demoSubscription.renewalNote}</p>
              </div>
              <Badge tone={demoSubscription.plan === "PREMIUM" ? "gold" : "neutral"}>{demoSubscription.plan}</Badge>
            </div>
          </Panel>
        </StaggerItem>

        <StaggerItem>
          <Panel hover>
            <h2 className="font-display text-lg text-ink-900 dark:text-white">Confidentialité & RGPD</h2>
            <div className="mt-4 space-y-3 text-sm">
              <button className="focus-ring block text-primary-600 hover:underline">Exporter mes données</button>
              <button className="focus-ring block text-red-600 hover:underline">Supprimer mon compte</button>
            </div>
            <p className="mt-4 text-xs text-ink-900/40 dark:text-white/40">
              Fonctionnalités de démonstration — non connectées à une logique
              serveur réelle (voir docs/SECURITY.md).
            </p>
          </Panel>
        </StaggerItem>

        <StaggerItem>
          <Panel hover>
            <h2 className="font-display text-lg text-ink-900 dark:text-white">Représentant légal</h2>
            <p className="mt-2 text-sm text-ink-900/55 dark:text-white/55">
              Aucun représentant légal vérifié — requis avant tout abonnement
              payant pour un compte mineur.
            </p>
          </Panel>
        </StaggerItem>
      </StaggerGroup>
    </div>
  );
}
