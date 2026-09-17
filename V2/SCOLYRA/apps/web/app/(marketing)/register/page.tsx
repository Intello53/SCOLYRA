import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-sm">
      <h1 className="font-display text-2xl text-ink-900">Inscription</h1>
      <p className="mt-2 text-sm text-ink-900/55">
        Formulaire de démonstration — non connecté à une authentification
        réelle.
      </p>

      <form className="mt-8 space-y-4">
        <div>
          <label htmlFor="firstName" className="mb-1.5 block text-sm text-ink-900/70">
            Prénom
          </label>
          <input
            id="firstName"
            placeholder="Léa"
            className="focus-ring w-full rounded-lg border border-ink-900/15 px-3 py-2 text-sm"
            disabled
          />
        </div>
        <div>
          <label htmlFor="email2" className="mb-1.5 block text-sm text-ink-900/70">
            Email
          </label>
          <input
            id="email2"
            type="email"
            placeholder="prenom@exemple.fr"
            className="focus-ring w-full rounded-lg border border-ink-900/15 px-3 py-2 text-sm"
            disabled
          />
        </div>
        <div>
          <label htmlFor="isMinor" className="flex items-start gap-2 text-sm text-ink-900/70">
            <input id="isMinor" type="checkbox" className="mt-0.5" disabled />
            Je suis mineur·e — un représentant légal devra valider mon
            inscription avant tout abonnement payant.
          </label>
        </div>
        <Link
          href="/dashboard"
          className="focus-ring block w-full rounded-lg bg-primary-600 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-700"
        >
          Voir la démo à la place
        </Link>
      </form>

      <p className="mt-6 text-sm text-ink-900/55">
        Déjà inscrit·e ?{" "}
        <Link href="/login" className="text-primary-600 hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
