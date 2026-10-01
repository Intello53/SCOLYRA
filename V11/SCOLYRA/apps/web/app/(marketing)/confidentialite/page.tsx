import type { Metadata } from "next";
import { LEGAL, privacyContactEmail } from "../../../lib/legal";
import { LegalPage, Section, L } from "../../../components/legal-page";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Quelles données personnelles SCOLYRA collecte, pourquoi, combien de temps, et comment exercer tes droits.",
  alternates: { canonical: "/confidentialite" },
};

const DATA_ROWS: { cat: string; data: string; purpose: string; basis: string; retention: string }[] = [
  { cat: "Compte", data: "Prénom, adresse e-mail, mot de passe (stocké haché, jamais en clair), tranche d'âge déclarée (moins de 15 ans / 15-17 ans / majeur)", purpose: "Créer et sécuriser ton compte, adapter les règles applicables aux mineurs", basis: "Exécution du contrat (art. 6.1.b RGPD)", retention: `Durée du compte ; suppression après ${LEGAL.retention.inactiveAccountMonths} mois d'inactivité` },
  { cat: "Scolarité", data: "Niveau de classe, options, spécialités, établissement (facultatif), matières", purpose: "Construire ton profil pédagogique", basis: "Exécution du contrat", retention: "Durée du compte" },
  { cat: "Travail scolaire", data: "Notes, objectifs, erreurs identifiées, sessions de révision, projets, tâches, calendrier, titres de documents", purpose: "Produire tes plans de révision et recommandations", basis: "Exécution du contrat", retention: "Durée du compte" },
  { cat: "Orientation", data: "Domaines envisagés, contraintes géographiques, réponses et résultat du quiz (Premium), candidatures suivies", purpose: "Suggestions d'orientation indicatives", basis: "Exécution du contrat", retention: "Durée du compte" },
  { cat: "Assistance", data: "Tickets et messages envoyés au support", purpose: "Répondre à tes demandes", basis: "Exécution du contrat", retention: `${LEGAL.retention.supportTicketsMonthsAfterClose} mois après clôture (ou suppression du compte)` },
  { cat: "Sécurité", data: "Adresse IP, date et type d'événement (connexion, création de compte, export, suppression…)", purpose: "Protéger les comptes, détecter les abus, prouver le consentement", basis: "Intérêt légitime (art. 6.1.f)", retention: `${LEGAL.retention.securityLogsMonths} mois` },
  { cat: "Représentant légal", data: "Adresse e-mail du parent / représentant légal, jeton de vérification, date de validation", purpose: "Vérifier l'autorisation parentale (moins de 15 ans) et autoriser l'abonnement d'un mineur", basis: "Obligation légale (art. 45 loi Informatique et Libertés) / art. 8 RGPD", retention: `Jeton : 48 h ; compte parent non vérifié supprimé après ${LEGAL.retention.unverifiedGuardianDays} jours ; sinon durée du compte de l'élève` },
  { cat: "Abonnement et paiement", data: "Statut de l'abonnement, identifiants clients Stripe, montants et dates. Le numéro de carte est saisi chez Stripe et n'est jamais connu de SCOLYRA", purpose: "Gérer l'offre Premium, facturer, respecter les obligations comptables", basis: "Contrat ; obligation légale (comptabilité)", retention: `${LEGAL.retention.invoicesYears} ans pour les pièces comptables (obligation légale)` },
  { cat: "Consentements", data: "Acceptation des CGU / de la politique, version du texte, date", purpose: "Conserver la preuve des acceptations", basis: "Intérêt légitime (preuve)", retention: "Durée du compte" },
];

