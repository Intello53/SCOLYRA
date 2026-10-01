import type { Metadata } from "next";
import { LEGAL } from "../../../lib/legal";
import { LegalPage, Section, L } from "../../../components/legal-page";

export const metadata: Metadata = {
  title: "Accessibilité",
  description: "État d'accessibilité numérique de SCOLYRA, mesures prises et moyen de signaler un problème.",
  alternates: { canonical: "/accessibilite" },
};

export default function AccessibilitePage() {
  return (
    <LegalPage
      title="Accessibilité"
      intro="SCOLYRA veut être utilisable par tous, y compris avec un lecteur d'écran, au clavier ou avec une vue réduite."
    >
      <Section id="etat" title="État de conformité">
        <p>
          SCOLYRA n'a <strong>pas encore fait l'objet d'un audit d'accessibilité</strong> (référentiel RGAA 4 / WCAG 2.1 niveau AA).
          Nous ne déclarons donc pas le site conforme. Une déclaration d'accessibilité formelle n'est pas obligatoire pour
          un service de cette taille, mais nous travaillons dans cet esprit.
        </p>
      </Section>

      <Section id="mesures" title="Mesures mises en place">
        <ul className="list-disc space-y-1 pl-5">
          <li>Structure HTML sémantique (zones <em>main</em>, <em>nav</em>, titres hiérarchisés), langue de la page déclarée, lien « Aller au contenu principal ».</li>
          <li>Champs de formulaire associés à une étiquette, erreurs annoncées aux lecteurs d'écran.</li>
          <li>Contrastes de texte vérifiés pour atteindre au moins 4,5:1 sur les textes courants.</li>
          <li>Navigation complète au clavier, indicateur de focus visible, fermeture des menus avec la touche Échap.</li>
          <li>Respect de la préférence système « réduire les animations ».</li>
          <li>Zoom du navigateur non bloqué ; mise en page adaptative.</li>
          <li>Données structurées (schema.org), plan du site et fichier <code>llms.txt</code> pour les moteurs et agents automatisés.</li>
        </ul>
      </Section>

      <Section id="limites" title="Limites connues">
        <p>
          Les tableaux de bord et graphiques de l'application connectée n'ont pas encore été testés avec des lecteurs d'écran
          (NVDA, VoiceOver) ; certaines visualisations peuvent manquer d'alternative textuelle détaillée. Les animations
          décoratives sont désactivées si tu as demandé de réduire les mouvements.
        </p>
      </Section>

      <Section id="contact" title="Signaler un problème">
        <p>
          Si tu rencontres un obstacle, écris à <L v={LEGAL.editor.email} label="courriel" /> en indiquant la page et ta
          situation (technologie d'assistance utilisée, navigateur) : nous répondrons sous un délai raisonnable et proposerons
          une alternative. En l'absence de réponse satisfaisante, tu peux saisir le Défenseur des droits (
          <a className="text-primary-700 underline" href="https://formulaire.defenseurdesdroits.fr" rel="noopener noreferrer">formulaire.defenseurdesdroits.fr</a>).
        </p>
      </Section>
    </LegalPage>
  );
}
