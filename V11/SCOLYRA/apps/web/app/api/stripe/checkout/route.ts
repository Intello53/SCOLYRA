import { NextResponse } from "next/server";
import { prisma } from "@scolyra/db";
import { getCurrentUser } from "../../../../lib/session";
import { getStripe, isStripeConfigured } from "../../../../lib/stripe";
import { z } from "zod";
import { LEGAL } from "../../../../lib/legal";
import { guardianBlocksUpgrade, GUARDIAN_REQUIRED_MESSAGE } from "../../../../lib/subscription-guard";

/**
 * Crée une vraie session Stripe Checkout et renvoie son URL. Le
 * client redirige le navigateur dessus (window.location.href = url) —
 * c'est Stripe qui héberge le formulaire de paiement, SCOLYRA ne voit
 * jamais le numéro de carte.
 */
const bodySchema = z.object({
  acceptedCgv: z.literal(true),
  // Demande expresse d'exécution immédiate (art. L221-25) : requise si l'accès est immédiat.
  immediateAccess: z.boolean().default(false),
});

export async function POST(req: Request) {
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

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success || (LEGAL.premium.immediateAccess && !parsed.data.immediateAccess)) {
    return NextResponse.json(
      { error: "Tu dois accepter les CGV et confirmer ta demande d'accès immédiat avant de payer.", code: "CONSENT_REQUIRED" },
      { status: 400 }
    );
  }

  // Preuve des acceptations (horodatées, versionnées).
  await prisma.consent.createMany({
    data: [
      { userId: user.id, type: "CGV_ACCEPTANCE", granted: true, version: LEGAL.version },
      ...(parsed.data.immediateAccess
        ? [{ userId: user.id, type: "IMMEDIATE_ACCESS_REQUEST" as const, granted: true, version: LEGAL.version }]
        : []),
    ],
  });

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
    locale: "fr",
    customer: customerId,
    line_items: [{ price: process.env.STRIPE_PRICE_ID_PREMIUM!, quantity: 1 }],
    success_url: `${appUrl}/parametres?checkout=success`,
    cancel_url: `${appUrl}/parametres?checkout=cancelled`,
    // Mentions de la page de paiement : obligation de paiement (Code conso L221-14) et renvoi aux CGV.
    custom_text: {
      submit: {
        message: `En validant, tu t'engages à payer ${LEGAL.premium.priceTtcEuros} € TTC par ${LEGAL.premium.period}, renouvelé tacitement jusqu'à résiliation en ligne (Paramètres).`,
      },
    },
    metadata: { scolyraUserId: user.id },
    subscription_data: { metadata: { scolyraUserId: user.id } },
  });

  await prisma.auditLog.create({ data: { userId: user.id, action: "STRIPE_CHECKOUT_CREATED" } });

  return NextResponse.json({ url: session.url });
}
