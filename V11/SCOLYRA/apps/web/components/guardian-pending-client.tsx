"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Button } from "./button";

export function GuardianPendingClient() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  async function resend(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    setMessage(null);
    const res = await fetch("/api/guardian/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guardianEmail: email }),
    });
    const data = await res.json().catch(() => ({}));
    setPending(false);
    if (!res.ok) {
      setError(data.error ?? "Impossible d'envoyer l'invitation.");
      return;
    }
    setMessage("Nouvel e-mail envoyé. L'ancien lien n'est plus valable.");
    setEmail("");
  }

  async function deleteAccount() {
    const res = await fetch("/api/account/delete", { method: "DELETE" });
    if (!res.ok) {
      setError("Impossible de supprimer le compte pour l'instant.");
      return;
    }
    await signOut({ callbackUrl: "/" });
  }

  return (
    <div className="mt-8 space-y-8">
      <form onSubmit={resend} className="space-y-3">
        <label htmlFor="guardian-email" className="block text-sm font-medium text-ink-900 dark:text-white">
          Renvoyer l'e-mail (ou corriger l'adresse)
        </label>
        <input
          id="guardian-email"
          type="email"
          required
          autoComplete="off"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="focus-ring w-full rounded-lg border border-ink-900/50 px-3 py-2 text-sm"
        />
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        <p role="status" aria-live="polite" className="text-sm text-mastery-700">{message}</p>
        <Button type="submit" disabled={pending}>{pending ? "Envoi…" : "Envoyer"}</Button>
      </form>

      <div className="flex flex-wrap items-center gap-4 border-t border-ink-900/10 pt-6 text-sm">
        <button type="button" onClick={() => signOut({ callbackUrl: "/" })} className="focus-ring text-primary-700 underline">
          Me déconnecter
        </button>
        {!confirmingDelete ? (
          <button type="button" onClick={() => setConfirmingDelete(true)} className="focus-ring text-red-700 underline">
            Supprimer mon compte
          </button>
        ) : (
          <span className="flex items-center gap-2">
            <span>Suppression définitive — confirmer ?</span>
            <button type="button" onClick={deleteAccount} className="focus-ring rounded-lg bg-red-700 px-3 py-1.5 text-white">Oui, supprimer</button>
            <button type="button" onClick={() => setConfirmingDelete(false)} className="focus-ring underline">Annuler</button>
          </span>
        )}
      </div>
    </div>
  );
}
