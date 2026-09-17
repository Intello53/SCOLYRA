Projet :
SCOLYRA

État :
V3 — authentification réelle, données persistées en base pour les
fonctionnalités principales (notes, objectifs, calendrier, matières,
orientation), admin réellement protégé. Reste non branché : Stripe
réel, pipeline RAG réel, tests automatisés, pages Projets/Révisions/
Documents encore en état local (non persistées).

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
- Pages Projets, Révisions, Documents : interactives mais encore en
  état local React (non persistées) — prochaine étape logique après
  cette V3, suivant exactement le même patron que Matières/Objectifs/
  Calendrier (route API + Server Component + Client Component).
- Admin "Contenus", "Abonnements", "Journal d'audit" : toujours sur
  données de démonstration (lib/demo-data.ts) — seuls "Vue d'ensemble"
  et "Élèves" sont branchés sur Prisma dans cette version.
- Pages pricing/about : statiques, pas de paiement réel (assumé,
  voir upgrade Premium ci-dessus qui est le seul flux d'abonnement réel).

Fonctionnalités non implémentées :
- Stripe réel (Checkout, Billing Portal, webhooks) — l'upgrade Premium
  actuel est un bascule direct en base, pas un paiement.
- Vérification réelle du représentant légal (formulaire de
  vérification, email de confirmation...) — seul le modèle
  LegalGuardianLink existe, rien ne permet encore de le remplir/vérifier
  depuis l'UI.
- Resend (emails), Redis/BullMQ (jobs), pipeline RAG réel (OCR,
  embeddings réels, recherche pgvector), tests automatisés,
  déploiement production.

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
- RIEN DE CE QUI PRÉCÈDE N'A ÉTÉ EXÉCUTÉ dans l'environnement de
  génération : pas de Node/pnpm/Docker/réseau disponibles ici. Tout le
  code (schéma Prisma, migrations implicites, routes API, middleware)
  a été écrit avec soin et relu manuellement pour la cohérence des
  imports et des types, mais n'a subi NI `prisma migrate dev`, NI
  `pnpm build`, NI un seul chargement de page réel. Traite ce livrable
  comme un premier jet solide à tester, pas comme un logiciel validé.
- Point d'attention prioritaire au premier lancement : `pnpm db:migrate`
  (valide enfin le schéma Prisma, y compris les nouveaux champs
  options/specialties/includeInAverage/milestones/geographic*), puis
  `pnpm seed:demo`, puis tester la connexion avec les deux comptes.
- Les polices Fraunces/Inter (next/font/google) nécessitent un accès
  réseau au tout premier build.
- Le simulateur de coût et les données du référentiel de spécialités/
  options sont des estimations/synthèses, pas des données officielles
  temps réel — à revalider périodiquement (voir sources citées dans
  apps/web/lib/curriculum.ts et apps/web/lib/cost-simulator.ts).

Prochaine étape recommandée :
1. Tester réellement l'installation (§ci-dessus) et corriger les
   éventuelles erreurs de compilation TypeScript ou de migration —
   c'est la vérification qui manque le plus à ce stade.
2. Persister Projets/Révisions/Documents en base (même patron que
   Matières/Objectifs/Calendrier).
3. Brancher un vrai fournisseur IA (AI_PROVIDER) pour que le coach
   raisonne réellement plutôt que via le mock.
4. Implémenter la vérification du représentant légal (formulaire +
   email) pour débloquer proprement l'upgrade Premium des mineurs.
