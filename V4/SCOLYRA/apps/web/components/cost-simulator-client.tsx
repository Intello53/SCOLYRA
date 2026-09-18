"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Panel, StatBlock } from "./ui";
import { Button } from "./button";
import { AnimatedNumber } from "./animated-number";
import { FORMATION_TYPES, HOUSING_TYPES, simulateCost } from "../lib/cost-simulator";

export function CostSimulatorClient() {
  const [formationCode, setFormationCode] = useState(FORMATION_TYPES[0].code);
  const [housingCode, setHousingCode] = useState(HOUSING_TYPES[0].code);
  const [years, setYears] = useState(3);
  const [isScholarshipHolder, setIsScholarshipHolder] = useState(false);
  const [computed, setComputed] = useState(false);

  const result = useMemo(
    () => simulateCost({ formationCode, housingCode, years, isScholarshipHolder }),
    [formationCode, housingCode, years, isScholarshipHolder]
  );

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Panel hover>
        <h2 className="font-display text-lg text-ink-900 dark:text-white">Ta situation</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm text-ink-900/70 dark:text-white/70">Type de formation</label>
            <select
              value={formationCode}
              onChange={(e) => { setFormationCode(e.target.value); setComputed(true); }}
              className="focus-ring w-full rounded-lg border border-ink-900/15 px-3 py-2 text-sm"
            >
              {FORMATION_TYPES.map((f) => (
                <option key={f.code} value={f.code}>{f.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-ink-900/70 dark:text-white/70">Logement</label>
            <select
              value={housingCode}
              onChange={(e) => { setHousingCode(e.target.value); setComputed(true); }}
              className="focus-ring w-full rounded-lg border border-ink-900/15 px-3 py-2 text-sm"
            >
              {HOUSING_TYPES.map((h) => (
                <option key={h.code} value={h.code}>{h.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-ink-900/70 dark:text-white/70">
              Durée envisagée : {years} an{years > 1 ? "s" : ""}
            </label>
            <input
              type="range"
              min={1}
              max={8}
              value={years}
              onChange={(e) => { setYears(parseInt(e.target.value, 10)); setComputed(true); }}
              className="w-full accent-primary-600"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-ink-900/70 dark:text-white/70">
            <input
              type="checkbox"
              checked={isScholarshipHolder}
              onChange={(e) => { setIsScholarshipHolder(e.target.checked); setComputed(true); }}
            />
            Je suis (ou pense être) boursier CROUS
          </label>
          <Button onClick={() => setComputed(true)}>Calculer</Button>
        </div>
      </Panel>

      {computed && result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Panel hover>
            <h2 className="font-display text-lg text-ink-900 dark:text-white">Estimation</h2>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <StatBlock value={<AnimatedNumber value={result.annualTotalNet} suffix="€" />} label="Par an (estimation)" tone="primary" />
              <StatBlock value={<AnimatedNumber value={result.totalOverYears} suffix="€" />} label={`Sur ${result.years} an(s)`} tone="gold" />
            </div>

            <div className="mt-5 space-y-2 text-sm text-ink-900/65 dark:text-white/65">
              <div className="flex justify-between"><span>Scolarité</span><span>≈ {result.tuitionMid.toLocaleString("fr-FR")} €/an</span></div>
              <div className="flex justify-between"><span>Logement</span><span>≈ {result.annualHousing.toLocaleString("fr-FR")} €/an</span></div>
              <div className="flex justify-between"><span>Vie courante (hors logement)</span><span>≈ {result.annualLiving.toLocaleString("fr-FR")} €/an</span></div>
              {isScholarshipHolder && (
                <div className="flex justify-between text-mastery-700">
                  <span>Bourse CROUS (estimation)</span><span>− {result.annualScholarship.toLocaleString("fr-FR")} €/an</span>
                </div>
              )}
            </div>

            <p className="mt-4 rounded-lg bg-gold-50 px-3 py-2 text-xs text-gold-800 dark:bg-gold-500/10 dark:text-gold-300">
              Estimation indicative, non contractuelle — les montants réels varient selon l'établissement, la ville et ta situation personnelle. Vérifie toujours auprès de l'établissement visé et du CROUS.
            </p>
          </Panel>
        </motion.div>
      )}
    </div>
  );
}
