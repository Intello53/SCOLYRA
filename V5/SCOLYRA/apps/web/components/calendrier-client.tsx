"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Panel, Badge } from "./ui";
import { StaggerGroup, StaggerItem } from "./motion";
import { Button } from "./button";
import { useCelebrate } from "./celebration";

type SessionItem = { id: string; title: string; startAt: string; endAt: string; completed: boolean; subjectName: string | null };
type DayColumn = { day: string; date: string; sessions: SessionItem[] };
type SubjectOption = { subjectId: string; name: string };

const DAY_LABELS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

export function CalendrierClient({ week, subjects }: { week: DayColumn[]; subjects: SubjectOption[] }) {
  const router = useRouter();
  const celebrate = useCelebrate();
  const [creating, setCreating] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [dayIndex, setDayIndex] = useState(0);
  const [time, setTime] = useState("18:00");
  const [minutes, setMinutes] = useState("45");

  async function createSession() {
    if (!title.trim()) return;
    setPending(true);
    setError(null);

    const targetDate = new Date(week[dayIndex].date);
    const [h, m] = time.split(":").map(Number);
    targetDate.setHours(h, m, 0, 0);
    const endDate = new Date(targetDate.getTime() + parseInt(minutes || "45", 10) * 60_000);

    const res = await fetch("/api/study-sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        subjectId: subjectId || undefined,
        startAt: targetDate.toISOString(),
        endAt: endDate.toISOString(),
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
    setCreating(false);
    celebrate("Session ajoutée au calendrier");
    router.refresh();
  }

  async function toggleCompleted(session: SessionItem) {
    await fetch(`/api/study-sessions/${session.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !session.completed }),
    });
    if (!session.completed) celebrate("Session marquée comme faite");
    router.refresh();
  }

  return (
    <div>
      {error && <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

      <StaggerGroup className="grid grid-cols-1 gap-4 sm:grid-cols-7">
        {week.map((day, di) => (
          <StaggerItem key={day.day}>
            <Panel hover className="!p-4 h-full">
              <h3 className="font-display text-sm text-ink-900 dark:text-white">{day.day}</h3>
              <div className="mt-3 space-y-2">
                {day.sessions.length === 0 ? (
                  <p className="text-xs text-ink-900/35 dark:text-white/35">Libre</p>
                ) : (
                  day.sessions.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => toggleCompleted(s)}
                      className={`focus-ring block w-full rounded-lg p-2 text-left text-xs transition-opacity ${
                        s.completed ? "bg-mastery-50 opacity-60 dark:bg-mastery-500/10" : "bg-primary-50 dark:bg-primary-500/10"
                      }`}
                    >
                      <p className="font-medium text-primary-700 dark:text-primary-200">
                        {new Date(s.startAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                      <p className={`text-ink-900/70 dark:text-white/70 ${s.completed ? "line-through" : ""}`}>{s.title}</p>
                      {s.subjectName && <p className="text-ink-900/40 dark:text-white/40">{s.subjectName}</p>}
                    </button>
                  ))
                )}
              </div>
              <button
                onClick={() => {
                  setDayIndex(di);
                  setCreating(true);
                }}
                className="focus-ring mt-2 text-xs text-primary-600 hover:underline"
              >
                + Session
              </button>
            </Panel>
          </StaggerItem>
        ))}
      </StaggerGroup>

      {creating && (
        <Panel className="mt-6 space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-sm text-ink-900/60 dark:text-white/60">
            Ajouter le <Badge tone="primary">{DAY_LABELS[dayIndex]}</Badge>
          </div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre de la session"
            className="focus-ring w-full rounded-lg border border-ink-900/15 px-3 py-2 text-sm"
          />
          <div className="grid grid-cols-3 gap-3">
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
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="focus-ring rounded-lg border border-ink-900/15 px-3 py-2 text-sm"
            />
            <input
              type="number"
              min={5}
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              placeholder="Durée (min)"
              className="focus-ring rounded-lg border border-ink-900/15 px-3 py-2 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={createSession} disabled={pending}>{pending ? "…" : "Ajouter"}</Button>
            <Button variant="secondary" onClick={() => setCreating(false)}>Annuler</Button>
          </div>
        </Panel>
      )}
    </div>
  );
}
