# Changelog

## [0.1.0] — Fondation initiale

Première génération du projet SCOLYRA.

### Ajouté

- Structure monorepo pnpm (`apps/web`, `packages/db`, `packages/ai`,
  `packages/ui`, `infra`, `docs`).
- Schéma Prisma complet (toutes les entités du cahier des charges).
- `infra/docker-compose.yml` (PostgreSQL+pgvector, Redis, MinIO).
- Abstraction `AIProvider` + `MockAIProvider` + 7 agents IA +
  orchestrateur.
- Application Next.js : layout, page d'accueil, dashboard démo
  fonctionnel, pages stub pour les routes restantes, page `/docs`.
- Scripts de seed (référentiel + démonstration).
- Documentation complète (`README.md`, `CLAUDE.md`, `docs/*.md`).

### Non inclus dans cette version

Voir `docs/STATUS.md` pour la liste exacte des fonctionnalités
partielles ou non implémentées (authentification, Stripe, RAG réel,
tests, déploiement).