export default function ConfidentialitePage() {
  const contact = privacyContactEmail();
  const ai = process.env.AI_PROVIDER && process.env.AI_PROVIDER !== "mock";
  return (
    <LegalPage
      title="Politique de confidentialité"
      intro="Cette page explique simplement quelles données personnelles SCOLYRA traite, pourquoi, pendant combien de temps, et comment tu peux exercer tes droits. SCOLYRA s'adresse à des élèves, dont des mineurs : nous collectons le strict nécessaire."
    >
      <Section id="responsable" title="1. Qui est responsable de tes données ?">
        <p>
          Le responsable du traitement est l'éditeur du site : <L v={LEGAL.editor.name} label="éditeur" />,{" "}
          <L v={LEGAL.editor.address} label="adresse" />. Contact pour toute question sur tes données :{" "}
          <L v={contact} label="courriel RGPD" />.
          {LEGAL.dpo.designated ? <> Délégué à la protection des données : <L v={LEGAL.dpo.name} label="nom du DPO" />.</> : <> Aucun délégué à la protection des données (DPO) n'a été désigné à ce jour.</>}
        </p>
      </Section>

      <Section id="donnees" title="2. Quelles données, pourquoi et combien de temps ?">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-xs">
            <caption className="sr-only">Données traitées, finalités, bases légales et durées de conservation</caption>
            <thead>
              <tr className="border-b border-ink-900/20">
                <th scope="col" className="py-2 pr-2 font-medium text-ink-900">Catégorie</th>
                <th scope="col" className="py-2 pr-2 font-medium text-ink-900">Données</th>
                <th scope="col" className="py-2 pr-2 font-medium text-ink-900">Finalité</th>
                <th scope="col" className="py-2 pr-2 font-medium text-ink-900">Base légale</th>
                <th scope="col" className="py-2 font-medium text-ink-900">Conservation</th>
              </tr>
            </thead>
            <tbody>
              {DATA_ROWS.map((r) => (
                <tr key={r.cat} className="border-b border-ink-900/10 align-top">
                  <th scope="row" className="py-2 pr-2 font-medium text-ink-900">{r.cat}</th>
                  <td className="py-2 pr-2">{r.data}</td>
                  <td className="py-2 pr-2">{r.purpose}</td>
                  <td className="py-2 pr-2">{r.basis}</td>
                  <td className="py-2">{r.retention}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Nous ne collectons aucune donnée dite « sensible » (santé, opinions, origine…) et ne te demandons ni nom de
          famille, ni date de naissance, ni adresse postale, ni numéro de téléphone. Fournir ton prénom, ton e-mail et ta
          classe est nécessaire pour créer un compte ; le reste est facultatif ou se déduit de ton usage. Les données de
          facturation sont conservées même après suppression du compte, pour la seule durée légale.
        </p>
        <p>
          Aucune donnée n'est vendue, louée ni utilisée pour de la publicité ou du profilage commercial. Il n'y a pas de
          décision automatisée produisant des effets juridiques à ton égard.
        </p>
      </Section>

      <Section id="mineurs" title="3. Mineurs et représentant légal">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Moins de 15 ans :</strong> en France, le consentement d'un mineur de moins de 15 ans au traitement de
            ses données doit être donné conjointement avec le titulaire de l'autorité parentale (art. 45 de la loi
            Informatique et Libertés). L'accès au service reste donc bloqué tant que le représentant légal n'a pas
            confirmé son accord via un lien envoyé à son adresse e-mail (valable 48 h).
          </li>
          <li>
            <strong>15 à 17 ans :</strong> tu peux t'inscrire seul·e ; nous t'invitons à en parler à ton représentant
            légal. Un représentant légal vérifié reste obligatoire pour souscrire un abonnement payant.
          </li>
          <li>
            L'e-mail du représentant légal n'est utilisé que pour cette vérification. S'il n'a pas de compte, un compte
            minimal « représentant » est créé puis supprimé automatiquement s'il n'est pas validé dans les{" "}
            {LEGAL.retention.unverifiedGuardianDays} jours.
          </li>
        </ul>
      </Section>

      <Section id="destinataires" title="4. Qui reçoit tes données ?">
        <p>
          Seul l'éditeur (et les personnes qu'il autorise) accède à l'espace d'administration. Celui-ci affiche : prénom,
          adresse e-mail, niveau, formule d'abonnement, statut mineur/majeur, les échanges avec l'assistance et le journal
          de sécurité (dont l'adresse IP). Il n'affiche pas le détail de ton travail scolaire (notes, documents, projets).
          Nos prestataires (sous-traitants) :
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li><strong>Hébergeur / base de données :</strong> <L v={LEGAL.host.name} label="hébergeur" /> ({<L v={LEGAL.host.country} label="pays" />}).</li>
          <li><strong>Paiement :</strong> {LEGAL.processors.payments.name} ({LEGAL.processors.payments.country}). {LEGAL.processors.payments.note}</li>
          <li><strong>E-mails transactionnels :</strong> {LEGAL.processors.email.name} ({LEGAL.processors.email.country}) — {LEGAL.processors.email.note}</li>
          {ai && (
            <li><strong>Coach IA :</strong> {LEGAL.processors.ai.name} ({LEGAL.processors.ai.country}) — tes messages au coach et les éléments de ton profil nécessaires à la réponse lui sont transmis ; ils ne doivent pas contenir d'informations sensibles sur toi ou sur d'autres personnes.</li>
          )}
        </ul>
        <p>
          Lorsqu'un prestataire est situé hors de l'Union européenne, le transfert est encadré par des garanties
          appropriées (décision d'adéquation, clauses contractuelles types). Des informations complémentaires sont
          disponibles sur demande.
        </p>
      </Section>

      <Section id="ia" title="5. Coach IA et recommandations">
        <p>
          Le « coach IA » est un système d'intelligence artificielle : tu échanges avec une machine, pas avec une
          personne. Ses réponses peuvent être inexactes ; ce sont des <strong>estimations pédagogiques indicatives</strong>,
          jamais une garantie de résultat, d'admission ou un conseil officiel d'orientation. Vérifie les informations
          importantes auprès de ton établissement ou d'un·e conseiller·ère d'orientation.
          {!ai && <> À ce jour, le coach fonctionne avec un moteur interne simplifié : aucune donnée n'est envoyée à un fournisseur d'IA externe.</>}
        </p>
      </Section>

      <Section id="droits" title="6. Tes droits">
        <p>
          Tu disposes des droits d'accès, de rectification, d'effacement, de limitation, d'opposition et de portabilité, du
          droit de retirer ton consentement à tout moment, et du droit de définir des directives sur le sort de tes
          données après ton décès.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Immédiatement dans l'application</strong> (Paramètres → Confidentialité) : télécharger toutes tes
            données (JSON) et supprimer ton compte définitivement.
          </li>
          <li>Pour le reste : <L v={contact} label="courriel RGPD" />. Nous répondons dans un délai d'un mois. Nous pouvons te demander de prouver ton identité.</li>
          <li>
            Si tu estimes que tes droits ne sont pas respectés, tu peux saisir la CNIL (Commission nationale de
            l'informatique et des libertés, 3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07 —{" "}
            <a className="text-primary-700 underline" href="https://www.cnil.fr/fr/plaintes" rel="noopener noreferrer">cnil.fr/fr/plaintes</a>).
          </li>
        </ul>
        <p>
          Un mineur exerce ses droits seul·e s'il le souhaite ; son représentant légal peut aussi les exercer pour lui.
        </p>
      </Section>

      <Section id="securite" title="7. Sécurité">
        <p>
          Mots de passe hachés (Argon2id), connexion chiffrée (HTTPS), limitation des tentatives de connexion, accès
          cloisonné par compte, cookies de session sécurisés. Aucune mesure ne garantit un risque zéro ; en cas de
          violation de données susceptible de te porter préjudice, nous te prévenons et notifions la CNIL dans les
          conditions prévues par les articles 33 et 34 du RGPD.
        </p>
      </Section>

      <Section id="cookies" title="8. Cookies">
        <p>
          SCOLYRA n'utilise que des cookies strictement nécessaires à la connexion — voir la{" "}
          <a className="text-primary-700 underline" href="/cookies">politique de cookies</a>.
        </p>
      </Section>

      <Section id="modifs" title="9. Modifications">
        <p>
          En cas de changement important, nous te le signalerons dans l'application avant son entrée en vigueur. La date
          et la version de ce texte figurent en bas de page.
        </p>
      </Section>
    </LegalPage>
  );
}
