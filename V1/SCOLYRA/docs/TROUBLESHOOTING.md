# Dépannage

## `pnpm install` échoue

- Vérifier la version de Node (`node --version`, ≥20 requis).
- Vérifier que `corepack enable` a bien été exécuté.

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
