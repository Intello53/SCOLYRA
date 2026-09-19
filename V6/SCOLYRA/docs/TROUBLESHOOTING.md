# Dépannage

## `pnpm install` échoue

- Vérifier la version de Node (`node --version`, ≥20 requis).
- Vérifier que `corepack enable` a bien été exécuté.

## `pnpm install` échoue : "packages/ui/package.json introuvable"

Bug réel trouvé lors d'un test (corrigé depuis la V6) : `packages/ui`
était référencé dans `pnpm-workspace.yaml` et
`apps/web/package.json` (`@scolyra/ui: workspace:*`) mais son
`package.json` n'avait jamais été créé — le dossier ne contenait
qu'un sous-dossier `src/` vide. pnpm ne peut pas résoudre une
dépendance workspace vers un package sans manifeste. Si tu vois encore
cette erreur, vérifie que `packages/ui/package.json` et
`packages/ui/src/index.ts` existent bien (ils doivent être présents
dans le zip depuis la V6).

## `docker compose up` échoue sur MinIO : "pull access denied for minio/minio"

MinIO a retiré son image de Docker Hub en septembre 2026 (le dépôt
`minio/minio` n'existe simplement plus là-bas — ce n'est pas un
problème d'identifiants, se connecter avec `docker login` ne change
rien). `infra/docker-compose.yml` pointe déjà vers
`quay.io/minio/minio` (leur registre officiel actuel) avec un tag
épinglé — si tu vois encore cette erreur, vérifie que tu utilises bien
la version à jour de ce fichier, ou remplace manuellement
`image: minio/minio:...` par `image: quay.io/minio/minio:...` (mêmes
tags, même contenu, juste un autre registre).

## `prisma migrate dev` échoue avec "P1012 ... does not start with any known Prisma schema keyword"

Le fichier `.prisma` ne supporte **pas** les commentaires de bloc style
JSDoc (`/** ... */`) — seulement `//` et `///`. Si tu ajoutes un
commentaire au-dessus d'un nouveau modèle, utilise `//` sur chaque
ligne, jamais `/** ... */`.

## Erreur de connexion à PostgreSQL

```bash
docker compose -f infra/docker-compose.yml ps
docker compose -f infra/docker-compose.yml logs postgres
```

Vérifier que `DATABASE_URL` dans `.env` correspond bien aux
identifiants définis dans `infra/docker-compose.yml`.

## `prisma migrate dev` échoue sur l'extension `vector`

L'image utilisée dans `docker-compose.yml` est `pgvector/pgvector:pg16`,
qui inclut déjà l'extension. Si vous utilisez une autre image
PostgreSQL, installer manuellement `pgvector` avant de migrer.

## Le dashboard ne charge pas

Vérifier que `pnpm dev` tourne bien sans erreur dans le terminal, et
que le port 3000 n'est pas déjà utilisé par un autre processus.

## Les fonctionnalités IA ne répondent pas comme attendu

En mode `AI_PROVIDER=mock` (par défaut), les réponses sont
volontairement simplifiées et préfixées `[MOCK-...]` — ce n'est pas un
bug. Pour un comportement réel, un fournisseur IA doit être implémenté
et branché (voir AI.md).

## Un fichier de configuration semble absent

Consulter `docs/STATUS.md` : certaines fonctionnalités documentées ici
(Stripe, auth complète, tests) ne sont pas encore implémentées dans
cette génération V0 — ce n'est pas une erreur d'installation.
