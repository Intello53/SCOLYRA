import type { Metadata } from "next";
import Link from "next/link";
import { LEGAL } from "../../../lib/legal";
import { LegalPage, Section, L } from "../../../components/legal-page";
import { RetractationForm } from "../../../components/retractation-form";

export const metadata: Metadata = {
  title: "Droit de rétractation",
  description: "Comment te rétracter de l'abonnement SCOLYRA Premium dans les 14 jours, et formulaire type.",
  alternates: { canonical: "/retractation" },
};

export default function RetractationPage() {
  return (
    <LegalPage
      title="Droit de rétractation et remboursement"
      intro="Tu peux te rétracter de l'abonnement Premium dans les 14 jours suivant la commande, sans donner de raison."
    >
      <Section id="regles" title="Conditions">
        <ul className="list-disc space-y-1 pl-5">
          <li>Délai : <strong>14 jours</strong> à compter du jour de la conclusion du contrat (Code de la consommation, art. L221-18).</li>
          <li>Comment : par toute déclaration dénuée d'ambiguïté envoyée à <L v={LEGAL.editor.email} label="courriel" />, ou avec le formulaire ci-dessous. Tu peux aussi résilier en ligne (Paramètres), mais la résiliation seule ne vaut pas rétractation : elle n'ouvre pas droit au remboursement.</li>
          <li>Remboursement : au plus tard 14 jours après la réception de ta demande, par le même moyen de paiement.</li>
          <li>
            Si tu as demandé l'accès immédiat avant la fin du délai, un montant proportionnel au service déjà fourni reste dû
            (art. L221-25). Voir les <Link className="text-primary-700 underline" href="/cgv">CGV</Link>, articles 6 et 7.
          </li>
          <li>Ce droit concerne les consommateurs ; il ne s'applique pas à l'offre gratuite.</li>
        </ul>
      </Section>

      <Section id="formulaire" title="Formulaire type de rétractation">
        <RetractationForm
          recipient={LEGAL.editor.email}
          sellerName={LEGAL.editor.name ?? "[Éditeur — à compléter]"}
          sellerAddress={LEGAL.editor.address ?? "[Adresse — à compléter]"}
        />
      </Section>
    </LegalPage>
  );
}
