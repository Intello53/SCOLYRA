"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Panel, Badge, EmptyState } from "./ui";
import { Button } from "./button";
import { useCelebrate } from "./celebration";

type RevisionSessionItem = { id: string; title: string; subjectName: string | null; priority: number; status: string };
type SubjectOption = { subjectId: string; name: string };

const STATUS_FLOW = ["PLANNED", "IN_PROGRESS", "DONE"] as const;
const STATUS_LABEL: Record<string, string> = { PLANNED: "À faire", IN_PROGRESS: "En cours", DONE: "Fait", SKIPPED: "Ignoré" };
const STATUS_TONE: Record<string, "neutral" | "primary" | "mastery"> = {
  PLANNED: "neutral",
  IN_PROGRESS: "primary",
  DONE: "mastery",
  SKIPPED: "neutral",
};
const PRIORITY_LABEL = (p: number) => (p <= 2 ? "Haute" : p === 3 ? "Moyenne" : "Basse");
const PRIORITY_TONE = (p: number): "warn" | "gold" | "neutral" => (p <= 2 ? "warn" : p === 3 ? "gold" : "neutral");

export function RevisionsClient({ sessions: initialSessions, subjects }: { sessions: RevisionSessionItem[]; subjects: SubjectOption[] }) {
  const router = useRouter();
  const celebrate = useCelebrate();
  const [sessions, setSessions] = useState(initialSessions);
  const [creating, setCreating] = useState(false);
  const [pending, setPending] = useState(false);
  const [skill, setSkill] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [priority, setPriority] = useState(3);

  async function createSession() {
    if (!skill.trim()) return;
    setPending(true);
    const res = await fetch("/api/revision-sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skill, subjectId: subjectId || undefined, priority }),
    });
    setPending(false);
    if (!res.ok) return;
    setSkill("");
    setSubjectId("");
    setCreating(false);
    celebrate("Session de révision ajoutée");
    router.refresh();
  }

  async function advanceStatus(session: RevisionSessionItem) {
    const currentIndex = STATUS_FLOW.indexOf(session.status as (typeof STATUS_FLOW)[number]);
    const nextStatus = STATUS_FLOW[(currentIndex + 1) % STATUS_FLOW.length] ?? "PLANNED";
    setSessions((prev) => prev.map((s) => (s.id === session.id ? { ...s, status: nextStatus } : s)));
    await fetch(`/api/revision-sessions/${session.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    if (nextStatus === "DONE") celebrate(`Session terminée — ${session.title}`);
    router.refresh();
  }

  const doneCount = sessions.filter((s) => s.status === "DONE").length;

  return (
    <div>
      {sessions.length === 0 && !creating ? (
        <EmptyState
          title="Aucune session de révision"
          description="Ajoute une notion à réviser — priorise-la selon tes erreurs récentes."
          action={<Button className="mt-2" onClick={() => setCreating(true)}>+ Ajouter une session</Button>}
        />
      ) : (
        <>
          <div className="mb-4 flex justify-end">
            <Badge tone="mastery">{doneCount}/{sessions.length} terminées</Badge>
          </div>
          <Panel>
            <div className="divide-y divide-ink-900/8 dark:divide-white/8">
              {sessions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => advanceStatus(s)}
                  className="focus-ring flex w-full flex-wrap items-center justify-between gap-3 py-4 text-left first:pt-0 last:pb-0 hover:bg-ink-900/[0.02] dark:hover:bg-white/5"
                >
                  <div>
                    <p className="text-sm text-ink-900 dark:text-white">{s.title}</p>
                    {s.subjectName && <p className="text-xs text-ink-900/50 dark:text-white/50">{s.subjectName}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge tone={PRIORITY_TONE(s.priority)}>{PRIORITY_LABEL(s.priority)}</Badge>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={s.status}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.15 }}
                      >
                        <Badge tone={STATUS_TONE[s.status]}>{STATUS_LABEL[s.status]}</Badge>
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </button>
              ))}
            </div>
          </Panel>
        </>
      )}

      {creating ? (
        <Panel className="mt-6 space-y-3">
          <input
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            placeholder="Notion à réviser (ex: Probabilités conditionnelles)"
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
            <select
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value))}
              className="focus-ring rounded-lg border border-ink-900/15 px-3 py-2 text-sm"
            >
              <option value={1}>Priorité haute</option>
              <option value={3}>Priorité moyenne</option>
              <option value={5}>Priorité basse</option>
            </select>
          </div>
          <div className="flex gap-2">
            <Button onClick={createSession} disabled={pending}>{pending ? "…" : "Ajouter"}</Button>
            <Button variant="secondary" onClick={() => setCreating(false)}>Annuler</Button>
          </div>
        </Panel>
      ) : (
        sessions.length > 0 && (
          <Button variant="secondary" className="mt-6" onClick={() => setCreating(true)}>+ Ajouter une session</Button>
        )
      )}

      <p className="mt-6 text-xs text-ink-900/40 dark:text-white/40">
        Clique sur une session pour faire avancer son statut (à faire → en cours → fait).
      </p>
    </div>
  );
}
