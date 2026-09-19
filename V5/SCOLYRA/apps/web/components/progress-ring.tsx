"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * ProgressRing — l'élément visuel signature de SCOLYRA : montre en un
 * coup d'œil l'écart entre le niveau actuel et l'objectif. L'anneau se
 * "remplit" à l'affichage plutôt que d'apparaître déjà plein — renforce
 * la sensation de progression à chaque ouverture de l'app.
 */
export function ProgressRing({
  current,
  target,
  size = 64,
  strokeWidth = 6,
  label,
}: {
  current: number;
  target: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}) {
  const reduce = useReducedMotion();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(1, current / Math.max(target, 1));
  const offset = circumference * (1 - progress);

  return (
    <div className="flex items-center gap-3">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-white/12"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#ring-gradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeLinecap="round"
          initial={reduce ? false : { strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        />
        <defs>
          <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9F8CF7" />
            <stop offset="100%" stopColor="#C98A2E" />
          </linearGradient>
        </defs>
      </svg>
      <div>
        <div className="font-display text-lg leading-none text-white">
          {current.toFixed(1)}
          <span className="text-sm text-white/50">/{target}</span>
        </div>
        {label && <div className="mt-1 text-xs text-white/50">{label}</div>}
      </div>
    </div>
  );
}
