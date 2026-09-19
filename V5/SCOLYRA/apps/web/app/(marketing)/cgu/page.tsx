export default function CGUPage() {
  return (
    <div className="prose prose-sm max-w-2xl text-ink-900/80">
      <p className="mb-2 text-sm text-primary-600">CGU</p>
      <h1 className="font-display text-3xl text-ink-900">Conditions générales d'utilisation</h1>
      <p className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
        ⚠️ Modèle de base à faire relire par un professionnel du droit avant mise en production. Champs
        <code> [À COMPLÉTER]</code> obligatoires.
      </p>

      <h2 className="mt-6 font-display text-xl text-ink-900">1. Objet</h2>
      <p className="mt-2 text-sm">
        SCOLYRA est un service d'aide à l'organisation scolaire et à l'orientation. Les présentes CGU encadrent
        l'utilisation de la plateforme par tout utilisateur, y compris mineur avec l'accord de son représentant
        légal le cas échéant.
      </p>

      <h2 className="mt-6 font-display text-xl text-ink-900">2. Nature des recommandations</h2>
      <p className="mt-2 text-sm">
        Les recommandations produites par SCOLYRA (objectifs, priorités de révision, suggestions d'orientation,
        estimation de coût des études) sont des <strong>estimations pédagogiques indicatives</strong>, jamais une
        garantie de résultat scolaire, d'admission dans une formation, ni un conseil financier ou juridique.
      </p>

      <h2 className="mt-6 font-display text-xl text-ink-900">3. Compte utilisateur</h2>
      <p className="mt-2 text-sm">
        Chaque utilisateur est responsable de la confidentialité de son mot de passe. Pour un utilisateur mineur,
        l'abonnement payant nécessite la validation d'un représentant légal.
      </p>

      <h2 className="mt-6 font-display text-xl text-ink-900">4. Abonnement Premium</h2>
      <p className="mt-2 text-sm">
        [À COMPLÉTER une fois le paiement réel (Stripe) en place : prix, durée, conditions de résiliation, droit de
        rétractation de 14 jours applicable aux consommateurs en France (Code de la consommation, art. L221-18),
        sauf renonciation expresse pour un accès immédiat à un contenu numérique.]
      </p>

      <h2 className="mt-6 font-display text-xl text-ink-900">5. Résiliation et suppression de compte</h2>
      <p className="mt-2 text-sm">
        Chaque utilisateur peut supprimer son compte à tout moment depuis les paramètres. La suppression entraîne
        l'effacement des données conformément à la politique de confidentialité.
      </p>

      <h2 className="mt-6 font-display text-xl text-ink-900">6. Droit applicable</h2>
      <p className="mt-2 text-sm">
        Les présentes CGU sont soumises au droit français. [À COMPLÉTER — juridiction compétente en cas de litige].
      </p>

      <p className="mt-8 text-xs text-ink-900/40">
        Dernière mise à jour : [À COMPLÉTER à chaque modification].
      </p>
    </div>
  );
}
