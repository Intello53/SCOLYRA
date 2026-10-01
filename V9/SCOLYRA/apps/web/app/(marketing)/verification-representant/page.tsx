"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Panel } from "../../../components/ui";
import { Button } from "../../../components/button";

function VerificationRepresentantInner() {
  const params = useSearchParams();
  const token = params.get("token");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function confirm() {
    if (!token) return;
    setState("loading");
    const res = await fetch("/api/guardian/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const data = await res.json();
    if (!res.ok) {
      setState("error");
      setMessage(data.error ?? "Une erreur est survenue.");
      return;
    }
    setState("done");
    setMessage(data.studentFirstName);
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="font-display text-2xl text-ink-900">Vérification représentant légal</h1>

      {!token ? (
        <Panel className="mt-6">
          <p className="text-sm text-ink-900/60">
            Lien invalide — il manque le jeton de vérification. Vérifie que tu as bien copié le lien complet reçu par
            email.
          </p>
        </Panel>
      ) : state === "done" ? (
        <Panel className="mt-6">
          <p className="text-sm text-mastery-700">
            Merci ! Tu es maintenant enregistré·e comme représentant légal vérifié pour <strong>{message}</strong>.
          </p>
        </Panel>
      ) : (
        <Panel className="mt-6">
          <p className="text-sm text-ink-900/70">
            Un élève t'a désigné·e comme représentant légal sur SCOLYRA. Cette confirmation est nécessaire avant tout
            abonnement Premium payant sur son compte.
          </p>
          {state === "error" && <p className="mt-3 text-sm text-red-600">{message}</p>}
          <Button className="mt-4" onClick={confirm} disabled={state === "loading"}>
            {state === "loading" ? "Confirmation…" : "Je confirme être le représentant légal"}
          </Button>
        </Panel>
      )}
    </div>
  );
}

export default function VerificationRepresentantPage() {
  return (
    <Suspense fallback={null}>
      <VerificationRepresentantInner />
    </Suspense>
  );
}
