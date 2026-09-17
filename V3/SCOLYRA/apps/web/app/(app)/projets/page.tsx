"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PageHeader, Panel, Badge } from "../../../components/ui";
import { StaggerGroup, StaggerItem } from "../../../components/motion";
import { useCelebrate } from "../../../components/celebration";
import { demoProjects } from "../../../lib/demo-data";

export default function ProjetsPage() {
  const [projects, setProjects] = useState(
    demoProjects.map((p) => ({ ...p, tasks: p.tasks.map((t) => ({ ...t })) }))
  );
  const celebrate = useCelebrate();

  function toggleTask(pi: number, ti: number) {
    setProjects((prev) => {
      const next = prev.map((p, pIndex) =>
        pIndex === pi
          ? { ...p, tasks: p.tasks.map((t, tIndex) => (tIndex === ti ? { ...t, done: !t.done } : t)) }
          : p
      );
      const task = next[pi].tasks[ti];
      const allDone = next[pi].tasks.every((t) => t.done);
      if (task.done) celebrate(allDone ? `Projet "${next[pi].title}" terminé 🎉` : `Tâche validée — ${task.label}`);
      const doneCount = next[pi].tasks.filter((t) => t.done).length;
      next[pi].progress = Math.round((doneCount / next[pi].tasks.length) * 100);
      return next;
    });
  }

  return (
    <div>
      <PageHeader
        eyebrow="Suivi"
        title="Projets"
        description="Grand Oral, TIPE, dossiers — suivis avec un assistant IA dédié. Coche les tâches au fur et à mesure."
      />

      <StaggerGroup className="space-y-6">
        {projects.map((p, pi) => (
          <StaggerItem key={p.title}>
            <Panel hover>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-display text-xl text-ink-900 dark:text-white">{p.title}</h2>
                <Badge tone={p.status === "En cours" ? "primary" : "neutral"}>{p.status}</Badge>
              </div>
              <p className="mt-1 text-sm text-ink-900/50 dark:text-white/50">Échéance : {p.deadline}</p>

              <div className="mt-4">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-900/8 dark:bg-white/10">
                  <motion.div
                    className="h-full rounded-full bg-primary-500"
                    animate={{ width: `${p.progress}%` }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
                <p className="mt-1 text-xs text-ink-900/45 dark:text-white/45">{p.progress}% complété</p>
              </div>

              <ul className="mt-5 space-y-2">
                {p.tasks.map((t, ti) => (
                  <li key={t.label}>
                    <button
                      onClick={() => toggleTask(pi, ti)}
                      className="focus-ring flex w-full items-center gap-3 rounded-lg py-1 text-left text-sm hover:bg-ink-900/[0.03] dark:hover:bg-white/5"
                    >
                      <motion.span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs ${
                          t.done ? "bg-mastery-500 text-white" : "border border-ink-900/20 dark:border-white/20"
                        }`}
                        animate={t.done ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {t.done ? "✓" : ""}
                      </motion.span>
                      <span className={t.done ? "text-ink-900/45 line-through dark:text-white/40" : "text-ink-900 dark:text-white"}>
                        {t.label}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </Panel>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </div>
  );
}
