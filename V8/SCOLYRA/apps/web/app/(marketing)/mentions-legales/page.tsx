export default function MentionsLegalesPage() {
  return (
    <div className="prose prose-sm max-w-2xl text-ink-900/80">
      <p className="mb-2 text-sm text-primary-600">Mentions légales</p>
      <h1 className="font-display text-3xl text-ink-900">Mentions légales</h1>
      <p className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
        ⚠️ Cette page contient des <strong>champs à compléter obligatoirement</strong> avant toute mise en ligne réelle
        (marqués <code>[À COMPLÉTER]</code>). La loi française (LCEN, art. 6-III) impose que ces informations soient
        exactes et à jour sur tout site accessible au public. Ne jamais publier cette page telle quelle.
      </p>

      <h2 className="mt-6 font-display text-xl text-ink-900">Éditeur du site</h2>
      <ul className="mt-2 space-y-1 text-sm">
        <li>Raison sociale / nom : [À COMPLÉTER]</li>
        <li>Forme juridique : [À COMPLÉTER — auto-entreprise, SASU, association...]</li>
        <li>Adresse du siège : [À COMPLÉTER]</li>
        <li>SIREN/SIRET : [À COMPLÉTER]</li>
        <li>Email de contact : [À COMPLÉTER]</li>
        <li>Directeur de la publication : [À COMPLÉTER]</li>
      </ul>

      <h2 className="mt-6 font-display text-xl text-ink-900">Hébergement</h2>
      <p className="mt-2 text-sm">
        Nom de l'hébergeur, adresse et contact : [À COMPLÉTER — dépend de l'hébergeur choisi pour la production].
      </p>

      <h2 className="mt-6 font-display text-xl text-ink-900">Délégué à la protection des données (DPO)</h2>
      <p className="mt-2 text-sm">
        Contact pour toute question RGPD : [À COMPLÉTER]. Un DPO n'est obligatoire que dans certains cas (traitement à
        grande échelle de données sensibles, suivi régulier à grande échelle...) — à faire valider par un professionnel
        du droit selon le volume réel d'utilisateurs mineurs traités.
      </p>

      <h2 className="mt-6 font-display text-xl text-ink-900">Propriété intellectuelle</h2>
      <p className="mt-2 text-sm">
        L'ensemble des contenus de SCOLYRA (textes, structure, code) est protégé sauf mention contraire. Toute
        reproduction non autorisée est interdite.
      </p>

      <p className="mt-8 text-xs text-ink-900/40">
        Dernière mise à jour : [À COMPLÉTER à chaque modification]. Ce document n'a pas été rédigé ni validé par un
        juriste — faire relire avant publication.
      </p>
    </div>
  );
}
