import type { Metadata } from "next";
import Link from "next/link";
import { LEGAL } from "../../../lib/legal";
import { LegalPage, Section, L } from "../../../components/legal-page";

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation",
  description: "Règles d'utilisation du service SCOLYRA.",
  alternates: { canonical: "/cgu" },
};

export default function CGUPage() {
  return (
    <LegalPage title="Conditions générales d'utilisation (CGU)">
      <Section id="objet" title="1. Objet">
        <p>
          SCOLYRA est un service en ligne d'aide à l'organisation scolaire et à la réflexion d'orientation, édité par{" "}
          <L v={LEGAL.editor.name} label="éditeur" /> (voir les <Link className="text-primary-700 underline" href="/mentions-legales">mentions légales</Link>).
          Les présentes CGU régissent l'accès et l'utilisation du service. En créant un compte, tu reconnais les avoir
          lues. Les conditions propres à l'offre payante figurent dans les <Link className="text-primary-700 underline" href="/cgv">CGV</Link>.
        </p>
      </Section>

      <Section id="acces" title="2. Accès au service et âge">
        <ul className="list-disc space-y-1 pl-5">
          <li>Le service est ouvert aux collégiens, lycéens et étudiants, ainsi qu'à toute personne majeure.</li>
          <li>
            <strong>Moins de 15 ans :</strong> l'accord d'un représentant légal est obligatoire ; l'accès est ouvert dès que
            celui-ci l'a confirmé par e-mail.
          </li>
          <li>
            <strong>15 à 17 ans :</strong> tu peux utiliser le service ; l'abonnement payant exige la validation préalable
            d'un représentant légal.
          </li>
          <li>Tu dois fournir des informations exactes (notamment ta tranche d'âge) ; une fausse déclaration peut entraîner la suspension du compte.</li>
        </ul>
      </Section>

      <Section id="compte" title="3. Compte et sécurité">
        <p>
          Tu es responsable de la confidentialité de ton mot de passe et des actions faites depuis ton compte. Un compte est
          strictement personnel. Préviens-nous sans délai en cas d'utilisation non autorisée. Les comptes inactifs pendant{" "}
          {LEGAL.retention.inactiveAccountMonths} mois sont supprimés (voir la politique de confidentialité).
        </p>
      </Section>

      <Section id="usage" title="4. Règles d'usage">
        <p>Il est interdit de : tenter d'accéder aux comptes ou données d'autres utilisateurs, perturber ou contourner la sécurité du service, l'utiliser pour tricher à un examen ou produire un travail que tu présenterais comme tien à la place d'apprendre, y déposer des contenus illicites, ou collecter automatiquement des données (scraping). L'éditeur peut suspendre un compte en cas de manquement grave, après avoir informé la personne concernée sauf urgence de sécurité.</p>
      </Section>

      <Section id="contenus" title="5. Tes contenus">
        <p>
          Les notes, documents, objectifs et projets que tu saisis restent les tiens. Tu nous autorises seulement à les
          traiter pour te fournir le service. Ne dépose pas de contenu appartenant à autrui sans en avoir le droit, ni de
          données personnelles de tiers (camarades, professeurs).
        </p>
      </Section>

      <Section id="ia" title="6. Coach IA et recommandations">
        <p>
          Le coach est un système d'intelligence artificielle. Ses réponses, les priorités de révision, les suggestions
          d'orientation et les simulations de coût sont des <strong>estimations pédagogiques indicatives</strong>, fondées
          sur les informations que tu as saisies : elles peuvent être inexactes, ne garantissent ni résultat scolaire ni
          admission, et ne remplacent ni tes enseignants, ni les conseillers d'orientation, ni les sources officielles
          (Parcoursup, ONISEP, établissements). Les décisions importantes restent les tiennes.
        </p>
      </Section>

      <Section id="pi" title="7. Propriété intellectuelle">
        <p>Le service, sa structure, ses textes et son code sont protégés (voir mentions légales). Aucun droit n'est cédé en dehors du droit personnel et non exclusif d'utiliser le service pendant la durée du compte.</p>
      </Section>

      <Section id="responsabilite" title="8. Disponibilité et responsabilité">
        <p>
          Le service est fourni avec une obligation de moyens ; il peut être interrompu pour maintenance ou en cas de
          force majeure. L'éditeur n'est pas responsable des décisions prises sur la seule base d'une estimation du
          service. Rien dans les présentes CGU n'exclut ni ne limite les droits que la loi reconnaît aux consommateurs, ni
          la responsabilité de l'éditeur en cas de faute lourde ou dolosive, ou de dommage corporel.
        </p>
      </Section>

      <Section id="donnees" title="9. Données personnelles et cookies">
        <p>
          Le traitement de tes données est décrit dans la <Link className="text-primary-700 underline" href="/confidentialite">politique de confidentialité</Link>{" "}
          et la <Link className="text-primary-700 underline" href="/cookies">politique de cookies</Link>. Tu peux exporter tes données et supprimer ton compte à tout moment depuis Paramètres.
        </p>
      </Section>

      <Section id="resiliation" title="10. Fin du compte">
        <p>
          Tu peux supprimer ton compte à tout moment depuis Paramètres ; un abonnement Premium en cours est alors résilié
          (aucun nouveau prélèvement). La suppression entraîne l'effacement de tes données, sous réserve des obligations
          légales de conservation (notamment comptables).
        </p>
      </Section>

      <Section id="contact" title="11. Assistance et réclamations">
        <p>
          Utilise l'onglet « Aide » de l'application ou écris à <L v={LEGAL.editor.email} label="courriel de contact" />.
        </p>
      </Section>

      <Section id="modifs" title="12. Modification des CGU">
        <p>
          Les CGU peuvent évoluer. Les changements importants te sont communiqués avant leur entrée en vigueur ; la
          poursuite de l'utilisation vaut acceptation de la nouvelle version, sans préjudice de ton droit de supprimer ton compte.
        </p>
      </Section>

      <Section id="droit" title="13. Droit applicable et litiges">
        <p>
          Les CGU sont soumises au droit français. En cas de litige, une solution amiable est recherchée en priorité ; un
          consommateur peut recourir à la médiation (voir les CGV) et saisir, à son choix, la juridiction territorialement
          compétente en vertu de la loi ou celle du lieu où il demeurait au moment de la conclusion du contrat ou de la
          survenance du fait dommageable.
        </p>
      </Section>
    </LegalPage>
  );
}
