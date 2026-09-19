Projet :
SCOLYRA

État :
V6 — troisième bug bloquant trouvé lors d'un vrai test (pnpm install)
corrigé : packages/ui n'avait pas de package.json alors qu'il était
référencé comme dépendance workspace. V5 : Documents/Projets/Révisions
désormais persistés en base (même patron que Matières/Objectifs/
Calendrier), vérification du représentant légal implémentée de bout en
bout (invitation par email, lien de confirmation, déblocage réel du
Premium pour les mineurs), Stripe réellement implémenté (Checkout,
webhook, portail de facturation). Reste non branché : pipeline RAG
réel, tests automatisés.

Fonctionnalités terminées (V6) :
- CORRECTION : packages/ui/package.json créé (name: "@scolyra/ui",
  suit exactement le même modèle que packages/ai/package.json) +
  packages/ui/src/index.ts minimal mais réel. `pnpm-workspace.yaml`
  matche "packages/*" et apps/web/package.json déclare
  "@scolyra/ui": "workspace:*" depuis le début — mais le dossier ne
  contenait qu'un sous-dossier src/ vide, sans manifeste, ce qui
  bloquait `pnpm install` pour tout le monorepo. Audité : tous les
  dossiers sous apps/* et packages/* ont maintenant un package.json
  valide (5 au total).

Fonctionnalités terminées (V5) :
- CORRECTIONS SUITE À UN VRAI TEST (merci !) — deux bugs bloquants
  trouvés en conditions réelles, corrigés :
  1. `packages/db/prisma/schema.prisma` utilisait un commentaire de
     bloc `/** ... */` au-dessus du modèle FeatureFlag — syntaxe
     invalide en Prisma (P1012, seuls `//`/`///` sont supportés).
     Corrigé en `//` ; tout le fichier a été relu, plus aucune
     occurrence de `/* */`.
  2. `infra/docker-compose.yml` référençait `minio/minio:latest` sur
     Docker Hub — MinIO a retiré ce dépôt de Docker Hub en septembre
     2026 ("pull access denied ... repository does not exist"). Migré
     vers `quay.io/minio/minio` (registre officiel actuel de MinIO),
     avec un tag épinglé plutôt que `:latest`.
- STRIPE RÉELLEMENT IMPLÉMENTÉ : apps/web/app/api/stripe/checkout
  (vraie session Checkout), /api/stripe/webhook (vérifie la signature,
  synchronise Subscription.plan/status/stripeCustomerId/
  stripeSubscriptionId/currentPeriodEnd sur checkout.session.completed,
  customer.subscription.updated/deleted, invoice.payment_failed),
  /api/stripe/portal (Billing Portal — l'utilisateur gère/résilie
  lui-même). Dégradation propre : sans STRIPE_SECRET_KEY +
  STRIPE_PRICE_ID_PREMIUM configurés, /parametres retombe sur le
  bascule de démo (/api/subscription/upgrade), qui se désactive de
  lui-même dès que Stripe est configuré (impossible de contourner un
  vrai paiement une fois branché). La règle mineur/représentant légal
  vérifié (§25) est appliquée dans les deux chemins via un helper
  partagé (apps/web/lib/subscription-guard.ts). Procédure complète
  étape par étape (créer le produit/prix, récupérer les clés, Stripe
  CLI pour les webhooks en local, cartes de test, passage en Live) :
  voir docs/PAYMENTS.md, entièrement réécrit.
- VÉRIFICATION DU REPRÉSENTANT LÉGAL, de bout en bout : un élève mineur
  invite son représentant depuis /parametres (email) →
  apps/web/app/api/guardian/invite crée un compte PARENT minimal si
  besoin + un lien LegalGuardianLink non vérifié avec un token
  aléatoire (48h) → email envoyé via apps/web/lib/email.ts (Resend si
  configuré, sinon loggé en console en dev, jamais silencieusement
  perdu) → le représentant ouvre /verification-representant?token=...
  (page publique, sans compte requis) et confirme → POST
  /api/guardian/verify marque le lien vérifié. L'upgrade Premium d'un
  compte mineur se débloque alors réellement (plus de blocage
  permanent comme en V3/V4).
- DOCUMENTS RÉELLEMENT PERSISTÉS : apps/web/app/api/documents — création
  et suivi de statut (UPLOADED → READY simulé) en base réelle. Le
  fichier physique lui-même n'est toujours pas stocké (pas de MinIO
  branché), mais l'enregistrement survit au rafraîchissement.
