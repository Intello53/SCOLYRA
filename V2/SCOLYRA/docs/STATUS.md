Projet :
SCOLYRA

État :
Fondation V0 — architecture fonctionnelle, dashboard démo navigable,
persistance et authentification réelles non branchées.

Fonctionnalités terminées :
- Structure monorepo pnpm complète et cohérente
- Schéma Prisma complet (30 modèles couvrant tout le cahier des
  charges §20 : identité, pédagogie, objectifs, révisions, documents/
  RAG, projets, orientation, facturation, IA, conformité)
- infra/docker-compose.yml (PostgreSQL+pgvector, Redis, MinIO) —
  configuration écrite, NON EXÉCUTÉE dans cet environnement (pas
  d'accès réseau/Docker dans le sandbox de génération)
- Abstraction AI_PROVIDER + MockAIProvider fonctionnel (pur TypeScript,
  sans dépendance externe)
- 6 agents IA implémentés (Pedagogical, Objective, Revision,
  CopyAnalysis, Orientation, Project) + orchestrateur avec détection
  d'intention par mots-clés
- Application Next.js : layout + navigation, page d'accueil, dashboard
  RÉELLEMENT fonctionnel avec données de démonstration typées
  (apps/web/lib/demo-data.ts)
- Scripts de seed (référentiel de matières + compte démo avec notes/
  objectif, hashage Argon2id)
- Documentation complète : README, CLAUDE.md, et 13 fichiers dans
  docs/ (QUICKSTART, INSTALLATION, TUTORIEL 26 sections, ARCHITECTURE,
  DATABASE, AI, SECURITY, PAYMENTS, DEVELOPMENT, DEPLOYMENT,
  TROUBLESHOOTING, ROADMAP, CHANGELOG, STATUS)

Fonctionnalités terminées (mise à jour) :
- Couche d'animation complète avec Framer Motion (dépendance ajoutée à
  apps/web/package.json) : transitions de page (template.tsx par
  groupe de routes), apparitions en cascade (StaggerGroup/StaggerItem),
  compteurs animés (AnimatedNumber), anneau et barres de progression
  qui se remplissent à l'affichage, indicateur de navigation actif qui
  glisse (layoutId) dans les sidebars élève et admin
- Mécaniques d'engagement : confettis + notifications toast à la
  validation d'un palier d'objectif, d'une tâche de projet ou d'une
  session de révision (composants confetti.tsx, toast.tsx,
  celebration.tsx) ; badge "streak" animé dans la sidebar élève
  (démo statique, pas de vraie logique de séquence de jours)
- Pages rendues réellement interactives (état local React, sans
  backend) : Objectifs (paliers cochables), Projets (tâches cochables,
  progression recalculée en direct), Révisions (statut cliquable),
  Documents (import simulé avec transition "en traitement" →
  "analysé"), Coach IA (fil de conversation avec indicateur de frappe
  animé et réponses mock aléatoires)
- Toutes les interactions respectent prefers-reduced-motion (les
  primitives d'animation dans components/motion.tsx désactivent les
  transitions si l'utilisateur l'a demandé au niveau système)
- Refonte complète de l'interface : identité visuelle propre (encre/
  violet/or), polices Fraunces + Inter, composants partagés
  (PageHeader, Panel, StatBlock, Badge, ProgressBar, EmptyState)
- Toutes les pages élève (profil, matières, objectifs, révisions,
  calendrier, documents, projets, orientation, coach, paramètres) ont
  désormais une interface riche et réaliste avec données de démo
  détaillées (apps/web/lib/demo-data.ts) — toujours NON connectées à
  Prisma (voir "Fonctionnalités non implémentées")
- Séparation en groupes de routes Next.js : (marketing) sans sidebar
  élève, (app) avec sidebar + anneau de progression persistant, admin/
  avec sa propre sidebar sombre distincte
