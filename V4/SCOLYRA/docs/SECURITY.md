# Sécurité & conformité

## Authentification (réelle depuis la V3)

- next-auth v4, Credentials provider, mots de passe hashés Argon2id.
  Config : `apps/web/lib/auth.ts`.
- Sessions JWT via cookies `httpOnly`, `sameSite=lax`, `secure` en
  production (explicite dans `authOptions.cookies`, pas seulement les
  défauts de next-auth).
- Vérification du mot de passe systématique même si l'email n'existe
  pas (hash factice comparé) — évite qu'un attaquant déduise par le
  temps de réponse quels emails sont enregistrés.
- **Limite acceptée et documentée** : le message d'erreur d'inscription
  ("un compte existe déjà avec cet email") révèle qu'un email est pris.
  C'est un compromis UX standard ; à retirer si le risque d'énumération
  est jugé inacceptable pour ton contexte.
- Toute entrée utilisateur est validée côté serveur avec Zod avant
  écriture en base (voir chaque route dans `apps/web/app/api/`).

## Protection brute-force

- `apps/web/lib/rate-limit.ts` (Redis, fenêtre fixe) limite :
  - la connexion : 8 tentatives / 15 min **par email visé** ;
  - l'inscription : 5 tentatives / heure **par IP**.
- Si Redis est injoignable, le système "fail open" (laisse passer, en
  loggant une erreur) plutôt que de bloquer tout le monde — compromis
  documenté, à surveiller en prod via les logs `[rate-limit]`.

## Isolation des données

Chaque route API filtre explicitement par `userId` tiré de la session
serveur (`getCurrentUser()`), jamais d'un ID transmis par le client.
Voir par exemple `apps/web/app/api/grades/route.ts` (vérifie que la
matière appartient bien au profil de l'appelant avant d'accepter une
note). Un test automatisé dédié (utilisateur A ne peut pas accéder aux
données de B) reste TODO — voir DEVELOPMENT.md.

## Autorisation admin

- `apps/web/middleware.ts` protège `/admin/*` : session valide **+**
  rôle `ADMIN`, sinon redirection (jamais de simple code/mot de passe
  partagé — un vrai compte avec le bon rôle est requis).
- Chaque route `/api/admin/*` revérifie le rôle côté serveur (ne
  jamais faire confiance uniquement au middleware pour une route API).

## En-têtes HTTP

`apps/web/next.config.js` ajoute `X-Frame-Options`,
`X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` et
`Strict-Transport-Security` à toutes les réponses.

## Uploads

- Limiter la taille des fichiers (`Document.sizeBytes`).
- Valider le `mimeType` avant stockage.
- Ne jamais exécuter de contenu uploadé.
- (Le pipeline d'upload réel reste TODO — voir ROADMAP.md.)

## Prompt injection

Le contenu de documents utilisateur injecté dans un prompt IA (RAG) doit
être clairement délimité et jamais interprété comme une instruction
système. À formaliser lors de l'implémentation réelle du pipeline RAG.

## Secrets

- Toutes les clés vivent uniquement dans `.env` (jamais committé).
- `.gitignore` exclut explicitement `.env*`, `*.pem`, `*.key`, les
  dumps de base (`*.sql`, `*.dump`), et les uploads utilisateurs.
- Aucune clé API n'est exposée côté frontend (`NEXT_PUBLIC_*` réservé
  aux valeurs publiques comme `STRIPE_PUBLISHABLE_KEY`).

## ⚠️ Checklist avant de pousser ce dépôt sur GitHub

À faire une fois, avant le tout premier `git push` :

1. **Vérifier qu'aucun `.env` réel n'est suivi par Git** :
   ```bash
   git ls-files | grep -E "^\.env$|\.env\.local$"
   ```
   Si une ligne apparaît, retire le fichier du suivi AVANT de committer :
   ```bash
   git rm --cached .env
   ```