- PROJETS RÉELLEMENT PERSISTÉS : apps/web/app/api/projects +
  api/projects/[id]/tasks + api/project-tasks/[id] — création de
  projet avec tâches initiales, ajout de tâches, bascule terminée/à
  faire, progression recalculée depuis les vraies tâches en base.
- RÉVISIONS RÉELLEMENT PERSISTÉES : apps/web/app/api/revision-sessions
  — un RevisionPlan "courant" est créé automatiquement au premier
  ajout de session (pas de gestion de plans multiples en V0), sessions
  avec priorité et statut cliquable (à faire → en cours → fait),
  persistées en base.

Fonctionnalités terminées (V4) :
- Rate limiting Redis sur la connexion (8/15min par email) et
  l'inscription (5/heure par IP) — apps/web/lib/rate-limit.ts.
- Cookies de session explicitement durcis (httpOnly/sameSite/secure),
  vérification du mot de passe non court-circuitée si l'email
  n'existe pas (mitigation d'énumération de comptes).
- En-têtes HTTP de sécurité (X-Frame-Options, HSTS, etc.) via
  next.config.js.
- RGPD réellement implémenté : GET /api/account/export (export JSON
  complet), DELETE /api/account/delete (suppression en cascade),
  tous deux branchés sur les boutons de /parametres. Consentement
  CGU/confidentialité obligatoire et versionné à l'inscription
  (modèle Consent).
