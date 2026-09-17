# Sécurité & conformité

## Authentification

- Mots de passe hashés avec Argon2id (`argon2` dans `packages/db`).
- Sessions prévues via cookies `httpOnly`, `secure`, `sameSite` — la
  configuration Auth.js elle-même reste à implémenter dans
  `apps/web` (V0 : schéma `User` prêt, pas encore de route
  d'authentification fonctionnelle).
- Toute entrée utilisateur doit être validée côté serveur avec Zod
  avant écriture en base.

## Isolation des données

Chaque requête doit filtrer explicitement par `userId` côté serveur —
ne jamais faire confiance à un identifiant transmis par le client sans
vérification de session. Un test dédié doit vérifier qu'un utilisateur
A ne peut pas accéder aux données d'un utilisateur B (voir
DEVELOPMENT.md §Tests, TODO en V0).

## Uploads

- Limiter la taille des fichiers (`Document.sizeBytes`).
- Valider le `mimeType` avant stockage.
- Ne jamais exécuter de contenu uploadé.

## Prompt injection

Le contenu de documents utilisateur injecté dans un prompt IA (RAG) doit
être clairement délimité et jamais interprété comme une instruction
système. À formaliser lors de l'implémentation réelle du pipeline RAG.

## Secrets

- Toutes les clés vivent uniquement dans `.env` (jamais committé —
  voir `.gitignore`).
- Aucune clé API n'est exposée côté frontend (`NEXT_PUBLIC_*` réservé
  aux valeurs publiques comme `STRIPE_PUBLISHABLE_KEY`).

## Audit

Le modèle `AuditLog` (userId, action, metadata, ip) est prévu pour
tracer les actions sensibles (connexion, changement d'abonnement,
suppression de compte). Son instrumentation reste à faire au fil des
fonctionnalités.

## RGPD et mineurs

- Modèle `Consent` : chaque consentement (CGU, politique de
  confidentialité, autorisation représentant légal, emails marketing,
  traitement de données par l'IA) est horodaté et versionné.
- Modèle `LegalGuardianLink` : relie un compte mineur à un représentant
  légal, avec un champ `verified`.
- Fonctionnalités prévues côté produit : export des données, suppression
  de compte, minimisation des données collectées à l'onboarding.

> **La conformité juridique et RGPD doit être validée par un
> professionnel compétent avant toute commercialisation.** La présence
> de ces modèles techniques ne constitue pas, en soi, une conformité.
