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

## Mes données ont disparu après avoir extrait une nouvelle version

`infra/docker-compose.yml` fixe maintenant `name: scolyra` en haut du
fichier. Sans cette ligne, Docker Compose nomme le projet d'après le
dossier d'où tu lances la commande — donc chaque nouveau dossier
d'extraction (`V8/`, `V9/`...) obtenait des volumes Postgres/MinIO
différents et vides. Si tu es sur une version antérieure à la V9,
tes anciennes données restent dans l'ancien volume Docker ; tu peux
les récupérer avec `pnpm db:export` lancé depuis l'ANCIEN dossier,
puis `pnpm db:import <fichier>` depuis le nouveau (voir QUICKSTART.md).

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

## `prisma migrate dev` échoue avec "P1012 ... Environment variable not found: DATABASE_URL"

Le `.env` racine n'est chargé ni par Prisma ni par Next.js quand la
commande tourne depuis `packages/db/` ou `apps/web/` (chacun cherche
un `.env` dans son PROPRE dossier). Corrigé via
`scripts/with-root-env.js` (remplace `dotenv-cli`, retiré en V9 — un
script maison, plus simple à auditer, sans dépendance tierce), qui
charge explicitement le `.env` racine et **affiche maintenant un
message clair si ce fichier est absent** — cause la plus fréquente :
tu viens d'extraire une nouvelle version dans un nouveau dossier et
n'as pas encore refait `cp .env.example .env` à cet endroit précis.

## "Impossible de contacter le serveur" à la création de compte (ou ailleurs)

Ce message est trompeur : il apparaît aussi bien pour une vraie
coupure réseau QUE pour un plantage côté serveur (le `fetch` réussit,
mais la réponse n'est pas du JSON valide — souvent une page d'erreur
HTML renvoyée par Next.js suite à une exception non attrapée). Depuis
la V9, `/api/register` a un try/catch complet qui renvoie toujours du
JSON, et le client affiche le code HTTP exact au lieu du message
générique. Si tu vois encore ce genre d'erreur ailleurs : ouvre le
terminal où tourne `pnpm dev`, l'erreur réelle (avec sa stack trace)
y est loggée — toujours plus informatif que ce que le navigateur peut
afficher.

## Le coach IA ne répond qu'avec des messages "[MOCK-...]"

Normal si `AI_PROVIDER=mock` dans `.env` (valeur par défaut — l'app
fonctionne sans aucune clé). Pour un vrai raisonnement IA, voir
[AI.md](AI.md) § "Configurer un vrai fournisseur".

## `prisma migrate dev` échoue avec "P1012 ... extensions property is only available with the postgresqlExtensions preview feature"

Bug réel trouvé lors d'un test (corrigé depuis la V7) : le schéma
utilisait `extensions = [vector]` dans le bloc `datasource` sans
jamais activer la preview feature correspondante dans le bloc
`generator`. Corrigé — le générateur déclare maintenant :
```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}
```
Si tu vois encore cette erreur, vérifie que ton
`packages/db/prisma/schema.prisma` contient bien cette ligne
`previewFeatures`.

## `tsx prisma/seed.ts` échoue avec "Cannot find module '.prisma/client/default'"

Dans la quasi-totalité des cas, ce n'est pas un bug séparé : c'est la
**conséquence** d'un `prisma migrate dev` qui a échoué juste avant (le
client Prisma n'est généré qu'à la fin d'une migration réussie).
Corrige d'abord l'erreur affichée par `pnpm db:migrate`, relance-la
jusqu'à ce qu'elle passe, puis relance `pnpm db:seed` — l'erreur de
module manquant disparaît d'elle-même.

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
