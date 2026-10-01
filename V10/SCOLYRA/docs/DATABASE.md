# Base de données

PostgreSQL + extension `pgvector`, gérée via Prisma
(`packages/db/prisma/schema.prisma`).

## Entités principales

Identité & profil : `User`, `Profile`, `StudentProfile`,
`LegalGuardianLink`.

Pédagogie : `Subject`, `UserSubject`, `Skill`, `UserSkill`, `Grade`,
`Assessment`, `Mistake`.

Objectifs & travail : `Goal`, `StudySession`, `RevisionPlan`,
`RevisionSession`.

Documents / RAG : `Document`, `DocumentChunk` (colonne
`vector(1536)`), `Course`.

Projets : `Project`, `ProjectTask`.

Orientation : `OrientationProfile`, `Formation`, `Application`,
`Deadline`.

Notifications : `Notification`.

Facturation : `Subscription`, `Payment`.

IA : `AIConversation`, `AIMessage`, `AIUsage`.

Sécurité / conformité : `AuditLog`, `Consent`.

## Points d'attention

- `Formation` ne contient **aucune donnée réelle** pré-remplie : le
  champ `sourceUrl` trace l'origine d'un futur import vérifié.
- `LegalGuardianLink` doit être vérifié (`verified: true`) avant qu'un
  compte `isMinor: true` puisse initier un paiement — cette vérification
  applicative reste à implémenter côté `apps/web` (V0 : modèle
  seulement).
- `DocumentChunk.embedding` utilise `Unsupported("vector(1536)")` :
  Prisma ne modélise pas nativement `pgvector`, les requêtes de
  similarité devront passer par `$queryRaw`.

## Commandes

```bash
pnpm db:generate     # génère le client Prisma
pnpm db:migrate       # synchronise la base avec schema.prisma (prisma db push)
pnpm db:seed          # référentiel de matières
pnpm seed:demo        # données de démonstration
```

**Pourquoi `db push` plutôt que `prisma migrate dev`** : ce projet est
livré par zips successifs sans historique de migrations Git (aucune
exécution réelle de Prisma n'a eu lieu côté génération — voir
STATUS.md). `migrate dev` a besoin d'un historique de migrations
cohérent avec la base ; `db push` synchronise directement le schéma
sans en dépendre, ce qui est plus robuste dans ce contexte précis. Si
ce projet devient un vrai dépôt Git versionné avec une équipe, il est
recommandé de repasser à `prisma migrate dev` + des migrations
commitées (voir DEVELOPMENT.md).

⚠️ `db push` est lancé avec `--accept-data-loss` (nécessaire pour
qu'il tourne sans confirmation interactive) : si un changement de
schéma implique de supprimer une colonne/table contenant des données,
elles sont perdues SANS confirmation. Fais `pnpm db:export` avant de
mettre à jour vers une nouvelle version si tu veux garder tes données
de test (voir QUICKSTART.md).

⚠️ Le schéma n'a pas pu être validé par `prisma validate` dans
l'environnement de génération (pas d'accès réseau pour installer
Prisma). À exécuter en premier lors de la première installation réelle.
