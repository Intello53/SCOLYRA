"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader, Panel, Badge } from "../../../components/ui";
import { useCelebrate } from "../../../components/celebration";
import { demoRevisionPlan } from "../../../lib/demo-data";

const STATUS_FLOW = ["À faire", "En cours", "Fait"] as const;
const PRIORITY_TONE = { Haute: "warn", Moyenne: "gold", Basse: "neutral" } as const;
const STATUS_TONE = { "À faire": "neutral", "En cours": "primary", Fait: "mastery" } as const;

export default function RevisionsPage() {
  const [sessions, setSessions] = useState(demoRevisionPlan.sessions.map((s) => ({ ...s })));
  const celebrate = useCelebrate();

  function advanceStatus(index: number) {
    setSessions((prev) => {
      const next = prev.map((s, i) => {
        if (i !== index) return s;
        const currentIndex = STATUS_FLOW.indexOf(s.status as (typeof STATUS_FLOW)[number]);
        const nextStatus = STATUS_FLOW[(currentIndex + 1) % STATUS_FLOW.length];
        return { ...s, status: nextStatus };
      });
      if (next[index].status === "Fait") celebrate(`Session terminée — ${next[index].skill}`);
      return next;
    });
  }

  const doneCount = sessions.filter((s) => s.status === "Fait").length;

  return (
    <div>
      <PageHeader
        eyebrow="Travail"
        title="Révisions"
        description={`${demoRevisionPlan.title} — clique sur une session pour faire avancer son statut.`}
        action={<Badge tone="mastery">{doneCount}/{sessions.length} terminées</Badge>}
      />

      <Panel>
        <div className="divide-y divide-ink-900/8 dark:divide-white/8">
          {sessions.map((s, i) => (
            <button
              key={s.skill}
              onClick={() => advanceStatus(i)}
              className="focus-ring flex w-full flex-wrap items-center justify-between gap-3 py-4 text-left first:pt-0 last:pb-0 hover:bg-ink-900/[0.02] dark:hover:bg-white/5"
            >
              <div>
                <p className="text-sm text-ink-900 dark:text-white">{s.skill}</p>
                <p className="text-xs text-ink-900/50 dark:text-white/50">
                  {s.subject} · {s.minutes} min
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={PRIORITY_TONE[s.priority as keyof typeof PRIORITY_TONE]}>{s.priority}</Badge>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={s.status}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Badge tone={STATUS_TONE[s.status as keyof typeof STATUS_TONE]}>{s.status}</Badge>
                  </motion.span>
                </AnimatePresence>
              </div>
            </button>
          ))}
        </div>
      </Panel>

      <p className="mt-6 text-xs text-ink-900/40 dark:text-white/40">
        Priorisation basée sur la fréquence de tes erreurs récentes et le temps restant avant l'échéance.
      </p>
    </div>
  );
}
