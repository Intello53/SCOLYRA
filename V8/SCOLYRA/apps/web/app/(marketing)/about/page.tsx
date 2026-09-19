import { Reveal } from "../../../components/motion";

export default function AboutPage() {
  return (
    <div className="max-w-2xl">
      <Reveal>
        <p className="mb-2 text-sm text-primary-600">À propos</p>
        <h1 className="font-display text-3xl text-ink-900">
          Pourquoi SCOLYRA existe
        </h1>
      </Reveal>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-ink-900/70">
        <Reveal delay={0.05}>
          <p>
            La plupart des outils scolaires traitent chaque chose séparément :
            un cahier de textes ici, une appli de révisions là, un site
            d'orientation ailleurs. Aucun ne relie vraiment le niveau réel d'un
            élève à ses objectifs, puis à son orientation.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <p>
            SCOLYRA part d'un principe simple : un profil pédagogique
            centralisé — notes, compétences, erreurs récurrentes, temps
            disponible — permet de construire un plan de travail qui a du
            sens, et de l'ajuster en continu plutôt que de le refaire à
            chaque trimestre.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <p>
            Le produit est pensé pour le lycée français, avec la conscience que
            beaucoup de ses utilisateurs sont mineurs : les choix techniques
            autour des paiements et du consentement en tiennent compte dès la
            conception (voir la documentation sécurité).
          </p>
        </Reveal>
      </div>
    </div>
  );
}
