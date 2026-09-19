export default function ConfidentialitePage() {
  return (
    <div className="prose prose-sm max-w-2xl text-ink-900/80">
      <p className="mb-2 text-sm text-primary-600">Politique de confidentialité</p>
      <h1 className="font-display text-3xl text-ink-900">Politique de confidentialité</h1>
      <p className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
        ⚠️ Modèle de base à faire valider par un professionnel du droit avant toute mise en production, en
        particulier parce que SCOLYRA traite des données de mineurs. Les champs <code>[À COMPLÉTER]</code> sont
        obligatoires. Ceci ne constitue pas un conseil juridique.
      </p>

      <h2 className="mt-6 font-display text-xl text-ink-900">1. Responsable du traitement</h2>
      <p className="mt-2 text-sm">[À COMPLÉTER — identité de l'éditeur, voir mentions légales].</p>

      <h2 className="mt-6 font-display text-xl text-ink-900">2. Données collectées</h2>
      <ul className="mt-2 space-y-1 text-sm">
        <li>Identité : prénom, email, mot de passe (haché, jamais en clair)</li>
        <li>Scolarité : niveau, options, spécialités, établissement (facultatif)</li>
        <li>Pédagogie : notes, objectifs, sessions de révision, erreurs identifiées</li>
        <li>Orientation : domaines envisagés, réponses au quiz d'orientation (Premium)</li>
        <li>Technique : adresse IP (limitation du brute-force), horodatage de connexion</li>
      </ul>

      <h2 className="mt-6 font-display text-xl text-ink-900">3. Finalités</h2>
      <p className="mt-2 text-sm">
        Fournir le service (profil pédagogique, recommandations, coach IA), sécuriser les comptes, et — uniquement si
        applicable — traiter un abonnement Premium. Aucune donnée n'est vendue à des tiers.
      </p>

      <h2 className="mt-6 font-display text-xl text-ink-900">4. Base légale</h2>
      <p className="mt-2 text-sm">
        Exécution du contrat (fourniture du service) et consentement explicite pour les traitements optionnels
        (ex. IA). Pour les utilisateurs mineurs, un consentement parental est requis pour certains traitements
        conformément à l'article 8 du RGPD et aux recommandations de la CNIL sur les mineurs — [À COMPLÉTER : décrire
        précisément le mécanisme retenu et le faire valider juridiquement].
      </p>

      <h2 className="mt-6 font-display text-xl text-ink-900">5. Conservation</h2>
      <p className="mt-2 text-sm">
        [À COMPLÉTER — durée de conservation par catégorie de données, ex. durée du compte + X mois après suppression
        pour les logs de sécurité].
      </p>

      <h2 className="mt-6 font-display text-xl text-ink-900">6. Tes droits (RGPD)</h2>
      <p className="mt-2 text-sm">
        Droit d'accès, de rectification, d'effacement, de limitation, de portabilité et d'opposition. Tu peux exporter
        tes données ou supprimer ton compte directement depuis <em>Paramètres</em>, ou nous contacter à
        [À COMPLÉTER — email de contact]. Tu peux aussi introduire une réclamation auprès de la CNIL (cnil.fr).
      </p>

      <h2 className="mt-6 font-display text-xl text-ink-900">7. Sous-traitants et hébergement</h2>
      <p className="mt-2 text-sm">
        [À COMPLÉTER — hébergeur de la base de données, éventuel fournisseur IA une fois branché, Stripe pour les
        paiements le cas échéant. Préciser si les données quittent l'Union européenne.]
      </p>

      <h2 className="mt-6 font-display text-xl text-ink-900">8. Cookies</h2>
      <p className="mt-2 text-sm">
        SCOLYRA utilise uniquement un cookie de session strictement nécessaire à la connexion (aucun cookie
        publicitaire ou de mesure d'audience à ce stade) — ce type de cookie est exempté de consentement préalable
        selon les recommandations de la CNIL. Si un outil de mesure d'audience ou publicitaire est ajouté par la
        suite, cette section devra être mise à jour et un bandeau de consentement ajouté.
      </p>

      <p className="mt-8 text-xs text-ink-900/40">
        Dernière mise à jour : [À COMPLÉTER à chaque modification].
      </p>
    </div>
  );
}
