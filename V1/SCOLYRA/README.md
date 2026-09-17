# SCOLYRA

**Copilote scolaire et d'orientation pour élèves et étudiants.**

SCOLYRA construit et ajuste en continu le plan de travail d'un élève à
partir de son niveau réel et de ses objectifs, puis le relie directement
à son orientation post-bac. Sa différenciation : la corrélation
intelligente de toutes les données pédagogiques (notes, compétences,
erreurs, objectifs, temps disponible) et d'orientation de l'élève —
pas un simple chatbot scolaire.

> ⚠️ **État du projet : fondation V0 / architecture fonctionnelle.**
> Voir [`docs/STATUS.md`](docs/STATUS.md) pour le détail exact de ce qui
> est réellement implémenté et de ce qui reste à faire.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS · PostgreSQL + pgvector
· Prisma · Redis + BullMQ · MinIO/S3 · Stripe · Resend · Docker Compose
· pnpm.

## Architecture

```
apps/web        Application Next.js
packages/db     Schéma Prisma (PostgreSQL + pgvector)
packages/ai     Abstraction IA (AI_PROVIDER) + agents + orchestrateur
packages/ui     Composants partagés
infra/          docker-compose (Postgres, Redis, MinIO)
docs/           Documentation (affichée sur /docs)
```

Détails : [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Installation

Voir le tutoriel complet : [`docs/QUICKSTART.md`](docs/QUICKSTART.md) et
[`docs/INSTALLATION.md`](docs/INSTALLATION.md).

Résumé :

```bash
pnpm install
cp .env.example .env
docker compose -f infra/docker-compose.yml up -d
pnpm db:migrate
pnpm db:seed
pnpm seed:demo
pnpm dev
```

Puis ouvrir http://localhost:3000 — le dashboard est navigable
immédiatement grâce aux données de démonstration, sans aucune clé API
externe configurée (`AI_PROVIDER=mock` par défaut).

## Variables d'environnement

Voir [`.env.example`](.env.example) — chaque variable y est commentée.

## Tests

```bash
pnpm test
pnpm test:e2e
```

Voir [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md).

## Documentation

Documentation complète dans [`docs/`](docs/), également accessible via
la route `/docs` de l'application (rendu web en cours de finalisation —
voir STATUS.md).

## Déploiement

Voir [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

## Conformité légale et RGPD

Le projet pouvant concerner des utilisateurs mineurs, une architecture
de consentement et de représentant légal est prévue dans le schéma
(`Consent`, `LegalGuardianLink`). **La conformité juridique et RGPD doit
être validée par un professionnel compétent avant toute
commercialisation.** Voir [`docs/SECURITY.md`](docs/SECURITY.md).
