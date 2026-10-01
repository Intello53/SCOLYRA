import { NextResponse } from "next/server";
import { prisma } from "@scolyra/db";
import { getCurrentUser } from "../../../../lib/session";
import { getStripe, isStripeConfigured } from "../../../../lib/stripe";

/**
 * Crée une session du Stripe Billing Portal, où l'utilisateur peut
 * lui-même mettre à jour sa carte, voir ses factures, ou annuler son
 * abonnement — sans que SCOLYRA ait à recoder cette UI.
 */
export async function POST() {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "Stripe n'est pas configuré côté serveur." }, { status: 503 });
  }

  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const subscription = await prisma.subscription.findUnique({ where: { userId: user.id } });
  if (!subscription?.stripeCustomerId) {
    return NextResponse.json({ error: "Aucun abonnement Stripe trouvé pour ce compte." }, { status: 404 });
  }

  const stripe = getStripe()!;
  const appUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const session = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${appUrl}/parametres`,
  });

  return NextResponse.json({ url: session.url });
}
