import type { Metadata } from "next";
import { LEGAL, privacyContactEmail } from "../../../lib/legal";
import { LegalPage, Section, L } from "../../../components/legal-page";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Éditeur, hébergeur et informations légales du site SCOLYRA.",
  alternates: { canonical: "/mentions-legales" },
};

export default function MentionsLegalesPage() {
  const e = LEGAL.editor;
  const h = LEGAL.host;
  return (
    <LegalPage title="Mentions légales">
      <Section id="editeur" title="Éditeur du site">
        <p>
          Le site SCOLYRA est édité par :
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Nom ou dénomination : <L v={e.name} label="nom / dénomination" /></li>
          <li>Statut juridique : <L v={e.legalForm} label="forme juridique" /></li>
          <li>Adresse : <L v={e.address} label="adresse" /></li>
          <li>Courriel : <L v={e.email} label="courriel de contact" /></li>
          {e.phone && <li>Téléphone : {e.phone}</li>}
          {e.siret && <li>SIREN / SIRET / RNA : {e.siret}</li>}
          {e.registry && <li>Immatriculation : {e.registry}</li>}
          {e.shareCapital && <li>Capital social : {e.shareCapital}</li>}
          {e.vatNumber && <li>N° de TVA intracommunautaire : {e.vatNumber}</li>}
          {e.vatMention && <li>{e.vatMention}</li>}
        </ul>
        <p>
          Directeur·rice de la publication : <L v={e.publicationDirector} label="directeur de la publication" />.
        </p>
      </Section>

      <Section id="hebergeur" title="Hébergeur">
        <ul className="list-disc space-y-1 pl-5">
          <li>Nom : <L v={h.name} label="hébergeur" /></li>
          <li>Adresse : <L v={h.address} label="adresse de l'hébergeur" /></li>
          {h.phone && <li>Téléphone : {h.phone}</li>}
          <li>Pays d'hébergement des données : <L v={h.country} label="pays" /></li>
        </ul>
      </Section>

      <Section id="contact" title="Contact">
        <p>
          Pour toute question sur le site : <L v={e.email} label="courriel" />. Les utilisateurs connectés peuvent aussi
          utiliser l'onglet « Aide » de l'application (service d'assistance).
        </p>
        <p>
          Pour l'exercice de vos droits sur vos données personnelles :{" "}
          <L v={privacyContactEmail()} label="courriel RGPD" /> — voir la{" "}
          <a className="text-primary-700 underline" href="/confidentialite">politique de confidentialité</a>.
        </p>
      </Section>

      <Section id="pi" title="Propriété intellectuelle">
        <p>
          La structure du site, ses textes, graphismes, logos, code et bases de données sont protégés par le droit de la
          propriété intellectuelle. Toute reproduction ou réutilisation non autorisée, totale ou partielle, est
          interdite, sauf exceptions prévues par la loi. Les contenus déposés par les utilisateurs (notes, documents,
          projets) restent leur propriété ; ils accordent à l'éditeur uniquement le droit de les traiter pour fournir le
          service.
        </p>
      </Section>

      <Section id="mediation" title="Médiation de la consommation">
        <p>
          Pour les litiges liés à un achat (offre Premium), le consommateur peut recourir gratuitement à un médiateur de
          la consommation : <L v={LEGAL.mediator.name} label="nom du médiateur" />
          {LEGAL.mediator.website ? <> — {LEGAL.mediator.website}</> : <> — <L v={null} label="site du médiateur" /></>}. Il doit
          auparavant avoir tenté de résoudre le litige directement auprès de l'éditeur par une réclamation écrite.
        </p>
      </Section>

      <Section id="liens" title="Liens et responsabilité">
        <p>
          Le site peut contenir des liens vers des sites tiers (par exemple la page de paiement hébergée par Stripe).
          L'éditeur n'exerce aucun contrôle sur leur contenu. Les recommandations pédagogiques et d'orientation du
          service sont des estimations indicatives, sans garantie de résultat ni d'admission.
        </p>
      </Section>
    </LegalPage>
  );
}
