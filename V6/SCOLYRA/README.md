# SCOLYRA

**Copilote scolaire et d'orientation pour élèves et étudiants.**

SCOLYRA construit et ajuste en continu le plan de travail d'un élève à
partir de son niveau réel et de ses objectifs, puis le relie directement
à son orientation post-bac. Sa différenciation : la corrélation
intelligente de toutes les données pédagogiques (notes, compétences,
erreurs, objectifs, temps disponible) et d'orientation de l'élève —
pas un simple chatbot scolaire.

> ⚠️ **État du projet : V6 — troisième bug bloquant corrigé
> (`packages/ui` n'avait pas de `package.json`, bloquait `pnpm install`
> avant même d'atteindre le reste). V5 : Stripe réellement implémenté,
> Documents/Projets/Révisions persistés en base, vérification du
> représentant légal fonctionnelle.** Voir
> [`docs/STATUS.md`](docs/STATUS.md) pour le détail exact. **Stripe et
> les routes ajoutées en V5 n'ont toujours pas pu être testés en
> conditions réelles** puisque l'installation elle-même échouait
> jusqu'ici — merci de continuer à signaler ce qui casse.
> **Avant tout `git push`, lis [`docs/SECURITY.md`](docs/SECURITY.md)**
> (checklist secrets/GitHub) et complète les pages légales
> (`/mentions-legales`, `/confidentialite`, `/cgu`) — la conformité
> RGPD doit être validée par un professionnel avant toute mise en
> ligne réelle.

## Comptes de test

Après `pnpm seed:demo` :

| Rôle | Email | Mot de passe |
|---|---|---|
| Élève | `demo@scolyra.app` | `demo12345` |
| Admin | `admin@scolyra.app` | `admin12345` |

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

Puis ouvrir http://localhost:3000 — `/register` pour créer un vrai
compte avec l'onboarding (classe → options → spécialités), ou
`/login` avec un des comptes de test ci-dessus. Aucune clé API externe
n'est requise pour l'essentiel de l'app (`AI_PROVIDER=mock` par
défaut) ; le quiz d'orientation et le simulateur de coût sont réservés
aux comptes Premium (bascule instantanée dans Paramètres, aucun
paiement réel).

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
