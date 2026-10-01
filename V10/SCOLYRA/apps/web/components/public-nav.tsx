"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const LINKS = [
  { href: "/about", label: "À propos" },
  { href: "/pricing", label: "Tarifs" },
  { href: "/docs", label: "Documentation" },
];

export function PublicNav() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="border-b border-ink-900/8"
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <Link href="/" className="font-display text-xl text-ink-900">
          Scolyra
        </Link>
        <nav className="hidden items-center gap-6 sm:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm text-ink-900/65 transition-colors hover:text-ink-900">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-ink-900/65 hover:text-ink-900">
            Connexion
          </Link>
          <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/register"
              className="focus-ring block rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              Essayer la démo
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}
