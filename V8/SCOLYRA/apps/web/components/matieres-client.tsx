"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Panel, ProgressBar, Badge } from "./ui";
import { StaggerGroup, StaggerItem } from "./motion";
import { Button } from "./button";
import { useCelebrate } from "./celebration";
import type { SubjectWithStats } from "../lib/grades";

export function MatieresClient({ subjects }: { subjects: SubjectWithStats[] }) {
  const router = useRouter();
  const celebrate = useCelebrate();
  const [openGradeForm, setOpenGradeForm] = useState<string | null>(null);
  const [gradeValue, setGradeValue] = useState("");
  const [gradeLabel, setGradeLabel] = useState("");
  const [addingSubject, setAddingSubject] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submitGrade(subjectId: string) {
    const value = parseFloat(gradeValue.replace(",", "."));
    if (isNaN(value) || value < 0 || value > 20) {
      setError("Note invalide (entre 0 et 20).");
      return;
    }
    setPending(true);
    setError(null);
    const res = await fetch("/api/grades", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subjectId, value, label: gradeLabel || undefined }),
    });
    setPending(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Erreur lors de l'ajout.");
      return;
    }
    setGradeValue("");
    setGradeLabel("");
    setOpenGradeForm(null);
    celebrate("Note ajoutée");
    router.refresh();
  }

  async function toggleInclude(userSubjectId: string, current: boolean) {
    await fetch(`/api/user-subjects/${userSubjectId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ includeInAverage: !current }),
    });
    router.refresh();
  }

  async function submitNewSubject() {
    if (!newSubjectName.trim()) return;
    setPending(true);
    setError(null);
    const res = await fetch("/api/subjects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newSubjectName.trim(), includeInAverage: true }),
    });
    setPending(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Erreur lors de la création.");
      return;
    }
    setNewSubjectName("");
    setAddingSubject(false);
    celebrate(`Matière "${newSubjectName}" ajoutée`);
    router.refresh();
  }

  return (
    <div>
      {error && <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

      <StaggerGroup className="space-y-6">
        {subjects.map((s) => (
          <StaggerItem key={s.userSubjectId}>
            <Panel hover>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-xl text-ink-900 dark:text-white">{s.name}</h2>
                    {s.isSpecialty && <Badge tone="primary">Spécialité</Badge>}
                    {s.isCustom && <Badge tone="neutral">Personnalisée</Badge>}
                  </div>
                  <p className="text-sm text-ink-900/55 dark:text-white/55">
                    {s.average !== null ? `${s.average}/20` : "Aucune note"} · {s.gradeCount} note(s)
                  </p>
                </div>
                <label className="flex items-center gap-2 text-xs text-ink-900/55 dark:text-white/55">
                  <input
                    type="checkbox"
                    checked={s.includeInAverage}
                    onChange={() => toggleInclude(s.userSubjectId, s.includeInAverage)}
                  />
                  Compter dans la moyenne
                </label>
              </div>

              {s.average !== null && (
                <div className="mt-4">
                  <ProgressBar value={s.average} max={20} tone="primary" />
                </div>
              )}

              {openGradeForm === s.userSubjectId ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 flex flex-wrap items-center gap-2"
                >
                  <input
                    value={gradeValue}
                    onChange={(e) => setGradeValue(e.target.value)}
                    placeholder="Note /20"
                    className="focus-ring w-24 rounded-lg border border-ink-900/15 px-2 py-1.5 text-sm"
                  />
                  <input
                    value={gradeLabel}
                    onChange={(e) => setGradeLabel(e.target.value)}
                    placeholder="Intitulé (optionnel)"
                    className="focus-ring flex-1 rounded-lg border border-ink-900/15 px-2 py-1.5 text-sm"
                  />
                  <Button onClick={() => submitGrade(s.subjectId)} disabled={pending}>
                    {pending ? "…" : "Ajouter"}
                  </Button>
                  <Button variant="secondary" onClick={() => setOpenGradeForm(null)}>Annuler</Button>
                </motion.div>
              ) : (
                <button
                  onClick={() => setOpenGradeForm(s.userSubjectId)}
                  className="focus-ring mt-4 text-sm text-primary-600 hover:underline"
                >
                  + Ajouter une note
                </button>
              )}
            </Panel>
          </StaggerItem>
        ))}
      </StaggerGroup>

      <div className="mt-6">
        {addingSubject ? (
          <Panel className="flex flex-wrap items-center gap-2">
            <input
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
              placeholder="Nom de la matière (ex: Renforcement oral anglais)"
              className="focus-ring min-w-[220px] flex-1 rounded-lg border border-ink-900/15 px-3 py-2 text-sm"
            />
            <Button onClick={submitNewSubject} disabled={pending}>{pending ? "…" : "Créer"}</Button>
            <Button variant="secondary" onClick={() => setAddingSubject(false)}>Annuler</Button>
          </Panel>
        ) : (
          <Button variant="secondary" onClick={() => setAddingSubject(true)}>+ Ajouter une matière</Button>
        )}
      </div>
    </div>
  );
}
