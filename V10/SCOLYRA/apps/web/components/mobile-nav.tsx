"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";
import { NAV_GROUPS } from "./sidebar";

/**
 * MobileNav — la Sidebar (components/sidebar.tsx) est masquée sous le
 * breakpoint `md` (`hidden md:flex`). Sans ce composant, un visiteur
 * sur un écran étroit n'a AUCUN moyen de naviguer — pas juste un
 * détail esthétique, un vrai trou fonctionnel (ex. impossible
 * d'atteindre /aide). Réutilise exactement les mêmes liens que la
 * Sidebar (NAV_GROUPS exporté depuis sidebar.tsx) pour ne jamais
 * diverger entre les deux.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex items-center justify-between border-b border-ink-900/8 bg-white px-4 py-3 dark:border-white/8 dark:bg-ink-900 md:hidden">
      <Link href="/dashboard" className="font-display text-lg text-ink-900 dark:text-white">
        Scolyra
      </Link>
      <button
        onClick={() => setOpen(true)}
        aria-label="Ouvrir le menu"
        className="focus-ring flex h-9 w-9 items-center justify-center rounded-lg text-ink-900 dark:text-white"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/40"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed inset-y-0 right-0 z-50 flex w-72 flex-col bg-ink-900 p-5"
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="font-display text-lg text-white">Menu</span>
                <button onClick={() => setOpen(false)} aria-label="Fermer le menu" className="focus-ring text-white/60">
                  ✕
                </button>
              </div>
              <nav className="flex flex-1 flex-col gap-5 overflow-y-auto">
                {NAV_GROUPS.map((group) => (
                  <div key={group.label}>
                    <p className="mb-1.5 px-1 text-xs font-medium uppercase tracking-wider text-white/35">
                      {group.label}
                    </p>
                    <div className="flex flex-col gap-0.5">
                      {group.links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setOpen(false)}
                          className={`focus-ring rounded-lg px-3 py-2 text-sm ${
                            pathname === link.href ? "bg-white/10 text-white" : "text-white/60"
                          }`}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </nav>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="focus-ring mt-4 border-t border-white/10 pt-4 text-left text-xs text-white/45"
              >
                Déconnexion
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