2. **Générer un vrai secret pour la prod** (ne jamais réutiliser la
   valeur d'exemple) :
   ```bash
   openssl rand -base64 32
   ```
3. **Scanner l'historique avant le premier push**, au cas où un secret
   aurait été committé pendant le développement local :
   ```bash
   pip install --user detect-secrets  # ou: brew install gitleaks
   gitleaks detect --source . -v
   ```
   Si un secret est détecté dans l'historique, ne te contente pas de le
   supprimer dans un nouveau commit (il reste dans l'historique Git) :
   régénère la clé côté fournisseur (Stripe, etc.) ET réécris
   l'historique (`git filter-repo` ou BFG Repo-Cleaner) avant de rendre
   le dépôt public.
4. **Activer le scan automatique sur GitHub** : ce dépôt inclut
   `.github/workflows/secret-scan.yml` (gitleaks à chaque push/PR) —
   rien à faire, il s'active dès que le dépôt est sur GitHub. Active
   aussi, côté réglages GitHub, "Secret scanning" et "Push protection"
   (Settings → Code security) si le dépôt est privé sur un plan qui le
   permet — automatique et gratuit sur les dépôts publics.
5. **Ne jamais committer de vraies données d'élèves.** Les seeds
   (`prisma/seed-demo.ts`) ne contiennent que des données fictives
   ("Léa Moreau", `demo@scolyra.app`) — si tu ajoutes un jeu de données
   de test, vérifie qu'il reste 100% fictif.
6. **Vérifier le dépôt en dry-run** avant le premier push :
   ```bash
   git status  # rien d'inattendu (pas de .env, pas de dump SQL...)
   ```

## Audit

Le modèle `AuditLog` est maintenant réellement instrumenté (V3/V4) :
connexion (`LOGIN`), création de compte (`ACCOUNT_CREATED`), export de
données (`DATA_EXPORT_REQUESTED`), suppression de compte
(`ACCOUNT_DELETION_REQUESTED`), upgrade Premium
(`SUBSCRIPTION_UPGRADED_PREMIUM`), modification d'un feature flag
(`FEATURE_FLAG_UPDATED`). Consultable dans `/admin/journal`.

## RGPD et mineurs

Implémenté réellement (pas seulement modélisé) :
- **Droit d'accès/portabilité** : `GET /api/account/export` (bouton
  "Exporter mes données" dans Paramètres) renvoie un export JSON complet
  de l'utilisateur connecté uniquement.
- **Droit à l'effacement** : `DELETE /api/account/delete` (bouton
  "Supprimer mon compte") supprime réellement le compte et cascade sur
  la quasi-totalité des données liées (`onDelete: Cascade` dans le
  schéma Prisma).
- **Consentement** : à l'inscription, acceptation obligatoire des CGU
  et de la politique de confidentialité, horodatée et versionnée dans
  le modèle `Consent`.
- **Mineurs** : modèle `LegalGuardianLink` (représentant légal +
  vérification) — bloque réellement le passage en Premium tant qu'un
  lien vérifié n'existe pas. **Le formulaire de vérification côté
  représentant légal lui-même (envoi d'email, validation) reste à
  construire** — seule la donnée et la règle de blocage existent.
- **Cookies** : uniquement un cookie de session strictement
  nécessaire (aucun tracking/publicité) — exempté de bandeau de
  consentement selon les recommandations CNIL. À revoir si un outil de
  mesure d'audience est ajouté plus tard.
- **Pages légales** : `/mentions-legales`, `/confidentialite`, `/cgu`
  créées avec des gabarits — **contiennent des champs `[À COMPLÉTER]`
  obligatoires** (identité de l'éditeur, hébergeur, DPO...) à remplir
  avant toute mise en ligne réelle.

> **La conformité juridique et RGPD doit être validée par un
> professionnel compétent avant toute commercialisation.** Ce qui
> précède décrit des mécanismes techniques réellement implémentés,
> pas un avis juridique ni une certification de conformité. En
> particulier, le traitement de données de mineurs (article 8 RGPD,
> recommandations CNIL) mérite une revue dédiée avant tout lancement
> public, même gratuit.
