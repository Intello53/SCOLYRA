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

Fonctionnalités partielles :
- Page /docs : structure de navigation présente, rendu markdown→HTML
  NON branché (liste les fichiers, ne les affiche pas encore)
- ParcoursupAgent : classe présente mais lève explicitement une erreur
  "non implémenté" (aucune source de données officielle disponible)
- Pages profil/matières/objectifs/révisions/calendrier/documents/
  projets/orientation/coach/paramètres/pricing/about/login/register :
  squelettes d'interface uniquement, non connectées à la base de
  données ni à une logique serveur

Fonctionnalités non implémentées :
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
