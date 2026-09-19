import Stripe from "stripe";

/**
 * getStripe() renvoie null si STRIPE_SECRET_KEY n'est pas configuré,
 * plutôt que de planter au démarrage — cohérent avec l'engagement du
 * projet ("l'app doit rester testable sans clé Stripe", §45). Chaque
 * route appelante doit gérer explicitement le cas null (voir
 * apps/web/app/api/stripe/*).
 */
let stripe: Stripe | null | undefined;

export function getStripe(): Stripe | null {
  if (stripe !== undefined) return stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    stripe = null;
    return null;
  }
  stripe = new Stripe(key, { apiVersion: "2024-11-20.acacia" });
  return stripe;
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_ID_PREMIUM);
}
