# Paiements (Stripe)

## Modèle FREE / PREMIUM

- `Subscription.plan` : `FREE` ou `PREMIUM`.
- `Subscription.status` : `ACTIVE`, `CANCELED`, `PAST_DUE`, `TRIALING`,
  `INCOMPLETE`.
- `Payment` trace chaque paiement individuel (`stripePaymentId`,
  `amountCents`, `currency`, `status`).

## État V0

⚠️ **Non implémenté dans cette génération** : les routes Stripe
Checkout, le Billing Portal, et le handler de webhooks ne sont pas
encore créés dans `apps/web`. Seul le modèle de données est prêt. C'est
une fonctionnalité de la V0/MVP à compléter (voir ROADMAP.md).

## Architecture cible

```
apps/web/app/api/stripe/checkout/route.ts   → crée une session Checkout
apps/web/app/api/stripe/webhook/route.ts    → vérifie la signature,
                                                met à jour Subscription
apps/web/app/api/stripe/portal/route.ts     → crée une session Billing Portal
```

Toute vérification d'abonnement (accès à une fonctionnalité PREMIUM)
doit être faite **côté serveur**, jamais uniquement côté client.

## Règle mineurs (impératif, §25)

Un compte `User.isMinor === true` ne doit **jamais** pouvoir initier un
paiement Stripe directement tant qu'un `LegalGuardianLink` vérifié
(`verified: true`) n'existe pas pour ce compte. Cette vérification doit
être ajoutée dans la route de création de session Checkout dès son
implémentation.

## Développement

- Utiliser exclusivement les clés Stripe **TEST**
  (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`,
  `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` commençant par `sk_test_`,
  `whsec_...`, `pk_test_...`).
- Aucun paiement réel ne doit être possible en développement.
- Tester les webhooks avec `stripe listen --forward-to
  localhost:3000/api/stripe/webhook` (Stripe CLI — installation non
  couverte ici, voir documentation officielle Stripe).
