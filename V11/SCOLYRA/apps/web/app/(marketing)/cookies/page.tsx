import type { Metadata } from "next";
import { LEGAL, SESSION_DAYS } from "../../../lib/legal";
import { LegalPage, Section } from "../../../components/legal-page";

export const metadata: Metadata = {
  title: "Politique de cookies",
  description: "Liste des cookies et traceurs utilisés par SCOLYRA et leur finalité.",
  alternates: { canonical: "/cookies" },
};

const COOKIES = [
  { name: "__Secure-next-auth.session-token (next-auth.session-token en local)", purpose: "Maintient ta connexion (jeton de session signé, non lisible par les scripts).", duration: `${SESSION_DAYS} jours maximum`, party: "SCOLYRA (1re partie)" },
  { name: "__Host-next-auth.csrf-token (next-auth.csrf-token en local)", purpose: "Protège les formulaires de connexion contre les requêtes falsifiées (CSRF).", duration: "Session du navigateur", party: "SCOLYRA (1re partie)" },
  { name: "__Secure-next-auth.callback-url (next-auth.callback-url en local)", purpose: "Mémorise la page à afficher après la connexion.", duration: "Session du navigateur", party: "SCOLYRA (1re partie)" },
];

export default function CookiesPage() {
  return (
    <LegalPage
      title="Politique de cookies"
      intro="SCOLYRA n'utilise que des cookies strictement nécessaires au fonctionnement du service. Aucun cookie publicitaire, aucun outil de mesure d'audience, aucun traceur de réseau social."
    >
      <Section id="liste" title="Cookies déposés par SCOLYRA">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left text-sm">
            <caption className="sr-only">Cookies utilisés par SCOLYRA</caption>
            <thead>
              <tr className="border-b border-ink-900/20">
                <th scope="col" className="py-2 pr-3 font-medium text-ink-900">Nom</th>
                <th scope="col" className="py-2 pr-3 font-medium text-ink-900">Finalité</th>
                <th scope="col" className="py-2 pr-3 font-medium text-ink-900">Durée</th>
                <th scope="col" className="py-2 font-medium text-ink-900">Émetteur</th>
              </tr>
            </thead>
            <tbody>
              {COOKIES.map((c) => (
                <tr key={c.name} className="border-b border-ink-900/10 align-top">
                  <th scope="row" className="py-2 pr-3 font-mono text-xs font-normal">{c.name}</th>
                  <td className="py-2 pr-3">{c.purpose}</td>
                  <td className="py-2 pr-3">{c.duration}</td>
                  <td className="py-2">{c.party}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Aucune autre donnée n'est stockée dans ton navigateur (pas de <code>localStorage</code> ni de{" "}
          <code>sessionStorage</code> à des fins de suivi).
        </p>
      </Section>

      <Section id="consentement" title="Pourquoi il n'y a pas de bandeau de consentement">
        <p>
          Les cookies ci-dessus sont indispensables à la connexion et à la sécurité du compte. Selon l'article 82 de la
          loi Informatique et Libertés et les lignes directrices de la CNIL, les traceurs strictement nécessaires à la
          fourniture d'un service demandé par l'utilisateur sont exemptés de consentement : un bandeau n'est donc pas
          requis. Si un traceur non essentiel (mesure d'audience, publicité, vidéo tierce…) est ajouté un jour, un
          mécanisme de consentement permettant d'accepter <em>ou refuser</em> aussi simplement sera mis en place
          <strong> avant</strong> son activation, et cette page sera mise à jour.
        </p>
      </Section>

      <Section id="tiers" title="Services tiers">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Paiement (offre Premium) :</strong> le paiement se fait sur une page hébergée par{" "}
            {LEGAL.processors.payments.name}, sur le domaine de Stripe. Stripe y dépose ses propres cookies, régis par sa
            politique ; SCOLYRA ne les contrôle pas et ne voit jamais ton numéro de carte.
          </li>
          <li>
            <strong>Polices de caractères :</strong> elles sont hébergées par SCOLYRA (aucune requête vers Google Fonts
            depuis ton navigateur).
          </li>
        </ul>
      </Section>

      <Section id="gerer" title="Gérer ou supprimer les cookies">
        <p>
          Tu peux supprimer les cookies à tout moment dans les réglages de ton navigateur. Supprimer les cookies de
          session te déconnecte ; les bloquer totalement empêche de se connecter au service.
        </p>
      </Section>
    </LegalPage>
  );
}
