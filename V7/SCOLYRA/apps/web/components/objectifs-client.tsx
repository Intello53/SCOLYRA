"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Panel, ProgressBar, Badge, EmptyState } from "./ui";
import { StaggerGroup, StaggerItem } from "./motion";
import { Button } from "./button";
import { useCelebrate } from "./celebration";

type Milestone = { label: string; done: boolean };
type Goal = {
  id: string;
  title: string;
  targetValue: number | null;
  currentValue: number | null;
  deadline: string | null;
  milestones: Milestone[] | null;
};
type SubjectOption = { subjectId: string; name: string };

export function ObjectifsClient({ goals, subjects }: { goals: Goal[]; subjects: SubjectOption[] }) {
  const router = useRouter();
  const celebrate = useCelebrate();
  const [creating, setCreating] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [currentValue, setCurrentValue] = useState("");
  const [deadline, setDeadline] = useState("");
  const [milestonesText, setMilestonesText] = useState("");

  async function createGoal() {
    if (!title.trim()) return;
    setPending(true);
    setError(null);
    const milestones = milestonesText
      .split(",")
      .map((m) => m.trim())
      .filter(Boolean)
      .map((label) => ({ label, done: false }));

    const res = await fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        subjectId: subjectId || undefined,
        targetValue: targetValue ? parseFloat(targetValue) : undefined,
        currentValue: currentValue ? parseFloat(currentValue) : undefined,
        deadline: deadline || undefined,
        milestones,
      }),
    });
    setPending(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Erreur lors de la création.");
      return;
    }
    setTitle("");
    setSubjectId("");
    setTargetValue("");
    setCurrentValue("");
    setDeadline("");
    setMilestonesText("");
    setCreating(false);
    celebrate("Objectif créé");
    router.refresh();
  }

  async function toggleMilestone(goal: Goal, index: number) {
    const nextMilestones = (goal.milestones ?? []).map((m, i) => (i === index ? { ...m, done: !m.done } : m));
    await fetch(`/api/goals/${goal.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ milestones: nextMilestones }),
    });
    if (nextMilestones[index].done) celebrate(`Palier validé — ${nextMilestones[index].label}`);
    router.refresh();
  }

  return (
    <div>
      {error && <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

      {goals.length === 0 && !creating && (
        <EmptyState
          title="Aucun objectif actif"
          description="Crée un objectif de moyenne ou un objectif qualitatif pour que le coach IA puisse le suivre."
          action={<Button className="mt-2" onClick={() => setCreating(true)}>+ Créer un objectif</Button>}
        />
      )}

      <StaggerGroup className="space-y-6">
        {goals.map((g) => {
          const milestones = g.milestones ?? [];
          const doneCount = milestones.filter((m) => m.done).length;
          return (
            <StaggerItem key={g.id}>
              <Panel hover>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="font-display text-xl text-ink-900 dark:text-white">{g.title}</h2>
                  {g.deadline && (
                    <Badge tone="neutral">Échéance : {new Date(g.deadline).toLocaleDateString("fr-FR")}</Badge>
                  )}
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

                {milestones.length > 0 && (
                  <>
                    <div className="mt-4 flex items-center gap-2 text-xs text-ink-900/45 dark:text-white/45">
                      <span>{doneCount}/{milestones.length} paliers validés</span>
                      <div className="h-1 flex-1 overflow-hidden rounded-full bg-ink-900/8 dark:bg-white/10">
                        <motion.div
                          className="h-full rounded-full bg-mastery-500"
                          animate={{ width: `${(doneCount / milestones.length) * 100}%` }}
                          transition={{ duration: 0.4 }}
                        />
                      </div>
                    </div>
                    <ul className="mt-4 space-y-2">
                      {milestones.map((m, mi) => (
                        <li key={mi}>
                          <button
                            onClick={() => toggleMilestone(g, mi)}
                            className="focus-ring flex w-full items-center gap-3 rounded-lg py-1 text-left text-sm hover:bg-ink-900/[0.03] dark:hover:bg-white/5"
                          >
                            <span
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs ${
                                m.done ? "bg-mastery-500 text-white" : "border border-ink-900/20 dark:border-white/20"
                              }`}
                            >
                              {m.done ? "✓" : ""}
                            </span>
                            <span className={m.done ? "text-ink-900/45 line-through dark:text-white/40" : "text-ink-900 dark:text-white"}>
                              {m.label}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </Panel>
            </StaggerItem>
          );
        })}
      </StaggerGroup>

      {creating ? (
        <Panel className="mt-6 space-y-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre de l'objectif"
            className="focus-ring w-full rounded-lg border border-ink-900/15 px-3 py-2 text-sm"
          />
          <div className="grid grid-cols-2 gap-3">
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="focus-ring rounded-lg border border-ink-900/15 px-3 py-2 text-sm"
            >
              <option value="">Matière (optionnel)</option>
              {subjects.map((s) => (
                <option key={s.subjectId} value={s.subjectId}>{s.name}</option>
              ))}
            </select>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="focus-ring rounded-lg border border-ink-900/15 px-3 py-2 text-sm"
            />
            <input
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              placeholder="Moyenne actuelle (optionnel)"
              className="focus-ring rounded-lg border border-ink-900/15 px-3 py-2 text-sm"
            />
            <input
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
              placeholder="Objectif chiffré (optionnel)"
              className="focus-ring rounded-lg border border-ink-900/15 px-3 py-2 text-sm"
            />
          </div>
          <input
            value={milestonesText}
            onChange={(e) => setMilestonesText(e.target.value)}
            placeholder="Paliers séparés par des virgules (optionnel)"
            className="focus-ring w-full rounded-lg border border-ink-900/15 px-3 py-2 text-sm"
          />
          <div className="flex gap-2">
            <Button onClick={createGoal} disabled={pending}>{pending ? "…" : "Créer l'objectif"}</Button>
            <Button variant="secondary" onClick={() => setCreating(false)}>Annuler</Button>
          </div>
        </Panel>
      ) : (
        goals.length > 0 && (
          <Button variant="secondary" className="mt-6" onClick={() => setCreating(true)}>
            + Créer un objectif
          </Button>
        )
      )}
    </div>
  );
}
