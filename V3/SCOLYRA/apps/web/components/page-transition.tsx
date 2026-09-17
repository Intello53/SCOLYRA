"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * PageTransition — à utiliser dans un template.tsx (qui se remonte à
 * chaque navigation, contrairement à layout.tsx) pour un fondu doux
 * entre les pages plutôt qu'un changement instantané et sec.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
