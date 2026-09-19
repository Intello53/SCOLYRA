"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const LINKS = [
  { href: "/admin", label: "Vue d'ensemble" },
  { href: "/admin/eleves", label: "Élèves" },
  { href: "/admin/fonctionnalites", label: "Fonctionnalités" },
  { href: "/admin/contenus", label: "Contenus" },
  { href: "/admin/abonnements", label: "Abonnements" },
  { href: "/admin/journal", label: "Journal d'audit" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 flex-col bg-ink-950 p-5 md:flex">
      <div className="mb-1 flex items-center gap-2 px-1">
        <span className="font-display text-lg text-white">Scolyra</span>
        <span className="rounded-md bg-gold-500/20 px-1.5 py-0.5 text-[11px] font-medium text-gold-300">
          Admin
        </span>
      </div>
      <p className="mb-6 px-1 text-xs text-white/35">Espace d'administration</p>

      <nav className="flex flex-col gap-0.5">
        {LINKS.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`focus-ring relative rounded-lg px-3 py-2 text-sm transition-colors ${
                active ? "text-white" : "text-white/55 hover:text-white"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="admin-active-pill"
                  className="absolute inset-0 rounded-lg bg-white/10"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <span className="relative">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-white/10 pt-4">
        <Link href="/dashboard" className="px-1 text-xs text-white/40 hover:text-white/65">
          ← Retour à l'espace élève
        </Link>
      </div>
    </aside>
  );
}
