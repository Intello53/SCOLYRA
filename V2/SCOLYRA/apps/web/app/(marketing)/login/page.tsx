import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm">
      <h1 className="font-display text-2xl text-ink-900">Connexion</h1>
      <p className="mt-2 text-sm text-ink-900/55">
        Formulaire de démonstration — non connecté à une authentification
        réelle (voir docs/STATUS.md).
      </p>

      <form className="mt-8 space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm text-ink-900/70">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="prenom@exemple.fr"
            className="focus-ring w-full rounded-lg border border-ink-900/15 px-3 py-2 text-sm"
            disabled
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm text-ink-900/70">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            className="focus-ring w-full rounded-lg border border-ink-900/15 px-3 py-2 text-sm"
            disabled
          />
        </div>
        <Link
          href="/dashboard"
          className="focus-ring block w-full rounded-lg bg-primary-600 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-700"
        >
          Voir la démo à la place
        </Link>
      </form>

      <p className="mt-6 text-sm text-ink-900/55">
        Pas encore de compte ?{" "}
        <Link href="/register" className="text-primary-600 hover:underline">
          S'inscrire
        </Link>
      </p>
    </div>
  );
}
