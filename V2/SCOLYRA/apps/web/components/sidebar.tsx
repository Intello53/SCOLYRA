"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ProgressRing } from "./progress-ring";
import { demoStudent, demoOverallAverage, demoOverallTarget, demoStreak } from "../lib/demo-data";

const NAV_GROUPS = [
  {
    label: "Travail",
    links: [
      { href: "/dashboard", label: "Tableau de bord" },
      { href: "/objectifs", label: "Objectifs" },
      { href: "/revisions", label: "Révisions" },
      { href: "/calendrier", label: "Calendrier" },
      { href: "/coach", label: "Coach IA" },
    ],
  },
  {
    label: "Suivi",
    links: [
      { href: "/matieres", label: "Matières" },
      { href: "/documents", label: "Documents" },
      { href: "/projets", label: "Projets" },
      { href: "/orientation", label: "Orientation" },
    ],
  },
  {
    label: "Compte",
    links: [
      { href: "/profil", label: "Profil" },
      { href: "/parametres", label: "Paramètres" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 flex-col bg-ink-900 p-5 md:flex">
      <Link href="/" className="mb-6 flex items-center gap-2 px-1">
        <span className="font-display text-xl text-white">Scolyra</span>
      </Link>

      <div className="mb-4 rounded-xl bg-white/5 p-4">
        <ProgressRing
          current={demoOverallAverage}
          target={demoOverallTarget}
          label={`${demoStudent.firstName} · moyenne générale`}
        />
      </div>

      <div className="mb-6 flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold-500/15 to-transparent px-3 py-2">
        <motion.span
          className="text-lg"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          🔥
        </motion.span>
        <span className="text-sm text-gold-200">
          <strong className="font-display">{demoStreak}</strong> jours de suite
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-5 overflow-y-auto">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="mb-1.5 px-3 text-xs font-medium uppercase tracking-wider text-white/35">
              {group.label}
            </p>
            <div className="flex flex-col gap-0.5">
              {group.links.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`focus-ring relative rounded-lg px-3 py-2 text-sm transition-colors ${
                      active ? "text-white" : "text-white/60 hover:text-white"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="sidebar-active-pill"
                        className="absolute inset-0 rounded-lg bg-white/10"
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      />
                    )}
                    <span className="relative">{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4 px-1">
        <Link href="/docs" className="text-xs text-white/45 hover:text-white/70">
          Documentation
        </Link>
        <span className="rounded-full bg-gold-500/15 px-2 py-0.5 text-[11px] font-medium text-gold-300">
          Démo
        </span>
      </div>
    </aside>
  );
}
