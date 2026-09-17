"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SCHOOL_LEVELS,
  getOptionsForLevel,
  getSpecialtiesForLevel,
  getMaxSpecialties,
  type SchoolLevelCode,
} from "../../../lib/curriculum";
import { Button } from "../../../components/button";

type Step = "identite" | "classe" | "options" | "specialites";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("identite");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isMinor, setIsMinor] = useState(true);
  const [establishment, setEstablishment] = useState("");
  const [schoolLevel, setSchoolLevel] = useState<SchoolLevelCode | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [specialties, setSpecialties] = useState<string[]>([]);

  const level = useMemo(() => SCHOOL_LEVELS.find((l) => l.code === schoolLevel) ?? null, [schoolLevel]);
  const availableOptions = schoolLevel ? getOptionsForLevel(schoolLevel) : [];
  const availableSpecialties = schoolLevel ? getSpecialtiesForLevel(schoolLevel) : [];
  const maxSpecialties = schoolLevel ? getMaxSpecialties(schoolLevel) : 0;

  function toggle(list: string[], setList: (v: string[]) => void, code: string, max?: number) {
    if (list.includes(code)) {
      setList(list.filter((c) => c !== code));
    } else {
      if (max && list.length >= max) return;
      setList([...list, code]);
    }
  }

  function goNextFromClasse() {
    if (!level) return;
    if (level.hasOptions && availableOptions.length > 0) setStep("options");
    else if (level.hasSpecialties) setStep("specialites");
    else submit();
  }

  function goNextFromOptions() {
    if (level?.hasSpecialties && availableSpecialties.length > 0) setStep("specialites");
    else submit();
  }

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          email,
          password,
          isMinor,
          schoolLevel,
          establishment: establishment || undefined,
          options,
          specialties,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        setLoading(false);
        return;
      }
      const signInResult = await signIn("credentials", { email, password, redirect: false });
      if (signInResult?.error) {
        setError("Compte créé, mais la connexion automatique a échoué. Essaie de te connecter manuellement.");
        setLoading(false);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Impossible de contacter le serveur.");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="font-display text-2xl text-ink-900">Inscription</h1>
      <p className="mt-2 text-sm text-ink-900/55">
        Quelques questions pour construire ton profil pédagogique dès le départ.
      </p>

      <div className="mt-6 flex gap-1.5">
        {(["identite", "classe", "options", "specialites"] as Step[]).map((s) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full ${
              step === s ? "bg-primary-600" : "bg-ink-900/10"
            }`}
          />
        ))}
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      )}

      <AnimatePresence mode="wait">
        {step === "identite" && (
          <motion.form
            key="identite"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setStep("classe");
            }}
          >
            <div>
              <label className="mb-1.5 block text-sm text-ink-900/70">Prénom</label>
              <input
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Léa"
                className="focus-ring w-full rounded-lg border border-ink-900/15 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-ink-900/70">Email</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="prenom@exemple.fr"
                className="focus-ring w-full rounded-lg border border-ink-900/15 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-ink-900/70">Mot de passe</label>
              <input
                required
                type="password"
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="8 caractères minimum"
                className="focus-ring w-full rounded-lg border border-ink-900/15 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-ink-900/70">Établissement (optionnel)</label>
              <input
                value={establishment}
                onChange={(e) => setEstablishment(e.target.value)}
                placeholder="Lycée..."
                className="focus-ring w-full rounded-lg border border-ink-900/15 px-3 py-2 text-sm"
              />
            </div>
            <label className="flex items-start gap-2 text-sm text-ink-900/70">
              <input type="checkbox" checked={isMinor} onChange={(e) => setIsMinor(e.target.checked)} className="mt-0.5" />
              Je suis mineur·e — un représentant légal devra être validé avant tout abonnement payant.
            </label>
            <Button type="submit" className="w-full">Continuer</Button>
          </motion.form>
        )}

        {step === "classe" && (
          <motion.div
            key="classe"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}
            className="mt-6"
          >
            <p className="mb-3 text-sm text-ink-900/70">Dans quelle classe es-tu ?</p>
            <div className="grid grid-cols-2 gap-2">
              {SCHOOL_LEVELS.filter((l) => l.stage !== "post-bac").map((l) => (
                <button
                  key={l.code}
                  onClick={() => setSchoolLevel(l.code)}
                  className={`focus-ring rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
                    schoolLevel === l.code
                      ? "border-primary-500 bg-primary-50 text-primary-700"
                      : "border-ink-900/15 hover:bg-ink-900/[0.03]"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <div className="mt-6 flex gap-2">
              <Button variant="secondary" onClick={() => setStep("identite")}>← Retour</Button>
              <Button className="flex-1" disabled={!schoolLevel} onClick={goNextFromClasse}>
                Continuer
              </Button>
            </div>
          </motion.div>
        )}

        {step === "options" && level && (
          <motion.div
            key="options"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}
            className="mt-6"
          >
            <p className="mb-1 text-sm text-ink-900/70">
              Options en {level.label} <span className="text-ink-900/40">(facultatif)</span>
            </p>
            {level.optionsNote && <p className="mb-3 text-xs text-ink-900/45">{level.optionsNote}</p>}
            <div className="space-y-2">
              {availableOptions.map((o) => (
                <button
                  key={o.code}
                  onClick={() => toggle(options, setOptions, o.code)}
                  className={`focus-ring block w-full rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
                    options.includes(o.code)
                      ? "border-primary-500 bg-primary-50 text-primary-700"
                      : "border-ink-900/15 hover:bg-ink-900/[0.03]"
                  }`}
                >
                  {o.label}
                  {o.note && <span className="ml-1.5 text-xs text-ink-900/40">— {o.note}</span>}
                </button>
              ))}
            </div>
            <div className="mt-6 flex gap-2">
              <Button variant="secondary" onClick={() => setStep("classe")}>← Retour</Button>
              <Button className="flex-1" onClick={goNextFromOptions} disabled={loading}>
                {level.hasSpecialties && availableSpecialties.length > 0 ? "Continuer" : loading ? "Création…" : "Créer mon compte"}
              </Button>
            </div>
          </motion.div>
        )}

        {step === "specialites" && level && (
          <motion.div
            key="specialites"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}
            className="mt-6"
          >
            <p className="mb-1 text-sm text-ink-900/70">
              Spécialités en {level.label}{" "}
              <span className="text-ink-900/40">
                ({specialties.length}/{maxSpecialties})
              </span>
            </p>
            {level.specialtiesNote && <p className="mb-3 text-xs text-ink-900/45">{level.specialtiesNote}</p>}
            <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
              {availableSpecialties.map((s) => (
                <button
                  key={s.code}
                  onClick={() => toggle(specialties, setSpecialties, s.code, maxSpecialties)}
                  className={`focus-ring block w-full rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
                    specialties.includes(s.code)
                      ? "border-primary-500 bg-primary-50 text-primary-700"
                      : "border-ink-900/15 hover:bg-ink-900/[0.03]"
                  }`}
                >
                  {s.label}
                  {s.note && <span className="ml-1.5 text-xs text-ink-900/40">— {s.note}</span>}
                </button>
              ))}
            </div>
            <div className="mt-6 flex gap-2">
              <Button variant="secondary" onClick={() => setStep("options")}>← Retour</Button>
              <Button className="flex-1" onClick={() => submit()} disabled={loading}>
                {loading ? "Création…" : "Créer mon compte"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-6 text-sm text-ink-900/55">
        Déjà inscrit·e ?{" "}
        <Link href="/login" className="text-primary-600 hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
