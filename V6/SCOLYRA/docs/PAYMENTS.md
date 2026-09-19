# Paiements (Stripe)

## État réel (depuis cette version)

Stripe est **réellement implémenté** :
- `apps/web/app/api/stripe/checkout` — crée une vraie session Stripe
  Checkout (abonnement) et renvoie son URL.
- `apps/web/app/api/stripe/webhook` — reçoit les événements Stripe,
  vérifie leur signature, et synchronise `Subscription` en base
  (activation, renouvellement, échec de paiement, annulation).
- `apps/web/app/api/stripe/portal` — ouvre le Stripe Billing Portal
  (l'utilisateur peut changer sa carte ou résilier lui-même).

**Tant que les variables Stripe ne sont pas renseignées dans `.env`**,
l'app se rabat automatiquement sur `/api/subscription/upgrade` (bascule
Premium instantanée, sans paiement — pratique pour développer sans
compte Stripe). Dès que `STRIPE_SECRET_KEY` ET
`STRIPE_PRICE_ID_PREMIUM` sont renseignés, ce repli se désactive tout
seul (il renvoie une erreur invitant à utiliser le vrai Checkout) —
impossible d'obtenir Premium gratuitement une fois Stripe branché.

## Modèle FREE / PREMIUM

- `Subscription.plan` : `FREE` ou `PREMIUM`.
- `Subscription.status` : `ACTIVE`, `CANCELED`, `PAST_DUE`, `TRIALING`,
  `INCOMPLETE` — reflète l'état réel côté Stripe (mis à jour par le
  webhook, jamais deviné côté client).
- `Subscription.stripeCustomerId` / `stripeSubscriptionId` relient le
  compte SCOLYRA à Stripe.

## Procédure complète, étape par étape

### 1. Créer un compte Stripe et rester en mode Test

1. Va sur [dashboard.stripe.com/register](https://dashboard.stripe.com/register)
   et crée un compte (gratuit, aucune carte requise pour le mode Test).
2. Une fois connecté, vérifie en haut à droite du Dashboard que tu es
   bien en **mode Test** (bascule "Test mode" / "Sandbox") — reste en
   Test tant que tu développes. Ne jamais utiliser les clés "Live" en
   dehors d'un vrai déploiement en production.

### 2. Créer le produit et le prix Premium

1. Dans le Dashboard Stripe (mode Test) : **Product catalog → Add product**.
2. Nom : `SCOLYRA Premium` (ou ce que tu veux).
3. Ajoute un tarif récurrent, par exemple **6,90 € / mois** (cohérent
   avec `/pricing`), type "Recurring".
4. Enregistre, puis ouvre le produit créé : copie l'identifiant du
   **Price** (commence par `price_...`, PAS celui du Product qui
   commence par `prod_...`).
5. Colle-le dans `.env` :
   ```bash
   STRIPE_PRICE_ID_PREMIUM="price_..."
   ```

### 3. Récupérer les clés API

Dans le Dashboard : **Developers → API keys** (toujours en mode Test) :

```bash
# .env
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

⚠️ `STRIPE_SECRET_KEY` ne doit **jamais** être préfixée `NEXT_PUBLIC_`
(elle serait exposée au navigateur). Seule la clé publiable l'est.

### 4. Configurer le webhook en local (Stripe CLI)

Le webhook est indispensable : c'est lui qui dit à SCOLYRA "le paiement
a réussi, active Premium". Sans lui, Stripe encaisse mais SCOLYRA ne le
sait jamais.

1. Installe le [Stripe CLI](https://docs.stripe.com/stripe-cli#install) :
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe
   # Linux : voir https://github.com/stripe/stripe-cli/releases
   ```
2. Connecte-le à ton compte :
   ```bash
   stripe login
   ```
3. Lance le transfert des webhooks vers ton serveur local (à garder
   ouvert dans un terminal pendant que tu développes) :
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
4. La commande affiche un secret `whsec_...` — colle-le dans `.env` :
   ```bash
   STRIPE_WEBHOOK_SECRET="whsec_..."
   ```
5. Redémarre `pnpm dev` après avoir modifié `.env`.

### 5. Tester un paiement

1. Va sur `/parametres`, clique **"Passer en Premium — paiement
   sécurisé"**.
2. Tu es redirigé vers une vraie page Stripe Checkout. Utilise une
   [carte de test Stripe](https://docs.stripe.com/testing#cards), par
   exemple :
   - Numéro : `4242 4242 4242 4242`
   - Date : n'importe quelle date future
   - CVC : n'importe quel 3 chiffres
   - Code postal : n'importe lequel
3. Valide. Tu es redirigé vers `/parametres?checkout=success`, et dans
   le terminal `stripe listen`, tu dois voir l'événement
   `checkout.session.completed` transmis avec un `200`.
4. Vérifie en base (`pnpm db:studio` ou un client Postgres) que
   `Subscription.plan` est bien passé à `PREMIUM` pour ton compte.

### 6. Tester les autres scénarios utiles

- **Échec de paiement** : carte de test `4000 0000 0000 0341` (refusée
  après authentification).
- **Résiliation** : depuis `/parametres`, une fois Premium actif,
  clique "Gérer mon abonnement / résilier" → tu arrives sur le vrai
  Stripe Billing Portal → annule → l'événement
  `customer.subscription.deleted` repasse le compte en `FREE`.
- Le détail de chaque appel/événement reçu est aussi visible dans le
  Dashboard Stripe : **Developers → Events**.

### 7. Passer en production (plus tard)

1. Refais les étapes 1 à 4 en mode **Live** (clés `sk_live_...`,
   `pk_live_...`, un nouveau produit/prix en mode Live — les objets
   Test et Live sont totalement séparés chez Stripe).
2. Configure le webhook en Live directement dans le Dashboard
   (**Developers → Webhooks → Add endpoint**, URL =
   `https://ton-domaine.fr/api/stripe/webhook`, événements à cocher au
   minimum : `checkout.session.completed`,
   `customer.subscription.updated`, `customer.subscription.deleted`,
   `invoice.payment_failed`) — le Stripe CLI local n'est utile qu'en
   développement.
3. Relis [SECURITY.md](SECURITY.md) : ne jamais committer les clés
   Live, même par erreur.

## Règle mineurs (impérative, appliquée réellement)

Un compte `User.isMinor === true` ne peut **jamais** initier un
paiement Stripe (ni le bascule de démo) tant qu'un
`LegalGuardianLink` vérifié n'existe pas pour ce compte — vérifié
côté serveur dans `apps/web/lib/subscription-guard.ts`, appelé par
`/api/stripe/checkout` ET `/api/subscription/upgrade`. Voir
`/parametres` pour inviter un représentant légal (§ voir STATUS.md,
flux ajouté en V5).
