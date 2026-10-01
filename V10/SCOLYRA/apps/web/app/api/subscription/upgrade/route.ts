import { NextResponse } from "next/server";
import { prisma } from "@scolyra/db";
import { getCurrentUser } from "../../../../lib/session";
import { guardianBlocksUpgrade, GUARDIAN_REQUIRED_MESSAGE } from "../../../../lib/subscription-guard";
import { isStripeConfigured } from "../../../../lib/stripe";

/**
 * Passage FREE → PREMIUM SANS paiement — bascule de démonstration/test
 * uniquement. Dès que Stripe est configuré (STRIPE_SECRET_KEY +
 * STRIPE_PRICE_ID_PREMIUM), cette route se désactive d'elle-même et
 * renvoie une erreur pointant vers /api/stripe/checkout, pour qu'il ne
 * soit jamais possible de contourner un vrai paiement une fois Stripe
 * branché (voir docs/PAYMENTS.md).
 */
export async function POST() {
  if (isStripeConfigured()) {
    return NextResponse.json(
      { error: "Stripe est configuré — utilise le paiement réel (/api/stripe/checkout).", code: "USE_STRIPE_CHECKOUT" },
      { status: 409 }
    );
  }

  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  if (await guardianBlocksUpgrade(user.id)) {
    return NextResponse.json({ error: GUARDIAN_REQUIRED_MESSAGE, code: "GUARDIAN_REQUIRED" }, { status: 403 });
  }

  const subscription = await prisma.subscription.upsert({
    where: { userId: user.id },
    update: { plan: "PREMIUM", status: "ACTIVE" },
    create: { userId: user.id, plan: "PREMIUM", status: "ACTIVE" },
  });

  await prisma.auditLog.create({ data: { userId: user.id, action: "SUBSCRIPTION_UPGRADED_PREMIUM_DEMO" } });

  return NextResponse.json({ subscription });
}
