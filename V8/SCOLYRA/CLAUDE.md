# CLAUDE.md — Instructions permanentes du projet SCOLYRA

Ce fichier permet à toute future session (avec Claude ou un autre agent,
y compris l'agent local Hermes Agent / Nemotron-3-Ultra-550B-A55) de
comprendre immédiatement SCOLYRA et de continuer le travail correctement.

## Vision

SCOLYRA construit et ajuste en continu le plan de travail d'un élève à
partir de son niveau réel et de ses objectifs, puis le relie directement
à son orientation. La valeur centrale n'est PAS le chatbot : c'est la
corrélation du profil pédagogique (notes, compétences, difficultés,
objectifs, temps disponible) avec les recommandations produites.

## Architecture

Monorepo pnpm :

```
apps/web        → Next.js App Router (TypeScript, Tailwind)
packages/db      → Prisma + schéma PostgreSQL/pgvector
packages/ai      → Abstraction AI_PROVIDER + agents + orchestrateur
packages/ui      → Composants partagés (à développer)
infra/           → docker-compose (Postgres, Redis, MinIO)
docs/            → Documentation source (markdown), affichée sur /docs
scripts/         → Scripts utilitaires
tests/           → Tests transverses
```

## Commandes

```bash
pnpm install
pnpm dev                 # démarre apps/web
docker compose -f infra/docker-compose.yml up -d
pnpm db:migrate
pnpm db:seed              # référentiel de base
pnpm seed:demo            # compte + données de démonstration
pnpm test
pnpm lint
```

## Conventions

- TypeScript strict partout.
- Logique métier hors des composants UI (dans packages/ ou lib/).
- Toute donnée sensible passe par Zod côté serveur avant écriture en base.
- Aucune clé API ne doit apparaître dans le code frontend.

## Règles IA (impératif)

- **Aucun** appel direct à un SDK IA (OpenAI/Anthropic/Gemini) en dehors de
  `packages/ai/src/providers/`. Tout passe par `getAIProvider()`.
- `AI_PROVIDER=mock` doit toujours permettre de faire tourner l'app sans
  clé externe — ne jamais casser ce mode.
- Les agents ne doivent jamais formuler une note future comme une
  garantie. Toujours "estimation pédagogique".
- Suivre les tokens/coûts via le modèle `AIUsage`.

## Authentification (impératif)

- next-auth v4, Credentials provider, session JWT — config dans
  `apps/web/lib/auth.ts`. Mots de passe hashés Argon2id.
- `apps/web/middleware.ts` protège toutes les routes élève ET `/admin`
  (rôle ADMIN requis). Ne jamais retirer une route de son matcher sans
  ajouter une protection équivalente ailleurs.
- Comptes de test : `demo@scolyra.app` / `demo12345` (élève),
  `admin@scolyra.app` / `admin12345` (admin) — créés par `pnpm seed:demo`.
- Toute nouvelle route API doit vérifier la session via
  `getCurrentUser()` (`apps/web/lib/session.ts`) et filtrer par
  `userId` — jamais faire confiance à un ID transmis par le client.

## Référentiel scolaire

- `apps/web/lib/curriculum.ts` liste les classes, options et
  spécialités réellement proposées en France (sourcé
  education.gouv.fr/onisep, à revérifier périodiquement). Toute
  validation de choix (options/spécialités par niveau) doit être faite
  côté serveur, pas seulement dans l'UI (voir `app/api/register`).

## Sécurité (impératif)

- Toute route API sensible (auth, inscription) doit passer par
  `checkRateLimit()` (`apps/web/lib/rate-limit.ts`) avant tout accès
  base de données coûteux.
- Ne jamais committer de secret réel. Avant de pousser sur GitHub, lire
  `docs/SECURITY.md` § "Checklist avant de pousser sur GitHub" et
  installer `scripts/install-git-hooks.sh`. Le scan automatique
  `.github/workflows/secret-scan.yml` (gitleaks) tourne à chaque push.
- Toute nouvelle fonctionnalité pouvant être réservée à Premium doit
  s'enregistrer dans `FEATURE_DEFAULTS`
  (`apps/web/lib/feature-flags.ts`) plutôt que de coder un contrôle
  `plan === "PREMIUM"` en dur — l'admin doit pouvoir la basculer depuis
  `/admin/fonctionnalites` sans déploiement de code.

## Règles RGPD / mineurs (impératif)

- Les utilisateurs finaux incluent des mineurs. Ne jamais permettre à un
  compte marqué `isMinor: true` d'initier un paiement Stripe sans lien
  `LegalGuardianLink` vérifié.
- Ne jamais déclarer SCOLYRA "conforme RGPD" dans la documentation ou le
  code : indiquer systématiquement que la conformité doit être validée
  par un professionnel compétent avant toute commercialisation.
- Toute collecte de consentement passe par le modèle `Consent`, avec la
  version du texte consenti.

## Règles sur les données d'orientation

- Ne jamais inventer de données Parcoursup, de statistiques officielles,
  ou de prérequis d'écoles. Le modèle `Formation` doit rester vide de
  données réelles tant qu'une source vérifiée n'a pas été branchée
  (`Formation.sourceUrl`).
- `ParcoursupAgent` reste non implémenté tant qu'aucune source de
  données fiable n'est intégrée (voir docs/ROADMAP.md, V3).

## Règles de documentation

- Toute nouvelle fonctionnalité significative doit être reflétée dans
  `docs/STATUS.md`, avec son état réel (terminé / partiel / non
  implémenté — jamais "terminé" pour un mock).
- La documentation source reste dans `docs/*.md` ; `/docs` sert de
  rendu web (rendu markdown→HTML à finaliser, voir STATUS.md).

## Règles de modification du projet

- Ne jamais exécuter de commande destructrice sans avertissement
  explicite préalable et alternative non destructive proposée.
- Ne jamais prétendre avoir exécuté une commande, lancé Docker, ou
  testé une URL sans l'avoir réellement fait dans l'environnement
  d'exécution disponible.
