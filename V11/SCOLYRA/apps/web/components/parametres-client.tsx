"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Panel, Badge } from "./ui";
import { StaggerGroup, StaggerItem } from "./motion";
import { Button } from "./button";
import { useCelebrate } from "./celebration";

// Exposé au bundle client par Next.js (préfixe NEXT_PUBLIC_) — sa
// seule présence signale que Stripe est configuré côté serveur aussi
// (les deux sont censés être renseignés ensemble, voir .env.example).
const STRIPE_ENABLED = Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export function ParametresClient({ plan, isMinor, hasVerifiedGuardian }: { plan: string; isMinor: boolean; hasVerifiedGuardian: boolean }) {
  const router = useRouter();
  const celebrate = useCelebrate();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [guardianEmail, setGuardianEmail] = useState("");
  const [invitingGuardian, setInvitingGuardian] = useState(false);
  const [guardianMessage, setGuardianMessage] = useState<string | null>(null);
  const [portalPending, setPortalPending] = useState(false);
  const [acceptedCgv, setAcceptedCgv] = useState(false);
  const [immediateAccess, setImmediateAccess] = useState(false);

  async function inviteGuardian() {
    if (!guardianEmail.trim()) return;
    setInvitingGuardian(true);
    setGuardianMessage(null);
    const res = await fetch("/api/guardian/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guardianEmail }),
    });
    const data = await res.json();
    setInvitingGuardian(false);
    if (!res.ok) {
      setGuardianMessage(data.error ?? "Erreur lors de l'envoi.");
      return;
    }
    setGuardianMessage(
      data.emailSent
        ? "Email envoyé — demande à ton représentant légal de vérifier sa boîte mail."
        : "Invitation créée, mais l'e-mail n'a pas pu être envoyé. Réessaie plus tard ou contacte l'assistance."
    );
    setGuardianEmail("");
  }

  async function upgrade() {
    setPending(true);
    setError(null);

    if (STRIPE_ENABLED) {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ acceptedCgv, immediateAccess }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPending(false);
        setError(data.error ?? "Impossible de démarrer le paiement.");
        return;
      }
      // Redirection vers la page de paiement hébergée par Stripe —
      // SCOLYRA ne voit jamais le numéro de carte.
      window.location.href = data.url;
      return;
    }

    // Repli démo (aucun paiement réel) — actif uniquement si Stripe
    // n'est pas configuré, voir docs/PAYMENTS.md.
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

  async function openBillingPortal() {
    setPortalPending(true);
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const data = await res.json();
    setPortalPending(false);
    if (!res.ok) {
      setError(data.error ?? "Impossible d'ouvrir le portail de facturation.");
      return;
    }
    window.location.href = data.url;
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
              <p className="mt-1 text-sm text-ink-900/60 dark:text-white/55">
                {plan === "PREMIUM"
                  ? "Tu profites de l'analyse de copies illimitée, du quiz d'orientation et du simulateur de coût."
                  : "Passe en Premium pour débloquer le quiz d'orientation, le simulateur de coût et l'analyse de copies illimitée."}
              </p>
            </div>
            <Badge tone={plan === "PREMIUM" ? "gold" : "neutral"}>{plan}</Badge>
          </div>

          {error && <div role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

          {plan !== "PREMIUM" && (
            <>
              {isMinor && !hasVerifiedGuardian && (
                <p className="mt-3 text-xs text-amber-700">
                  Compte mineur : un représentant légal vérifié est requis avant de passer en Premium — invite-le juste en dessous, dans la section "Représentant légal".
                </p>
              )}
              {STRIPE_ENABLED && (
                <fieldset className="mt-4 space-y-2 rounded-lg border border-ink-900/20 p-3">
                  <legend className="px-1 text-sm font-medium text-ink-900 dark:text-white">Avant de payer</legend>
                  <p className="text-sm text-ink-900/70 dark:text-white/70">
                    Premium : 6,90 € TTC par mois, renouvelé tacitement, résiliable en ligne à tout moment depuis cette page.
                  </p>
                  <label className="flex items-start gap-2 text-sm text-ink-900/70 dark:text-white/70">
                    <input type="checkbox" className="mt-0.5" checked={acceptedCgv} onChange={(e) => setAcceptedCgv(e.target.checked)} />
                    <span>
                      J'ai lu et j'accepte les{" "}
                      <Link href="/cgv" target="_blank" className="text-primary-700 underline dark:text-primary-300">CGV</Link>.
                    </span>
                  </label>
                  <label className="flex items-start gap-2 text-sm text-ink-900/70 dark:text-white/70">
                    <input type="checkbox" className="mt-0.5" checked={immediateAccess} onChange={(e) => setImmediateAccess(e.target.checked)} />
                    <span>
                      Je demande l'accès immédiat à Premium et je comprends que, si je me rétracte dans les 14 jours, je
                      paierai un montant proportionnel au service déjà fourni (
                      <Link href="/retractation" target="_blank" className="text-primary-700 underline dark:text-primary-300">droit de rétractation</Link>).
                    </span>
                  </label>
                </fieldset>
              )}
              <Button className="mt-4" onClick={upgrade} disabled={pending || (STRIPE_ENABLED && (!acceptedCgv || !immediateAccess))}>
                {pending ? "…" : STRIPE_ENABLED ? "Commander avec obligation de paiement — 6,90 € / mois" : "Passer en Premium"}
              </Button>
              <p className="mt-2 text-xs text-ink-900/60 dark:text-white/55">
                {STRIPE_ENABLED
                  ? "Paiement traité par Stripe — SCOLYRA ne voit jamais ton numéro de carte."
                  : "Démo — aucun paiement réel n'est traité (voir docs/PAYMENTS.md)."}
              </p>
            </>
          )}

          {plan === "PREMIUM" && STRIPE_ENABLED && (
            <p id="resiliation-aide" className="mt-3 text-xs text-ink-900/70 dark:text-white/70">
              Tu peux résilier en quelques clics : l'accès reste actif jusqu'à la fin de la période payée. Factures et
              moyen de paiement sont aussi gérés depuis ce portail.
            </p>
          )}
          {plan === "PREMIUM" && STRIPE_ENABLED && (
            <Button variant="secondary" className="mt-4" onClick={openBillingPortal} disabled={portalPending} aria-describedby="resiliation-aide">
              {portalPending ? "…" : "Résilier mon abonnement"}
            </Button>
          )}
        </Panel>
      </StaggerItem>

      <StaggerItem>
        <Panel hover>
          <h2 className="font-display text-lg text-ink-900 dark:text-white">Confidentialité & RGPD</h2>
          <div className="mt-4 space-y-3 text-sm">
            <button onClick={exportData} className="focus-ring block text-primary-700 underline">
              Exporter mes données (JSON)
            </button>
            {!confirmingDelete ? (
              <button onClick={() => setConfirmingDelete(true)} className="focus-ring block text-red-700 underline">
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
          <p className="mt-4 text-xs text-ink-900/70 dark:text-white/70">
            Export et suppression sont réels (RGPD art. 15, 17 et 20). La suppression résilie aussi ton abonnement. Voir la <Link href="/confidentialite" className="underline">politique de confidentialité</Link>.
          </p>
        </Panel>
      </StaggerItem>

      <StaggerItem>
        <Panel hover>
          <h2 className="font-display text-lg text-ink-900 dark:text-white">Représentant légal</h2>
          <p className="mt-2 text-sm text-ink-900/60 dark:text-white/55">
            {hasVerifiedGuardian
              ? "Représentant légal vérifié."
              : "Aucun représentant légal vérifié — requis avant tout abonnement payant pour un compte mineur."}
          </p>

          {isMinor && !hasVerifiedGuardian && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <input aria-label="Adresse e-mail du représentant légal"
                type="email"
                value={guardianEmail}
                onChange={(e) => setGuardianEmail(e.target.value)}
                placeholder="email-du-parent@exemple.fr"
                className="focus-ring min-w-[220px] flex-1 rounded-lg border border-ink-900/50 px-3 py-2 text-sm"
              />
              <Button onClick={inviteGuardian} disabled={invitingGuardian}>
                {invitingGuardian ? "Envoi…" : "Envoyer une invitation"}
              </Button>
            </div>
          )}
          {guardianMessage && <p className="mt-3 text-sm text-ink-900/65 dark:text-white/65">{guardianMessage}</p>}
        </Panel>
      </StaggerItem>
    </StaggerGroup>
  );
}
