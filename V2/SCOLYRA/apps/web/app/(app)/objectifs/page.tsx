"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader, Panel, ProgressBar, Badge } from "../../../components/ui";
import { StaggerGroup, StaggerItem } from "../../../components/motion";
import { useCelebrate } from "../../../components/celebration";
import { demoGoals } from "../../../lib/demo-data";

export default function ObjectifsPage() {
  const [goals, setGoals] = useState(demoGoals.map((g) => ({ ...g, milestones: g.milestones.map((m) => ({ ...m })) })));
  const celebrate = useCelebrate();

  function toggleMilestone(goalIndex: number, milestoneIndex: number) {
    setGoals((prev) => {
      const next = prev.map((g, gi) =>
        gi === goalIndex
          ? {
              ...g,
              milestones: g.milestones.map((m, mi) =>
                mi === milestoneIndex ? { ...m, done: !m.done } : m
              ),
            }
          : g
      );
      const milestone = next[goalIndex].milestones[milestoneIndex];
      if (milestone.done) celebrate(`Palier validé — ${milestone.label}`);
      return next;
    });
  }

  return (
    <div>
      <PageHeader
        eyebrow="Travail"
        title="Objectifs"
        description="Chaque objectif est décomposé en paliers atteignables. Coche-les au fur et à mesure. Les estimations ne garantissent jamais un résultat."
      />

      <StaggerGroup className="space-y-6">
        {goals.map((g, gi) => {
          const doneCount = g.milestones.filter((m) => m.done).length;
          return (
            <StaggerItem key={g.title}>
              <Panel hover>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="font-display text-xl text-ink-900 dark:text-white">{g.title}</h2>
                  <Badge tone="neutral">Échéance : {g.deadline}</Badge>
                </div>

                {g.currentValue !== null && g.targetValue !== null && (
                  <div className="mt-4">
                    <div className="mb-1.5 flex justify-between text-sm text-ink-900/60 dark:text-white/60">
                      <span>{g.currentValue}/20</span>
                      <span>{g.targetValue}/20</span>
                    </div>
                    <ProgressBar value={g.currentValue} max={g.targetValue} tone="gold" />
                  </div>
                )}

                <div className="mt-4 flex items-center gap-2 text-xs text-ink-900/45 dark:text-white/45">
                  <span>{doneCount}/{g.milestones.length} paliers validés</span>
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-ink-900/8 dark:bg-white/10">
                    <motion.div
                      className="h-full rounded-full bg-mastery-500"
                      animate={{ width: `${(doneCount / g.milestones.length) * 100}%` }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </div>

                <ul className="mt-5 space-y-2">
                  {g.milestones.map((m, mi) => (
                    <li key={m.label}>
                      <button
                        onClick={() => toggleMilestone(gi, mi)}
                        className="focus-ring flex w-full items-center gap-3 rounded-lg py-1 text-left text-sm hover:bg-ink-900/[0.03] dark:hover:bg-white/5"
                      >
                        <motion.span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs ${
                            m.done ? "bg-mastery-500 text-white" : "border border-ink-900/20 text-transparent dark:border-white/20"
                          }`}
                          animate={m.done ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          ✓
                        </motion.span>
                        <span className={m.done ? "text-ink-900/45 line-through dark:text-white/40" : "text-ink-900 dark:text-white"}>
                          {m.label}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </Panel>
            </StaggerItem>
          );
        })}
      </StaggerGroup>

      <p className="mt-6 text-xs text-ink-900/40 dark:text-white/40">
        Ces recommandations sont des estimations pédagogiques, pas une garantie de résultat.
      </p>
    </div>
  );
}
