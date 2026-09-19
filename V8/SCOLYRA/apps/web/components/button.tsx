"use client";

import { motion } from "framer-motion";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

const VARIANT_CLASS: Record<Variant, string> = {
  primary: "bg-primary-600 text-white hover:bg-primary-700",
  secondary: "border border-ink-900/15 text-ink-900 hover:bg-ink-900/5 dark:border-white/15 dark:text-white dark:hover:bg-white/5",
  ghost: "text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-500/10",
};

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={`focus-ring rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-50 ${VARIANT_CLASS[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
