import type { Metadata } from "next";
import Link from "next/link";
import { LEGAL } from "../../../lib/legal";
import { LegalPage, Section, L } from "../../../components/legal-page";

export const metadata: Metadata = {
  title: "Conditions générales de vente",
  description: "Conditions de l'abonnement SCOLYRA Premium : prix, paiement, résiliation, rétractation.",
  alternates: { canonical: "/cgv" },
};

export default function CGVPage() {
  const p = LEGAL.premium;
  return (
    <LegalPage
      title="Conditions générales de vente (CGV) — offre Premium"
      intro="Ces conditions s'appliquent à l'abonnement payant SCOLYRA Premium. L'offre gratuite est régie uniquement par les CGU."
    >
      <Section id="vendeur" title="1. Vendeur">
        <p>
          <L v={LEGAL.editor.name} label="éditeur" />, <L v={LEGAL.editor.legalForm} label="forme juridique" />,{" "}
          <L v={LEGAL.editor.address} label="adresse" />, courriel : <L v={LEGAL.editor.email} label="courriel" />
          {LEGAL.editor.siret ? <> — SIRET {LEGAL.editor.siret}</> : null}. Voir les{" "}
          <Link className="text-primary-700 underline" href="/mentions-legales">mentions légales</Link>.
        </p>
      </Section>

      <Section id="offre" title="2. Offre et caractéristiques essentielles">
        <p>
          SCOLYRA Premium donne accès, sur le site, à des fonctionnalités supplémentaires (quiz d'orientation, simulateur
          de coût des études, analyse de copies sans limite, coach IA en mode avancé, suivi d'orientation détaillé). Les
          fonctionnalités incluses sont celles décrites sur la page{" "}
          <Link className="text-primary-700 underline" href="/pricing">Tarifs</Link> au moment de la commande. Le service est
          fourni en ligne ; il nécessite un accès internet et un navigateur récent. Les recommandations restent des
          estimations indicatives (voir CGU, article 6).
        </p>
      </Section>

      <Section id="prix" title="3. Prix">
        <p>
          Le prix est de <strong>{p.priceTtcEuros} € TTC par {p.period}</strong>, en euros, toutes taxes comprises.{" "}
          {LEGAL.editor.vatMention ? LEGAL.editor.vatMention + "." : <L v={null} label="mention de TVA (ex. franchise en base art. 293 B du CGI)" />}{" "}
          Le prix applicable est celui affiché au moment de la commande ; toute évolution ne s'applique qu'au renouvellement
          suivant, après information préalable.
        </p>
      </Section>

      <Section id="commande" title="4. Commande et paiement">
        <p>
          La commande se fait depuis <em>Paramètres → Abonnement</em>. Avant le paiement, tu dois accepter les présentes CGV
          et confirmer ta demande d'accès immédiat (article 7). Le bouton final de paiement indique clairement que la
          commande emporte une obligation de paiement. Le paiement s'effectue par carte sur la page sécurisée de Stripe ;
          SCOLYRA n'a jamais accès à ton numéro de carte. Le contrat est conclu à la validation du paiement ; une
          confirmation et la facture te sont envoyées par e-mail.
        </p>
        <p>
          <strong>Mineurs :</strong> pour un compte mineur, l'abonnement n'est possible qu'avec l'accord d'un
          représentant légal préalablement vérifié par e-mail.
        </p>
      </Section>

      <Section id="duree" title="5. Durée, renouvellement et résiliation">
        <p>
          L'abonnement est mensuel et se renouvelle <strong>tacitement</strong> chaque mois jusqu'à résiliation. Tu peux
          résilier <strong>à tout moment, en ligne</strong>, depuis <em>Paramètres → « Résilier mon abonnement »</em>, en quelques
          clics et sans courrier ni justification. La résiliation prend effet à la fin de la période déjà payée : tu conserves
          l'accès Premium jusque-là et aucun nouveau prélèvement n'a lieu. La suppression du compte résilie également
          l'abonnement.
        </p>
      </Section>

      <Section id="retractation" title="6. Droit de rétractation (14 jours)">
        <p>
          En tant que consommateur, tu disposes d'un délai de <strong>14 jours</strong> à compter de la conclusion du contrat
          pour te rétracter, sans avoir à motiver ta décision (Code de la consommation, art. L221-18). Pour l'exercer, envoie
          une déclaration dénuée d'ambiguïté à <L v={LEGAL.editor.email} label="courriel" /> ou utilise le{" "}
          <Link className="text-primary-700 underline" href="/retractation">formulaire de rétractation</Link>. Nous
          accusons réception et te remboursons dans un délai maximal de 14 jours, par le moyen de paiement utilisé.
        </p>
      </Section>

      <Section id="acces-immediat" title="7. Accès immédiat et paiement au prorata">
        <p>
          {p.immediateAccess
            ? "L'abonnement donne accès au service dès la validation du paiement. En cochant la case prévue avant le paiement, tu demandes expressément que l'exécution commence avant la fin du délai de rétractation. Si tu te rétractes ensuite, tu devras payer un montant proportionnel à ce qui t'a été fourni jusqu'à la communication de ta décision (art. L221-25), calculé sur la base du prix de l'abonnement ; aucun paiement n'est dû si tu n'as pas fait cette demande expresse."
            : "L'accès au service n'est ouvert qu'à l'expiration du délai de rétractation."}
        </p>
      </Section>

      <Section id="garanties" title="8. Garanties légales">
        <p>
          Le vendeur répond des défauts de conformité du contenu ou du service numérique dans les conditions des articles
          L224-25-1 et suivants du Code de la consommation. Tu peux demander la mise en conformité du service ou, à défaut,
          la réduction du prix ou la résolution du contrat. Ces garanties s'appliquent sans préjudice de ton droit de
          rétractation.
        </p>
      </Section>

      <Section id="donnees" title="9. Données personnelles">
        <p>
          Les données nécessaires au paiement et à la facturation sont traitées conformément à la{" "}
          <Link className="text-primary-700 underline" href="/confidentialite">politique de confidentialité</Link> ;
          les pièces comptables sont conservées {LEGAL.retention.invoicesYears} ans (obligation légale).
        </p>
      </Section>

      <Section id="mediation" title="10. Réclamations et médiation">
        <p>
          Pour toute réclamation, écris d'abord à <L v={LEGAL.editor.email} label="courriel" />. À défaut de réponse
          satisfaisante sous un délai raisonnable, tu peux saisir gratuitement le médiateur de la consommation :{" "}
          <L v={LEGAL.mediator.name} label="nom du médiateur" /> — <L v={LEGAL.mediator.website} label="site du médiateur" />.
        </p>
      </Section>

      <Section id="droit" title="11. Droit applicable">
        <p>Les présentes CGV sont soumises au droit français. Les règles impératives de protection du consommateur de son pays de résidence habituelle demeurent applicables.</p>
      </Section>
    </LegalPage>
  );
}
