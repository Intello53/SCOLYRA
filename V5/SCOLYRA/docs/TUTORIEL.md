# Tutoriel complet SCOLYRA

## Accueil

SCOLYRA est un copilote scolaire et d'orientation. Ce tutoriel couvre
l'installation, la prise en main, et les modifications courantes.

## 1 — Comprendre SCOLYRA

Voir [ARCHITECTURE.md](ARCHITECTURE.md) pour la vision et le
fonctionnement général. En résumé : un profil pédagogique centralisé
(`StudentProfile`, `UserSubject`, `UserSkill`, `Grade`, `Mistake`)
alimente des agents IA (`packages/ai/src/agents`) via un orchestrateur,
qui produisent recommandations et plans de révision.

## 2 — Préparer Fedora

Voir [INSTALLATION.md](INSTALLATION.md) §1-5.

## 3 — Installer SCOLYRA

Voir [INSTALLATION.md](INSTALLATION.md) §6.

## 4 — Configurer `.env`

Chaque variable de `.env.example` est commentée inline. Les valeurs par
défaut (`AI_PROVIDER=mock`, credentials MinIO/Postgres de dev)
fonctionnent sans aucun compte externe.

## 5 — Démarrer PostgreSQL / Redis / MinIO

```bash
docker compose -f infra/docker-compose.yml up -d
```

Console MinIO : http://localhost:9001 (identifiants dans `.env`).

## 6 — Initialiser Prisma

```bash
pnpm db:generate
pnpm db:migrate
```

## 7 — Générer les données de démonstration

```bash
pnpm db:seed       # référentiel de matières
pnpm seed:demo     # compte élève fictif + notes + objectif
```

## 8 — Lancer le serveur

```bash
pnpm dev
```

## 9 — Tester l'application

Naviguer vers `/dashboard`, `/objectifs`, `/revisions`, etc. Les pages
hors dashboard sont des squelettes d'interface en V0 (voir STATUS.md).

## 10 — Comprendre l'architecture

Voir [ARCHITECTURE.md](ARCHITECTURE.md).

## 11 — Comprendre la base de données

Voir [DATABASE.md](DATABASE.md) et `packages/db/prisma/schema.prisma`.

## 12 — Comprendre le système IA

Voir [AI.md](AI.md).

## 13 — Ajouter un agent IA

1. Créer `packages/ai/src/agents/mon-agent.ts`, implémenter une classe
   qui utilise `getAIProvider()`.
2. L'enregistrer dans `AIOrchestrator` (`packages/ai/src/orchestrator.ts`).
3. Ajouter une détection d'intention dans `detectIntent()`.

## 14 — Modifier une page

Les pages sont dans `apps/web/app/<route>/page.tsx` (App Router
Next.js). Modifier directement le composant React.

## 15 — Ajouter une fonctionnalité

1. Modifier `packages/db/prisma/schema.prisma` si une nouvelle entité
   est nécessaire.
2. `pnpm db:migrate` pour créer la migration.
3. Ajouter la logique serveur (route handler ou server action) dans
   `apps/web/app/`.
4. Ajouter l'UI correspondante.
5. Ajouter un test (`tests/` ou colocalisé).

## 16 — Ajouter une nouvelle table

```bash
# après avoir édité schema.prisma
pnpm db:migrate
pnpm db:generate
```

## 17 — Modifier le dashboard

Le dashboard démo lit `apps/web/lib/demo-data.ts`. Pour le connecter à
de vraies données, remplacer ces imports par des requêtes Prisma
(`@scolyra/db`) dans un composant serveur.

## 18 — Utiliser le RAG

Pipeline complet décrit dans [ARCHITECTURE.md](ARCHITECTURE.md) §RAG.
En V0, seul le modèle de données (`Document`, `DocumentChunk` avec
colonne `vector(1536)`) et l'interface `embed()` existent — le pipeline
d'ingestion (OCR, chunking, appel réel du provider) reste à implémenter.

## 19 — Configurer Stripe

Voir [PAYMENTS.md](PAYMENTS.md).

## 20 — Configurer Resend

Renseigner `RESEND_API_KEY` dans `.env`. Sans clé, les emails doivent
être loggés en console (service à implémenter dans
`apps/web/lib/email/`, non encore créé en V0).

## 21 — Sécurité

Voir [SECURITY.md](SECURITY.md).

## 22 — RGPD

Voir [SECURITY.md](SECURITY.md) §RGPD. Rappel : la conformité doit être
validée par un professionnel avant toute commercialisation.

## 23 — Tests

Voir [DEVELOPMENT.md](DEVELOPMENT.md) §Tests.

## 24 — Déploiement

Voir [DEPLOYMENT.md](DEPLOYMENT.md).

## 25 — Dépannage

Voir [TROUBLESHOOTING.md](TROUBLESHOOTING.md).

## 26 — Roadmap

Voir [ROADMAP.md](ROADMAP.md).
