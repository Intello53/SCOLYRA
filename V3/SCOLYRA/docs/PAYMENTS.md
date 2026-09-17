# Paiements (Stripe)

## Modèle FREE / PREMIUM

- `Subscription.plan` : `FREE` ou `PREMIUM`.
- `Subscription.status` : `ACTIVE`, `CANCELED`, `PAST_DUE`, `TRIALING`,
  `INCOMPLETE`.
- `Payment` trace chaque paiement individuel (`stripePaymentId`,
  `amountCents`, `currency`, `status`).

## État V3

⚠️ **Stripe lui-même reste non implémenté** : les routes Checkout,
Billing Portal et le handler de webhooks n'existent pas encore.

Ce qui existe depuis la V3 : `apps/web/app/api/subscription/upgrade`
bascule réellement `Subscription.plan` de FREE à PREMIUM en base — mais
c'est un **bascule instantané de démonstration, pas un paiement**. La
règle métier sur les mineurs, elle, est réellement appliquée : un
compte `isMinor=true` sans `LegalGuardianLink` vérifié est bloqué avec
un message explicite (`code: "GUARDIAN_REQUIRED"`).

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
