"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ProgressRing } from "../../components/progress-ring";
import { Reveal, StaggerGroup, StaggerItem } from "../../components/motion";
import { demoSubjects } from "../../lib/demo-data";

export default function HomePage() {
  const weak = [...demoSubjects].sort((a, b) => a.average - b.average)[0];

  return (
    <div className="relative">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-0 -z-10 h-72 w-72 rounded-full bg-gradient-to-br from-primary-200 via-gold-100 to-transparent opacity-60 blur-3xl"
        animate={{ scale: [1, 1.15, 1], rotate: [0, 20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-3 text-sm text-primary-600">Copilote scolaire &amp; orientation</p>
          <h1 className="font-display text-4xl leading-[1.15] text-ink-900 sm:text-5xl">
            Ton plan de travail, ajusté chaque semaine à ton niveau réel.
          </h1>
          <p className="mt-5 max-w-md text-base text-ink-900/60">
            SCOLYRA relie tes notes, tes erreurs et tes objectifs pour te dire
            précisément quoi réviser cette semaine — et comment ça se connecte
            à ton orientation post-bac.
          </p>
          <div className="mt-8 flex gap-3">
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/dashboard"
                className="focus-ring block rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
              >
                Voir la démo
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/docs"
                className="focus-ring block rounded-lg border border-ink-900/15 px-5 py-2.5 text-sm font-medium text-ink-900 hover:bg-ink-900/5"
              >
                Documentation
              </Link>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl bg-ink-900 p-6 shadow-soft"
        >
          <p className="mb-4 text-xs uppercase tracking-wide text-white/40">
            Aperçu — profil de démonstration
          </p>
          <ProgressRing current={13.9} target={15} size={88} strokeWidth={8} label="Moyenne générale · objectif 15/20" />
          <motion.div
            className="mt-6 rounded-lg bg-white/5 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <p className="text-xs text-white/40">Matière à surveiller</p>
            <p className="mt-1 font-display text-lg text-white">{weak.name}</p>
            <p className="text-sm text-white/50">{weak.average}/20 — objectif {weak.target}/20</p>
          </motion.div>
        </motion.div>
      </div>

      <StaggerGroup className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-3">
        {[
          {
            title: "Profil pédagogique centralisé",
            body: "Notes, compétences, erreurs récurrentes : tout est relié, pas éparpillé entre dix outils.",
          },
          {
            title: "Révisions priorisées",
            body: "L'IA identifie les notions qui reviennent le plus souvent dans tes erreurs et les place en priorité.",
          },
          {
            title: "Orientation connectée",
            body: "Tes objectifs de notes et ta réflexion d'orientation avancent dans le même environnement.",
          },
        ].map((f) => (
          <StaggerItem key={f.title}>
            <h3 className="font-display text-lg text-ink-900">{f.title}</h3>
            <p className="mt-2 text-sm text-ink-900/60">{f.body}</p>
          </StaggerItem>
        ))}
      </StaggerGroup>

      <Reveal delay={0.1} className="mt-24 rounded-2xl border border-ink-900/8 bg-white p-8 text-center">
        <p className="font-display text-2xl text-ink-900">Prêt à voir ton propre plan ?</p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-ink-900/55">
          Explore le tableau de bord de démonstration, aucune inscription requise.
        </p>
        <motion.div className="mt-5 inline-block" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
          <Link href="/dashboard" className="focus-ring block rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-700">
            Voir la démo
          </Link>
        </motion.div>
      </Reveal>
    </div>
  );
}
