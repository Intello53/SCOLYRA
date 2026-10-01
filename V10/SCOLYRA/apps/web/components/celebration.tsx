"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { Confetti } from "./confetti";
import { ToastProvider, useToast } from "./toast";

type CelebrationContextValue = { celebrate: (message: string) => void };
const CelebrationContext = createContext<CelebrationContextValue | null>(null);

function CelebrationInner({ children }: { children: ReactNode }) {
  const [trigger, setTrigger] = useState(0);
  const { push } = useToast();

  const celebrate = useCallback(
    (message: string) => {
      setTrigger((t) => t + 1);
      push(message, "success");
    },
    [push]
  );

  return (
    <CelebrationContext.Provider value={{ celebrate }}>
      <Confetti trigger={trigger} />
      {children}
    </CelebrationContext.Provider>
  );
}

export function CelebrationProvider({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <CelebrationInner>{children}</CelebrationInner>
    </ToastProvider>
  );
}

/** useCelebrate — déclenche confettis + toast en un seul appel. */
export function useCelebrate() {
  const ctx = useContext(CelebrationContext);
  if (!ctx) throw new Error("useCelebrate doit être utilisé dans <CelebrationProvider>");
  return ctx.celebrate;
}
