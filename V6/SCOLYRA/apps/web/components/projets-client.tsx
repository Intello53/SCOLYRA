"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Panel, Badge, EmptyState } from "./ui";
import { StaggerGroup, StaggerItem } from "./motion";
import { Button } from "./button";
import { useCelebrate } from "./celebration";

type Task = { id: string; title: string; status: string };
type ProjectItem = { id: string; title: string; description: string | null; deadline: string | null; tasks: Task[] };

export function ProjetsClient({ projects }: { projects: ProjectItem[] }) {
  const router = useRouter();
  const celebrate = useCelebrate();
  const [creating, setCreating] = useState(false);
  const [pending, setPending] = useState(false);
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [tasksText, setTasksText] = useState("");
  const [newTaskByProject, setNewTaskByProject] = useState<Record<string, string>>({});

  async function createProject() {
    if (!title.trim()) return;
    setPending(true);
    const initialTasks = tasksText.split(",").map((t) => t.trim()).filter(Boolean);
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, deadline: deadline || undefined, initialTasks }),
    });
    setPending(false);
    if (!res.ok) return;
    setTitle("");
    setDeadline("");
    setTasksText("");
    setCreating(false);
    celebrate("Projet créé");
    router.refresh();
  }

  async function addTask(projectId: string) {
    const label = (newTaskByProject[projectId] ?? "").trim();
    if (!label) return;
    await fetch(`/api/projects/${projectId}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: label }),
    });
    setNewTaskByProject((prev) => ({ ...prev, [projectId]: "" }));
    router.refresh();
  }

  async function toggleTask(task: Task) {
    const nextStatus = task.status === "DONE" ? "TODO" : "DONE";
    await fetch(`/api/project-tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    if (nextStatus === "DONE") celebrate(`Tâche validée — ${task.title}`);
    router.refresh();
  }

  return (
    <div>
      {projects.length === 0 && !creating && (
        <EmptyState
          title="Aucun projet pour l'instant"
          description="Grand Oral, TIPE, dossiers — crée ton premier projet et décompose-le en tâches."
          action={<Button className="mt-2" onClick={() => setCreating(true)}>+ Créer un projet</Button>}
        />
      )}

      <StaggerGroup className="space-y-6">
        {projects.map((p) => {
          const doneCount = p.tasks.filter((t) => t.status === "DONE").length;
          const progress = p.tasks.length > 0 ? Math.round((doneCount / p.tasks.length) * 100) : 0;
          return (
            <StaggerItem key={p.id}>
              <Panel hover>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="font-display text-xl text-ink-900 dark:text-white">{p.title}</h2>
                  {p.deadline && <Badge tone="neutral">Échéance : {new Date(p.deadline).toLocaleDateString("fr-FR")}</Badge>}
                </div>

                <div className="mt-4">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-900/8 dark:bg-white/10">
                    <motion.div
                      className="h-full rounded-full bg-primary-500"
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-ink-900/45 dark:text-white/45">{progress}% complété</p>
                </div>

                <ul className="mt-5 space-y-2">
                  {p.tasks.map((t) => (
                    <li key={t.id}>
                      <button
                        onClick={() => toggleTask(t)}
                        className="focus-ring flex w-full items-center gap-3 rounded-lg py-1 text-left text-sm hover:bg-ink-900/[0.03] dark:hover:bg-white/5"
                      >
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs ${
                            t.status === "DONE" ? "bg-mastery-500 text-white" : "border border-ink-900/20 dark:border-white/20"
                          }`}
                        >
                          {t.status === "DONE" ? "✓" : ""}
                        </span>
                        <span className={t.status === "DONE" ? "text-ink-900/45 line-through dark:text-white/40" : "text-ink-900 dark:text-white"}>
                          {t.title}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="mt-3 flex gap-2">
                  <input
                    value={newTaskByProject[p.id] ?? ""}
                    onChange={(e) => setNewTaskByProject((prev) => ({ ...prev, [p.id]: e.target.value }))}
                    onKeyDown={(e) => e.key === "Enter" && addTask(p.id)}
                    placeholder="Nouvelle tâche…"
                    className="focus-ring flex-1 rounded-lg border border-ink-900/15 px-3 py-1.5 text-sm"
                  />
                  <Button variant="secondary" onClick={() => addTask(p.id)}>Ajouter</Button>
                </div>
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
            placeholder="Titre du projet"
            className="focus-ring w-full rounded-lg border border-ink-900/15 px-3 py-2 text-sm"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="focus-ring rounded-lg border border-ink-900/15 px-3 py-2 text-sm"
            />
            <input
              value={tasksText}
              onChange={(e) => setTasksText(e.target.value)}
              placeholder="Tâches initiales séparées par des virgules"
              className="focus-ring rounded-lg border border-ink-900/15 px-3 py-2 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={createProject} disabled={pending}>{pending ? "…" : "Créer le projet"}</Button>
            <Button variant="secondary" onClick={() => setCreating(false)}>Annuler</Button>
          </div>
        </Panel>
      ) : (
        projects.length > 0 && (
          <Button variant="secondary" className="mt-6" onClick={() => setCreating(true)}>+ Créer un projet</Button>
        )
      )}
    </div>
  );
}