- Pages légales /mentions-legales, /confidentialite, /cgu créées avec
  des gabarits — contiennent des champs [À COMPLÉTER] pour tout ce
  qui ne peut pas être inventé (identité de l'éditeur, hébergeur...).
- Journal d'audit (AuditLog) réellement instrumenté : connexion,
  création de compte, export, suppression, upgrade Premium,
  modification de feature flag — visible et branché sur de vraies
  données dans /admin/journal.
- PANNEAU ADMIN POUR LE PREMIUM (/admin/fonctionnalites) : nouveau
  modèle FeatureFlag, un admin peut décider depuis l'UI quelles
  fonctionnalités (quiz d'orientation, simulateur de coût, et deux
  flags préparés pour plus tard) sont réservées à Premium ou
  ouvertes à tous — sans toucher au code. Le quiz et le simulateur
  vérifient ce réglage dynamique.
- .gitignore durci (secrets, dumps, uploads), scan automatique de
  secrets sur GitHub (.github/workflows/secret-scan.yml, gitleaks) et
  hook pre-commit local optionnel (scripts/install-git-hooks.sh).
- docs/SECURITY.md réécrit avec une checklist concrète "avant de
  pousser sur GitHub" et un état honnête de la conformité RGPD.
- docs/QUICKSTART.md enrichi : génération d'un vrai NEXTAUTH_SECRET,
  configuration Stripe en mode TEST (clés, Stripe CLI — les routes
  Stripe elles-mêmes restent non implémentées), Resend, et rappel de
  la checklist sécurité avant le premier push.

Fonctionnalités terminées (V3) :
- AUTHENTIFICATION RÉELLE (next-auth v4, Credentials + Argon2id contre
  Prisma, session JWT incluant le rôle). Middleware (apps/web/middleware.ts)
  protège réellement /dashboard, /objectifs, /revisions, /calendrier,
  /documents, /projets, /orientation, /coach, /matieres, /profil,
  /parametres ET /admin (redirection /login si non connecté,
  redirection /dashboard si rôle ≠ ADMIN sur /admin — corrige le
  problème "admin accessible sans aucun code").
- Comptes de test créés par `pnpm seed:demo` :
    Élève : demo@scolyra.app / demo12345
    Admin  : admin@scolyra.app / admin12345
- INSCRIPTION EN PLUSIEURS ÉTAPES (apps/web/app/(marketing)/register) :
  identité → classe → options (si la classe en a) → spécialités (1re/
  Terminale uniquement, 3 puis 2 max). Référentiel complet dans
  apps/web/lib/curriculum.ts (sources : education.gouv.fr, Note DEPP
  n°26-06, onisep.fr — consultées en septembre 2026), avec validation
  CÔTÉ SERVEUR (apps/web/app/api/register) qui rejette une spécialité
  choisie pour un niveau qui n'en a pas (ex. 2de, collège).
- NOTES RÉELLES : apps/web/app/api/grades — ajout de note par matière,
  moyenne recalculée à partir des vraies notes (apps/web/lib/grades.ts).
- MATIÈRES PERSONNALISÉES : apps/web/app/api/subjects — un élève peut
  créer une matière libre ; apps/web/app/api/user-subjects/[id] permet
  de décocher "compter dans la moyenne" par matière (persisté).
- OBJECTIFS RÉELS : apps/web/app/api/goals — création, paliers
  (stockés en Json sur Goal.milestones, cochables et persistés).
- CALENDRIER RÉEL : apps/web/app/api/study-sessions — ajout de
  sessions sur la semaine réelle, marquage "fait" persisté.
- ORIENTATION RÉELLE : apps/web/app/api/orientation — domaines
  envisagés et contrainte géographique (distance max, régions
  préférées) éditables et persistés ; apps/web/app/api/orientation/
  applications — ajout de candidatures en saisie libre (Formation
  créée avec isVerified=false, jamais présentée comme officielle).
- QUIZ D'ORIENTATION PREMIUM (/orientation/quiz) : 10 questions à choix
  multiples pondérées par domaine (apps/web/lib/orientation-quiz.ts),
  intègre la contrainte géographique, résultat calculé et persisté
  (OrientationProfile.quizAnswers/quizResult). Gate réel sur
  Subscription.plan === PREMIUM, côté serveur (pas juste caché en CSS).
- SIMULATEUR DE COÛT DES ÉTUDES PREMIUM (/orientation/simulateur-cout) :
  chiffres indicatifs sourcés (arrêté droits d'inscription 2025-2026,
  étude coût de la rentrée 2025, barème bourses CROUS) dans
  apps/web/lib/cost-simulator.ts — clairement marqué non contractuel.
- UPGRADE FREE → PREMIUM RÉEL : apps/web/app/api/subscription/upgrade —
  bascule instantanée (AUCUN paiement réel, voir docs/PAYMENTS.md),
  mais bloque réellement un compte mineur sans LegalGuardianLink
  vérifié (§25), avec message explicite plutôt qu'un échec silencieux.
- COACH IA BRANCHÉ SUR LES VRAIES DONNÉES : apps/web/app/api/coach
  appelle réellement AIOrchestrator + les agents avec les VRAIES
  notes/objectifs/erreurs/orientation de l'utilisateur connecté — ce
  n'est plus une réponse aléatoire tirée d'une liste fixe. Le
  raisonnement reste celui du MockAIProvider tant qu'aucun vrai
  fournisseur IA n'est configuré (voir docs/AI.md).
- Dashboard, sidebar et page Profil connectés aux vraies données
  (moyenne réelle calculée, spécialités/options réelles affichées,
  jours actifs de la semaine calculés depuis les vraies sessions).
- Admin : vue d'ensemble et liste des élèves connectées à de vraies
  requêtes Prisma (comptages réels, derniers comptes créés, alerte
  réelle sur les mineurs sans représentant vérifié).

Fonctionnalités terminées (V2 — inchangées) :
- Couche d'animation Framer Motion, mécaniques d'engagement (confettis,
  toasts, streak), identité visuelle (encre/violet/or, Fraunces+Inter),
  site /docs, groupes de routes (marketing)/(app)/admin.

Fonctionnalités partielles :
- ParcoursupAgent : lève explicitement une erreur "non implémenté".
- Admin "Contenus", "Abonnements" : toujours sur données de
  démonstration (lib/demo-data.ts) — "Vue d'ensemble", "Élèves",
  "Fonctionnalités" et "Journal d'audit" sont branchés sur Prisma.
- Pages pricing/about : statiques, pas de paiement réel (assumé,
  voir upgrade Premium ci-dessus qui est le seul flux d'abonnement réel).

Fonctionnalités non implémentées :
- Resend : l'abstraction email existe et fonctionne (apps/web/lib/email.ts,
  utilisée par l'invitation représentant légal), mais aucune clé n'est
  configurée par défaut — sans RESEND_API_KEY, les emails sont
  seulement loggés en console (comportement voulu en dev, voir
  QUICKSTART.md pour l'activer).
- Redis/BullMQ (jobs asynchrones — Redis sert déjà au rate limiting,
  mais aucune queue de tâches n'est en place), pipeline RAG réel (OCR,
  embeddings réels, recherche pgvector), tests automatisés,
  déploiement production.
- Gestion de plans de révision multiples (V0 : un seul plan "courant"
  par élève, créé automatiquement).
- Stockage réel de fichiers (MinIO/S3) pour les documents — seul
  l'enregistrement en base existe, pas le fichier lui-même.

Commandes de lancement :
pnpm install
cp .env.example .env
docker compose -f infra/docker-compose.yml up -d
pnpm db:migrate
pnpm db:seed
pnpm seed:demo
pnpm dev

URL locale :
http://localhost:3000 — /login pour se connecter avec un compte de
test, /register pour créer un vrai compte avec l'onboarding complet.

Variables obligatoires :
DATABASE_URL, REDIS_URL, NEXTAUTH_SECRET (générer avec
`openssl rand -base64 32`). Les autres ont des valeurs par défaut
fonctionnelles en développement, voir .env.example.

Services externes :
Aucun requis pour utiliser l'application avec un vrai compte
(AI_PROVIDER=mock par défaut). Stripe/Resend/un vrai fournisseur IA
sont optionnels et non branchés dans cette version.

Comptes de démonstration (créés par pnpm seed:demo) :
  Élève : demo@scolyra.app / demo12345
  Admin  : admin@scolyra.app / admin12345 (accède à /admin)

Problèmes connus :
- MISE À JOUR IMPORTANTE : ce projet bénéficie enfin de vrais tests
  (merci !), qui ont trouvé et permis de corriger trois bugs
  bloquants au total : commentaire `/** */` invalide dans le schéma
  Prisma, image Docker MinIO disparue de Docker Hub, et
  packages/ui/package.json manquant (bloquait `pnpm install` avant
  même d'atteindre le reste — voir le détail plus haut et dans
  TROUBLESHOOTING.md). Tout le reste, en particulier Stripe et les
  nouvelles routes Documents/Projets/Révisions/représentant légal,
  n'a TOUJOURS PAS pu être testé en conditions réelles puisque
  l'installation elle-même n'avait pas encore réussi.
- Le reste n'a été exécuté dans AUCUN environnement de génération :
  pas de Node/pnpm/Docker/réseau disponibles ici. Tout le code
  (schéma Prisma, migrations implicites, routes API, middleware,
  y compris le rate limiting Redis et le nouveau modèle FeatureFlag)
  a été écrit avec soin et relu manuellement pour la cohérence des
  imports et des types, mais n'a subi NI `prisma migrate dev`, NI
  `pnpm build`, NI un seul chargement de page réel. Traite ce livrable
  comme un premier jet solide à tester, pas comme un logiciel validé.
- Point d'attention prioritaire au premier lancement : `pnpm db:migrate`
  (valide enfin le schéma Prisma, y compris les champs V3 ET le nouveau
  modèle FeatureFlag de la V4, ET les champs verificationToken/
  tokenExpiresAt sur LegalGuardianLink de la V5), puis `pnpm seed:demo`, puis tester la
  connexion avec les deux comptes, puis vérifier que le rate limiting
  ne bloque pas tes propres tests répétés (voir REDIS_URL dans .env).
- Les polices Fraunces/Inter (next/font/google) nécessitent un accès
  réseau au tout premier build.
- Le simulateur de coût et les données du référentiel de spécialités/
  options sont des estimations/synthèses, pas des données officielles
  temps réel — à revalider périodiquement (voir sources citées dans
  apps/web/lib/curriculum.ts et apps/web/lib/cost-simulator.ts).
- Les pages /mentions-legales, /confidentialite et /cgu contiennent
  des champs [À COMPLÉTER] volontaires — NE PAS les publier telles
  quelles, voir docs/SECURITY.md.
- gitleaks (scan de secrets) n'a jamais été exécuté sur ce dépôt dans
  cet environnement — le premier push sur GitHub sera donc le premier
  vrai test du workflow .github/workflows/secret-scan.yml.

Prochaine étape recommandée :
1. Relancer `pnpm db:migrate` avec le schéma corrigé et confirmer que
   toute la chaîne (migration → seed → dev) passe cette fois. C'est la
   vérification la plus importante : le premier vrai test a déjà
   trouvé deux bugs bloquants, il peut en rester d'autres (Stripe et
   les nouvelles routes n'ont, elles, jamais été testées du tout).
2. Suivre docs/PAYMENTS.md pour configurer Stripe en mode Test et
   valider un paiement de bout en bout avec une carte de test.
3. Brancher un vrai fournisseur IA (AI_PROVIDER) pour que le coach
   raisonne réellement plutôt que via le mock.
4. Écrire les tests automatisés (aucun n'existe encore) — au minimum
   l'isolation des données (utilisateur A / utilisateur B) et le flux
   d'authentification, qui sont les plus critiques côté sécurité.
