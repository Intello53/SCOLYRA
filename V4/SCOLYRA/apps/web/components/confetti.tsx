"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const COLORS = ["#5B3DF5", "#C98A2E", "#1E9E70", "#9F8CF7", "#E7B665"];

type Piece = { id: number; x: number; rotate: number; color: string; delay: number; drift: number };

/**
 * Confetti — petite salve de confettis déclenchée à la validation d'un
 * palier/objectif/tâche. Se nettoie toute seule après l'animation.
 */
export function Confetti({ trigger }: { trigger: number }) {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    if (trigger === 0) return;
    const next = Array.from({ length: 22 }, (_, i) => ({
      id: trigger * 100 + i,
      x: Math.random() * 100,
      rotate: Math.random() * 360,
      color: COLORS[i % COLORS.length],
      delay: Math.random() * 0.15,
      drift: (Math.random() - 0.5) * 60,
    }));
    setPieces(next);
    const timeout = setTimeout(() => setPieces([]), 1200);
    return () => clearTimeout(timeout);
  }, [trigger]);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0 overflow-visible">
      <AnimatePresence>
        {pieces.map((p) => (
          <motion.span
            key={p.id}
            className="absolute top-0 block h-2.5 w-1.5 rounded-[1px]"
            style={{ left: `${p.x}%`, backgroundColor: p.color }}
            initial={{ y: -10, x: 0, opacity: 1, rotate: 0 }}
            animate={{ y: 220, x: p.drift, opacity: 0, rotate: p.rotate }}
            transition={{ duration: 0.9, delay: p.delay, ease: "easeOut" }}
            exit={{ opacity: 0 }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
