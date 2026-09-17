# Développement

## Lancer en local

```bash
pnpm install
docker compose -f infra/docker-compose.yml up -d
pnpm db:migrate
pnpm dev
```

## Qualité du code

- TypeScript strict (`tsconfig.json` de chaque package).
- ESLint (`next lint` pour `apps/web`).
- Logique métier hors des composants UI — dans `packages/ai`,
  `packages/db`, ou `apps/web/lib/`.
- Aucun secret dans le code source, uniquement dans `.env`.

## Tests

État V0 : aucun test automatisé n'est encore écrit dans cette
génération (⚠️ à ne pas confondre avec "prévu" — voir STATUS.md).
Structure cible, à créer dans `tests/` et colocalisé :

| Domaine | Ce qu'il faut couvrir |
|---|---|
| Auth | inscription, connexion, accès protégé |
| Dashboard | affichage, données utilisateur |
| Objectifs | création, modification, recommandations |
| Révisions | création, affichage, progression |
| Projets | création, tâches |
| Documents | upload, permissions |
| Sécurité | utilisateur A ne peut pas accéder aux données de B |
| Stripe | validation des webhooks, synchronisation abonnement |

Commandes prévues (scripts déjà déclarés dans `package.json`) :

```bash
pnpm test        # tests unitaires (vitest)
pnpm test:e2e     # tests end-to-end (playwright) — config à créer
```

## Ajouter une dépendance

```bash
pnpm --filter @scolyra/web add <paquet>
pnpm --filter @scolyra/ai add <paquet>
pnpm --filter @scolyra/db add <paquet>
```

## Conventions de commit

Non imposées par ce squelette — choisir une convention (ex.
Conventional Commits) et la documenter ici une fois adoptée.
