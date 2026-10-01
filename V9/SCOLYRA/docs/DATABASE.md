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
pnpm db:migrate       # crée/applique une migration (dev)
pnpm db:seed          # référentiel de matières
pnpm seed:demo        # données de démonstration
```

⚠️ Le schéma n'a pas pu être validé par `prisma validate` dans
l'environnement de génération (pas d'accès réseau pour installer
Prisma). À exécuter en premier lors de la première installation réelle.
