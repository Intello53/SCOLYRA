"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Panel, Badge } from "./ui";
import { StaggerGroup, StaggerItem } from "./motion";

type Flag = { id: string; key: string; label: string; description: string | null; premiumOnly: boolean };

export function FeatureFlagsClient({ flags }: { flags: Flag[] }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function toggle(flag: Flag) {
    setPendingId(flag.id);
    await fetch(`/api/admin/feature-flags/${flag.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ premiumOnly: !flag.premiumOnly }),
    });
    setPendingId(null);
    router.refresh();
  }

  return (
    <StaggerGroup className="space-y-4">
      {flags.map((flag) => (
        <StaggerItem key={flag.id}>
          <Panel hover className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-base text-ink-900 dark:text-white">{flag.label}</h2>
                <Badge tone={flag.premiumOnly ? "gold" : "mastery"}>{flag.premiumOnly ? "Premium" : "Gratuit"}</Badge>
              </div>
              {flag.description && (
                <p className="mt-1 text-sm text-ink-900/55 dark:text-white/55">{flag.description}</p>
              )}
              <p className="mt-0.5 text-xs text-ink-900/35 dark:text-white/35">clé : {flag.key}</p>
            </div>

            <button
              onClick={() => toggle(flag)}
              disabled={pendingId === flag.id}
              className={`focus-ring relative h-7 w-12 shrink-0 rounded-full transition-colors disabled:opacity-50 ${
                flag.premiumOnly ? "bg-gold-500" : "bg-mastery-500"
              }`}
              aria-label={`Basculer ${flag.label}`}
            >
              <motion.span
                className="absolute top-1 h-5 w-5 rounded-full bg-white shadow"
                animate={{ left: flag.premiumOnly ? 26 : 4 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
          </Panel>
        </StaggerItem>
      ))}
    </StaggerGroup>
  );
}
