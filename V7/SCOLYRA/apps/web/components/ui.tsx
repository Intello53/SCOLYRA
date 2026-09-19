"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="mb-8 flex flex-col gap-4 border-b border-ink-900/8 pb-6 dark:border-white/8 sm:flex-row sm:items-end sm:justify-between"
    >
      <div>
        {eyebrow && (
          <p className="mb-1 text-sm text-primary-600 dark:text-primary-300">{eyebrow}</p>
        )}
        <h1 className="font-display text-3xl text-ink-900 dark:text-white">{title}</h1>
        {description && (
          <p className="mt-2 max-w-xl text-sm text-ink-900/60 dark:text-white/60">
            {description}
          </p>
        )}
      </div>
      {action}
    </motion.div>
  );
}

export function StatBlock({
  value,
  unit,
  label,
  tone = "neutral",
}: {
  value: ReactNode;
  unit?: string;
  label: string;
  tone?: "neutral" | "gold" | "mastery" | "primary";
}) {
  const toneClass = {
    neutral: "text-ink-900 dark:text-white",
    gold: "text-gold-600",
    mastery: "text-mastery-700",
    primary: "text-primary-600",
  }[tone];

  return (
    <div>
      <div className={`font-display text-4xl tabular-nums ${toneClass}`}>
        {value}
        {unit && <span className="text-lg text-ink-900/40 dark:text-white/40"> {unit}</span>}
      </div>
      <div className="mt-1 text-sm text-ink-900/55 dark:text-white/55">{label}</div>
    </div>
  );
}

export function ProgressBar({
  value,
  max,
  tone = "primary",
  delay = 0,
}: {
  value: number;
  max: number;
  tone?: "primary" | "gold" | "mastery";
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const pct = Math.min(100, Math.round((value / max) * 100));
  const barClass = {
    primary: "bg-primary-500",
    gold: "bg-gold-500",
    mastery: "bg-mastery-500",
  }[tone];

  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-900/8 dark:bg-white/10">
      <motion.div
        className={`h-full rounded-full ${barClass}`}
        initial={reduce ? false : { width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "gold" | "mastery" | "primary" | "warn";
}) {
  const toneClass = {
    neutral: "bg-ink-900/6 text-ink-900/70 dark:bg-white/10 dark:text-white/70",
    gold: "bg-gold-50 text-gold-700 dark:bg-gold-500/15 dark:text-gold-300",
    mastery: "bg-mastery-50 text-mastery-700 dark:bg-mastery-500/15 dark:text-mastery-200",
    primary: "bg-primary-50 text-primary-700 dark:bg-primary-500/15 dark:text-primary-200",
    warn: "bg-amber-50 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  }[tone];

  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${toneClass}`}>
      {children}
    </span>
  );
}

export function Panel({
  children,
  className = "",
  hover = false,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <motion.div
      className={`rounded-2xl border border-ink-900/8 bg-white p-6 shadow-soft dark:border-white/8 dark:bg-ink-800 ${className}`}
      whileHover={hover ? { y: -2, boxShadow: "0 8px 30px -12px rgba(91,61,245,0.25)" } : undefined}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-2xl border border-dashed border-ink-900/15 p-8 dark:border-white/15">
      <h3 className="font-display text-lg text-ink-900 dark:text-white">{title}</h3>
      <p className="max-w-md text-sm text-ink-900/55 dark:text-white/55">{description}</p>
      {action}
    </div>
  );
}
