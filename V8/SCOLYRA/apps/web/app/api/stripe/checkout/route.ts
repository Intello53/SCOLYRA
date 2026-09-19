import { NextResponse } from "next/server";
import { prisma } from "@scolyra/db";
import { getCurrentUser } from "../../../../lib/session";
import { getStripe, isStripeConfigured } from "../../../../lib/stripe";
import { guardianBlocksUpgrade, GUARDIAN_REQUIRED_MESSAGE } from "../../../../lib/subscription-guard";

/**
 * Crée une vraie session Stripe Checkout et renvoie son URL. Le
 * client redirige le navigateur dessus (window.location.href = url) —
 * c'est Stripe qui héberge le formulaire de paiement, SCOLYRA ne voit
 * jamais le numéro de carte.
 */
export async function POST() {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Stripe n'est pas configuré côté serveur (voir docs/PAYMENTS.md)." },
      { status: 503 }
    );
  }

  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  if (await guardianBlocksUpgrade(user.id)) {
    return NextResponse.json({ error: GUARDIAN_REQUIRED_MESSAGE, code: "GUARDIAN_REQUIRED" }, { status: 403 });
  }

  const stripe = getStripe()!;
  const dbUser = await prisma.user.findUnique({ where: { id: user.id }, include: { subscription: true } });
  if (!dbUser) return NextResponse.json({ error: "Introuvable." }, { status: 404 });

  // Réutilise le Customer Stripe existant si ce compte en a déjà un
  // (évite de créer un doublon à chaque tentative de paiement).
  let customerId = dbUser.subscription?.stripeCustomerId ?? undefined;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: dbUser.email,
      metadata: { scolyraUserId: dbUser.id },
    });
    customerId = customer.id;
    await prisma.subscription.upsert({
      where: { userId: user.id },
      update: { stripeCustomerId: customerId },
      create: { userId: user.id, stripeCustomerId: customerId, plan: "FREE", status: "INCOMPLETE" },
    });
  }

  const appUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: process.env.STRIPE_PRICE_ID_PREMIUM!, quantity: 1 }],
    success_url: `${appUrl}/parametres?checkout=success`,
    cancel_url: `${appUrl}/parametres?checkout=cancelled`,
    metadata: { scolyraUserId: user.id },
    subscription_data: { metadata: { scolyraUserId: user.id } },
  });

  await prisma.auditLog.create({ data: { userId: user.id, action: "STRIPE_CHECKOUT_CREATED" } });

  return NextResponse.json({ url: session.url });
}
