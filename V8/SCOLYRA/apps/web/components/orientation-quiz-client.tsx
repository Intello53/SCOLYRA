"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Panel, Badge, ProgressBar } from "./ui";
import { Button } from "./button";
import type { QuizQuestion } from "../lib/orientation-quiz";

type Result = {
  topDomains: { domain: string; label: string; score: number }[];
  disclaimer: string;
  geographicMaxDistanceKm: number | null;
  geographicPreferredRegions: string[];
};

export function OrientationQuizClient({
  questions,
  initialMaxDistance,
  initialRegions,
}: {
  questions: QuizQuestion[];
  initialMaxDistance: number | null;
  initialRegions: string[];
}) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [maxDistance, setMaxDistance] = useState(initialMaxDistance?.toString() ?? "");
  const [regions, setRegions] = useState(initialRegions.join(", "));
  const [askGeo, setAskGeo] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);

  const current = questions[index];
  const progress = askGeo || result ? questions.length : index;

  function selectOption(optionId: string) {
    const next = { ...answers, [current.id]: optionId };
    setAnswers(next);
    if (index < questions.length - 1) {
      setTimeout(() => setIndex(index + 1), 200);
    } else {
      setTimeout(() => setAskGeo(true), 200);
    }
  }

  async function submit() {
    setLoading(true);
    const res = await fetch("/api/orientation/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        answers,
        geographicMaxDistanceKm: maxDistance ? parseInt(maxDistance, 10) : null,
        geographicPreferredRegions: regions.split(",").map((r) => r.trim()).filter(Boolean),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) setResult(data.result);
  }

  if (result) {
    return (
      <Panel>
        <h2 className="font-display text-xl text-ink-900 dark:text-white">Tes domaines les plus cohérents</h2>
        <div className="mt-5 space-y-4">
          {result.topDomains.map((d, i) => (
            <div key={d.domain}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-ink-900 dark:text-white">
                  {i + 1}. {d.label}
                </span>
                <span className="text-ink-900/45 dark:text-white/45">{d.score} pts</span>
              </div>
              <ProgressBar value={d.score} max={result.topDomains[0].score} tone={i === 0 ? "gold" : "primary"} />
            </div>
          ))}
        </div>
        {(result.geographicMaxDistanceKm || result.geographicPreferredRegions.length > 0) && (
          <p className="mt-4 text-sm text-ink-900/60 dark:text-white/60">
            Contrainte géographique prise en compte :{" "}
            {result.geographicMaxDistanceKm && `max ${result.geographicMaxDistanceKm} km`}
            {result.geographicPreferredRegions.length > 0 && ` · régions : ${result.geographicPreferredRegions.join(", ")}`}
          </p>
        )}
        <p className="mt-4 rounded-lg bg-gold-50 px-3 py-2 text-xs text-gold-800 dark:bg-gold-500/10 dark:text-gold-300">
          {result.disclaimer}
        </p>
      </Panel>
    );
  }

  if (askGeo) {
    return (
      <Panel>
        <h2 className="font-display text-xl text-ink-900 dark:text-white">Une dernière chose</h2>
        <p className="mt-1 text-sm text-ink-900/55 dark:text-white/55">
          Contrainte géographique — optionnel, aide à contextualiser le résultat.
        </p>
        <div className="mt-4 space-y-3">
          <input
            type="number"
            min={0}
            value={maxDistance}
            onChange={(e) => setMaxDistance(e.target.value)}
            placeholder="Distance max depuis chez toi (km)"
            className="focus-ring w-full rounded-lg border border-ink-900/15 px-3 py-2 text-sm"
          />
          <input
            value={regions}
            onChange={(e) => setRegions(e.target.value)}
            placeholder="Régions préférées (optionnel)"
            className="focus-ring w-full rounded-lg border border-ink-900/15 px-3 py-2 text-sm"
          />
        </div>
        <Button className="mt-4" onClick={submit} disabled={loading}>
          {loading ? "Calcul en cours…" : "Voir mon résultat"}
        </Button>
      </Panel>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-900/8 dark:bg-white/10">
          <motion.div
            className="h-full rounded-full bg-primary-500"
            animate={{ width: `${(progress / questions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <Badge tone="neutral">{index + 1}/{questions.length}</Badge>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.2 }}
        >
          <Panel>
            <h2 className="font-display text-lg text-ink-900 dark:text-white">{current.prompt}</h2>
            <div className="mt-4 space-y-2">
              {current.options.map((o) => (
                <button
                  key={o.id}
                  onClick={() => selectOption(o.id)}
                  className={`focus-ring block w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                    answers[current.id] === o.id
                      ? "border-primary-500 bg-primary-50 text-primary-700"
                      : "border-ink-900/15 hover:bg-ink-900/[0.03] dark:border-white/15 dark:hover:bg-white/5"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </Panel>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
