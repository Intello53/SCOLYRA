"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn, getSession } from "next-auth/react";
import { Button } from "../../../components/button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await signIn("credentials", { email, password, redirect: false });
    if (result?.error) {
      // next-auth renvoie soit notre message personnalisé tel quel
      // (ex. blocage anti brute-force après plusieurs essais), soit le
      // code générique "CredentialsSignin" pour un email/mot de passe
      // invalide. Afficher le message précis quand on en a un évite de
      // masquer un vrai problème (ex. "trop de tentatives, réessaie
      // dans 12 min") derrière un message toujours identique.
      setError(result.error === "CredentialsSignin" ? "Email ou mot de passe incorrect." : result.error);
      setLoading(false);
      return;
    }
    const session = await getSession();
    router.push((session?.user as { role?: string })?.role === "ADMIN" ? "/admin" : "/dashboard");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="font-display text-2xl text-ink-900">Connexion</h1>
      {process.env.NEXT_PUBLIC_DEMO_MODE === "true" && (
        <p className="mt-2 text-sm text-ink-900/70">
          Compte de test (mode démonstration) : <code className="rounded bg-ink-900/5 px-1">demo@scolyra.app</code> /{" "}
          <code className="rounded bg-ink-900/5 px-1">demo12345</code>
        </p>
      )}

      {error && (
        <div role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm text-ink-900/70">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="prenom@exemple.fr"
            className="focus-ring w-full rounded-lg border border-ink-900/50 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm text-ink-900/70">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="focus-ring w-full rounded-lg border border-ink-900/50 px-3 py-2 text-sm"
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Connexion…" : "Se connecter"}
        </Button>
      </form>

      <p className="mt-6 text-sm text-ink-900/60">
        Pas encore de compte ?{" "}
        <Link href="/register" className="text-primary-700 underline">
          S'inscrire
        </Link>
      </p>
    </div>
  );
}
