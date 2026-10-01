"use client";

import { SessionProvider } from "next-auth/react";
import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  // reducedMotion="user" : framer-motion respecte la préférence système
  // « réduire les animations » (WCAG 2.2.2 / 2.3.3, RGAA 13.8) — le CSS
  // seul (globals.css) ne suffit pas pour les animations JS.
  return (
    <SessionProvider>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </SessionProvider>
  );
}
