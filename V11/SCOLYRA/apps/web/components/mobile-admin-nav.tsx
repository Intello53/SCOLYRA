"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ADMIN_LINKS } from "./admin-sidebar";

export function MobileAdminNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  const pathname = usePathname();

  return (
    <div className="flex items-center justify-between border-b border-white/10 bg-ink-950 px-4 py-3 md:hidden">
      <div className="flex items-center gap-2">
        <span className="font-display text-lg text-white">Scolyra</span>
        <span className="rounded-md bg-gold-500/20 px-1.5 py-0.5 text-[11px] font-medium text-gold-300">Admin</span>
      </div>
      <button
        onClick={() => setOpen(true)}
        aria-label="Ouvrir le menu" aria-expanded={open} aria-haspopup="dialog"
        className="focus-ring flex h-9 w-9 items-center justify-center rounded-lg text-white"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false">
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
              role="dialog"
              aria-modal="true"
              aria-label="Menu de navigation"
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed inset-y-0 right-0 z-50 flex w-64 flex-col bg-ink-950 p-5"
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="font-display text-lg text-white">Menu</span>
                <button onClick={() => setOpen(false)} aria-label="Fermer le menu" className="focus-ring text-white/60">
                  ✕
                </button>
              </div>
              <nav className="flex flex-col gap-0.5">
                {ADMIN_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`focus-ring rounded-lg px-3 py-2 text-sm ${
                      pathname === link.href ? "bg-white/10 text-white" : "text-white/55"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <Link href="/dashboard" onClick={() => setOpen(false)} className="focus-ring mt-auto border-t border-white/10 pt-4 text-xs text-white/55">
                ← Retour à l'espace élève
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
