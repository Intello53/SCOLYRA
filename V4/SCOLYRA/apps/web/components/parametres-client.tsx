"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Panel, Badge } from "./ui";
import { StaggerGroup, StaggerItem } from "./motion";
import { Button } from "./button";
import { useCelebrate } from "./celebration";

export function ParametresClient({ plan, isMinor, hasVerifiedGuardian }: { plan: string; isMinor: boolean; hasVerifiedGuardian: boolean }) {
  const router = useRouter();
  const celebrate = useCelebrate();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function upgrade() {
    setPending(true);
    setError(null);
    const res = await fetch("/api/subscription/upgrade", { method: "POST" });
    const data = await res.json();
    setPending(false);
    if (!res.ok) {
      setError(data.error ?? "Impossible de passer en Premium.");
      return;
    }
    celebrate("Bienvenue en Premium 🎉");
    router.refresh();
  }

  async function exportData() {
    const res = await fetch("/api/account/export");
    if (!res.ok) {
      setError("Impossible d'exporter les données pour l'instant.");
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "scolyra-mes-donnees.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function deleteAccount() {
    setDeleting(true);
    const res = await fetch("/api/account/delete", { method: "DELETE" });
    if (!res.ok) {
      setError("Impossible de supprimer le compte pour l'instant.");
      setDeleting(false);
      return;
    }
    await signOut({ callbackUrl: "/" });
  }

  return (
    <StaggerGroup className="space-y-6">
      <StaggerItem>
        <Panel hover>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg text-ink-900 dark:text-white">Abonnement</h2>
              <p className="mt-1 text-sm text-ink-900/55 dark:text-white/55">
                {plan === "PREMIUM"
                  ? "Tu profites de l'analyse de copies illimitée, du quiz d'orientation et du simulateur de coût."
                  : "Passe en Premium pour débloquer le quiz d'orientation, le simulateur de coût et l'analyse de copies illimitée."}
              </p>
            </div>
            <Badge tone={plan === "PREMIUM" ? "gold" : "neutral"}>{plan}</Badge>
          </div>

          {error && <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

          {plan !== "PREMIUM" && (
            <>
              {isMinor && !hasVerifiedGuardian && (
                <p className="mt-3 text-xs text-amber-700">
                  Compte mineur : un représentant légal vérifié est requis avant de passer en Premium (voir docs/SECURITY.md — cette vérification n'est pas encore implémentée en V0, donc l'upgrade est bloqué pour l'instant sur ce compte).
                </p>
              )}
              <Button className="mt-4" onClick={upgrade} disabled={pending}>
                {pending ? "…" : "Passer en Premium"}
              </Button>
              <p className="mt-2 text-xs text-ink-900/40 dark:text-white/40">
                Démo — aucun paiement réel n'est traité (voir docs/PAYMENTS.md).
              </p>
            </>
          )}
        </Panel>
      </StaggerItem>

      <StaggerItem>
        <Panel hover>
          <h2 className="font-display text-lg text-ink-900 dark:text-white">Confidentialité & RGPD</h2>
          <div className="mt-4 space-y-3 text-sm">
            <button onClick={exportData} className="focus-ring block text-primary-600 hover:underline">
              Exporter mes données (JSON)
            </button>
            {!confirmingDelete ? (
              <button onClick={() => setConfirmingDelete(true)} className="focus-ring block text-red-600 hover:underline">
                Supprimer mon compte
              </button>
            ) : (
              <div className="rounded-lg bg-red-50 p-3">
                <p className="text-sm text-red-800">
                  Cette action est définitive et supprime toutes tes données (notes, objectifs, orientation...).
                  Confirmer ?
                </p>
                <div className="mt-2 flex gap-2">
                  <Button variant="secondary" onClick={() => setConfirmingDelete(false)}>Annuler</Button>
                  <button
                    onClick={deleteAccount}
                    disabled={deleting}
                    className="focus-ring rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    {deleting ? "Suppression…" : "Oui, supprimer définitivement"}
                  </button>
                </div>
              </div>
            )}
          </div>
          <p className="mt-4 text-xs text-ink-900/40 dark:text-white/40">
            Export et suppression sont réels (RGPD art. 15/17/20) — voir docs/SECURITY.md.
          </p>
        </Panel>
      </StaggerItem>

      <StaggerItem>
        <Panel hover>
          <h2 className="font-display text-lg text-ink-900 dark:text-white">Représentant légal</h2>
          <p className="mt-2 text-sm text-ink-900/55 dark:text-white/55">
            {hasVerifiedGuardian
              ? "Représentant légal vérifié."
              : "Aucun représentant légal vérifié — requis avant tout abonnement payant pour un compte mineur."}
          </p>
        </Panel>
      </StaggerItem>
    </StaggerGroup>
  );
}