- Site /docs entièrement reconstruit : sidebar de navigation par
  section, contenu réellement rendu (paragraphes, code avec bouton
  copier, tableaux, notes, listes), navigation précédent/suivant —
  contenu structuré dans apps/web/lib/docs-content.ts (plus fidèle et
  plus riche que les fichiers docs/*.md, qui restent la référence
  "brute")
- Interface d'administration (/admin) : vue d'ensemble (stats, alertes),
  liste des élèves, contenus (référentiel matières/formations),
  abonnements, journal d'audit — toutes en données de démonstration,
  aucune protection d'accès réelle (voir ci-dessous)

Fonctionnalités partielles :
- ParcoursupAgent : classe présente mais lève explicitement une erreur
  "non implémenté" (aucune source de données officielle disponible)
- Pages pricing/about/login/register : interface soignée, formulaires
  non fonctionnels (boutons désactivés, pas de logique serveur)

Fonctionnalités non implémentées :
- Toute l'interactivité ajoutée (paliers, tâches, révisions, documents,
  coach) est en état local React uniquement : rien n'est persisté, un
  rafraîchissement de page réinitialise tout. Aucune écriture Prisma.
- ⚠️ /admin n'est protégé par AUCUN contrôle d'accès — n'importe qui
  connaissant l'URL peut y accéder tant que l'authentification et une
  vérification de rôle ADMIN ne sont pas branchées. À corriger avant
  tout déploiement, même de test partagé.
- Toutes les pages élève et admin lisent des données statiques
  (lib/demo-data.ts) — aucune requête Prisma réelle nulle part
- Authentification réelle (inscription/connexion/sessions Auth.js) —
  seul le modèle User + hashage Argon2id existent
- Stripe (Checkout, Billing Portal, webhooks) — seul le modèle de
  données existe (Subscription, Payment)
- Resend (envoi d'emails) — aucun service créé
- Redis/BullMQ (jobs asynchrones) — service déclaré dans Docker
  Compose, aucun worker créé
- Pipeline RAG réel (OCR, chunking, upload vers MinIO, recherche
  pgvector) — seul le modèle de données et l'interface embed() (mock)
  existent
- Tests (unitaires et E2E) — aucun test écrit dans cette génération
- Rate limiting, CSRF, audit logs instrumentés — prévus au schéma/à la
  doc, non codés
- Déploiement (Dockerfile prod, CI/CD)

Commandes de lancement :
pnpm install
cp .env.example .env
docker compose -f infra/docker-compose.yml up -d
pnpm db:migrate
pnpm db:seed
pnpm seed:demo
pnpm dev

URL locale :
http://localhost:3000 (dashboard démo : /dashboard)

Variables obligatoires :
DATABASE_URL, REDIS_URL, AUTH_SECRET (les autres ont des valeurs par
défaut fonctionnelles en développement, voir .env.example)

Services externes :
Aucun requis pour naviguer le dashboard démo (AI_PROVIDER=mock par
défaut). Stripe/Resend/un vrai fournisseur IA sont optionnels et non
branchés dans cette version.

Compte de démonstration :
email: demo@scolyra.app (créé par pnpm seed:demo — mot de passe de
test uniquement, ne pas utiliser en production)

Problèmes connus :
- Les polices Fraunces/Inter sont chargées via next/font/google : la
  toute première exécution de `pnpm dev`/`pnpm build` nécessite un accès
  réseau pour les télécharger (ensuite elles sont mises en cache/
  auto-hébergées par Next.js)
- Aucune capture d'écran ni build réel n'a pu être vérifié dans
  l'environnement de génération (pas de Node/Next installé, pas de
  réseau) — à vérifier en premier lors du prochain `pnpm dev`
- Le schéma Prisma n'a pas pu être validé par l'outil `prisma validate`
  dans l'environnement de génération (pas d'accès réseau) — à exécuter
  en priorité lors de la première installation réelle
- docker-compose.yml n'a pas pu être testé (`docker compose up`) dans
  cet environnement — à vérifier lors de la première installation

Prochaine étape recommandée :
1. Sur ta machine Fedora : exécuter QUICKSTART.md intégralement et
   vérifier que `pnpm db:migrate` passe sans erreur (validation réelle
   du schéma Prisma).
2. Implémenter l'authentification réelle (Auth.js) — c'est le
   prérequis bloquant pour connecter les autres pages à de vraies
   données utilisateur plutôt qu'au mode démo.
3. Ensuite, connecter le dashboard aux vraies requêtes Prisma (retirer
   la dépendance à demo-data.ts).
