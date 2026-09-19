# Démarrage rapide

## Prérequis

Vérifier ce qui est déjà installé (ne rien réinstaller par défaut) :

```bash
git --version
node --version
pnpm --version
docker --version
docker compose version
```

Si `pnpm` manque :

```bash
corepack enable
corepack prepare pnpm@9.9.0 --activate
```

## Étapes

```bash
git clone <url-de-votre-dépôt> SCOLYRA
cd SCOLYRA
pnpm install
cp .env.example .env
```

**Génère un vrai secret de session** (ne garde jamais la valeur
d'exemple, même en local) :

```bash
openssl rand -base64 32
# colle le résultat dans .env → NEXTAUTH_SECRET=...
```

```bash
docker compose -f infra/docker-compose.yml up -d
pnpm db:migrate
pnpm db:seed
pnpm seed:demo
pnpm dev
```

Ouvrir http://localhost:3000. Deux options :
- **Se connecter avec un compte de test** (créé par `pnpm seed:demo`) :
  - Élève : `demo@scolyra.app` / `demo12345`
  - Admin : `admin@scolyra.app` / `admin12345` (accède à `/admin`)
- **Créer un vrai compte** via `/register` (onboarding classe → options
  → spécialités).

Aucune clé API externe n'est requise pour l'essentiel de l'app
(`AI_PROVIDER=mock` par défaut). Le quiz d'orientation et le
simulateur de coût sont Premium — passe ton compte en Premium depuis
*Paramètres* (bascule de démonstration, aucun paiement réel tant que
Stripe n'est pas configuré, voir plus bas), ou active-les pour tout le
monde depuis `/admin/fonctionnalites` avec le compte admin.

## Configurer Stripe (optionnel — sans lui, mode démo Premium instantané)

Stripe est réellement implémenté (Checkout, webhook, portail de
facturation). Sans les clés ci-dessous, `/parametres` propose un
bascule Premium instantané de démonstration à la place — pratique
pour tester le reste de l'app sans créer de compte Stripe.

**Procédure complète, étape par étape, avec captures conceptuelles et
tests de bout en bout : voir [PAYMENTS.md](PAYMENTS.md).** Résumé express :

1. Compte sur [stripe.com](https://dashboard.stripe.com/register), mode Test.
2. Crée un produit + prix récurrent → `STRIPE_PRICE_ID_PREMIUM`.
3. *Developers → API keys* → `STRIPE_SECRET_KEY` (`sk_test_...`) et
   `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (`pk_test_...`).
4. Stripe CLI pour les webhooks en local :
   ```bash
   stripe login
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
   La commande affiche un secret `whsec_...` à mettre dans
   `STRIPE_WEBHOOK_SECRET`.
5. **Ne jamais committer ces clés.** Elles vivent uniquement dans
   `.env`, qui est ignoré par Git (voir `.gitignore` et
   [SECURITY.md](SECURITY.md)).

## Configurer Resend (optionnel — emails)

L'abstraction email (`apps/web/lib/email.ts`) est fonctionnelle et
utilisée par l'invitation du représentant légal (`/parametres`). Sans
clé, les emails sont simplement loggés dans la console du serveur au
lieu d'être envoyés — pratique pour tester le flux sans compte Resend.
Pour l'activer :
1. Compte sur [resend.com](https://resend.com), récupère une clé API.
2. `RESEND_API_KEY` dans `.env`.

## Avant de pousser ce projet sur GitHub

**Lis [SECURITY.md](SECURITY.md) → section "Checklist avant de pousser
sur GitHub"** avant le tout premier `git push` — elle explique comment
vérifier qu'aucun `.env` ni secret n'est suivi par Git, et comment
activer le scan automatique déjà configuré dans ce dépôt
(`.github/workflows/secret-scan.yml`). Installe aussi le filet de
sécurité local :

```bash
bash scripts/install-git-hooks.sh
```

Pour la suite, voir [INSTALLATION.md](INSTALLATION.md) (détail de
chaque étape) et [TUTORIEL.md](TUTORIEL.md) (guide complet).
