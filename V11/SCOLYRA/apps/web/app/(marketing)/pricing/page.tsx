import Link from "next/link";
import type { Metadata } from "next";
import { Reveal } from "../../../components/motion";
import { LEGAL } from "../../../lib/legal";

export const metadata: Metadata = {
  title: "Tarifs",
  description: "Offre gratuite et offre Premium SCOLYRA : prix TTC, renouvellement, résiliation en ligne.",
  alternates: { canonical: "/pricing" },
};

const STRIPE_ENABLED = Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const PLANS = [
  {
    name: "Free",
    price: "0 €",
    period: "toujours",
    description: "Pour démarrer et organiser ton travail scolaire.",
    features: [
      "Profil pédagogique complet",
      "Objectifs & suivi de moyenne",
      "Plan de révision (1 par matière)",
      "Coach IA — mode standard",
    ],
    cta: "Commencer gratuitement",
    tone: "neutral" as const,
  },
  {
    name: "Premium",
    price: `${LEGAL.premium.priceTtcEuros} €`,
    period: "TTC / mois, sans engagement",
    description: "Pour un accompagnement complet, matière par matière.",
    features: [
      "Tout Free, sans limite de matières",
      "Analyse de copies illimitée",
      "Coach IA — mode avancé (raisonnement approfondi)",
      "Suivi d'orientation détaillé",
    ],
    cta: "Passer en Premium",
    tone: "primary" as const,
  },
];

export default function PricingPage() {
  return (
    <div>
      <p className="mb-2 text-sm text-primary-600">Tarifs</p>
      <h1 className="font-display text-3xl text-ink-900">Un plan simple, sans surprise.</h1>
      <p className="mt-3 max-w-xl text-sm text-ink-900/70">
        {STRIPE_ENABLED
          ? "Prix TTC. L'abonnement Premium se renouvelle chaque mois et se résilie en ligne à tout moment. "
          : "Mode démonstration : aucun paiement réel n'est traité. "}
        Pour les comptes mineurs, l'abonnement Premium nécessite la validation d'un représentant légal. Voir les{" "}
        <Link href="/cgv" className="text-primary-700 underline">CGV</Link> et le{" "}
        <Link href="/retractation" className="text-primary-700 underline">droit de rétractation de 14 jours</Link>.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {PLANS.map((plan, i) => (
          <Reveal key={plan.name} delay={i * 0.08}>
            <div
              className={`h-full rounded-2xl border p-6 ${
                plan.tone === "primary"
                  ? "border-primary-200 bg-primary-50/60"
                  : "border-ink-900/10 bg-white"
              }`}
            >
              <h2 className="font-display text-xl text-ink-900">{plan.name}</h2>
              <p className="mt-1 text-sm text-ink-900/60">{plan.description}</p>
              <p className="mt-4 font-display text-3xl text-ink-900">
                {plan.price}
                <span className="text-sm font-sans text-ink-900/60"> {plan.period}</span>
              </p>
              <ul className="mt-5 space-y-2 text-sm text-ink-900/70">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-primary-600">—</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className={`focus-ring mt-6 block rounded-lg px-4 py-2.5 text-center text-sm font-medium transition-transform hover:-translate-y-0.5 ${
                  plan.tone === "primary"
                    ? "bg-primary-600 text-white hover:bg-primary-700"
                    : "border border-ink-900/15 text-ink-900 hover:bg-ink-900/5"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
