import { NextResponse } from "next/server";
import { prisma } from "@scolyra/db";
import { getStripe } from "../../../../lib/stripe";
import type Stripe from "stripe";

/**
 * Route PUBLIQUE (appelée par les serveurs de Stripe, pas par un
 * navigateur) : la sécurité repose entièrement sur la vérification de
 * signature ci-dessous (STRIPE_WEBHOOK_SECRET), jamais sur une
 * session. Ne JAMAIS faire confiance au contenu tant que la signature
 * n'est pas validée — c'est ce qui empêche n'importe qui d'appeler
 * cette route pour s'auto-attribuer Premium.
 *
 * Next.js App Router : on lit le corps en texte brut (req.text()),
 * jamais req.json(), car Stripe signe les octets exacts envoyés — un
 * corps re-sérialisé casserait la vérification de signature.
 */
export async function POST(req: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Stripe non configuré." }, { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Signature manquante." }, { status: 400 });
  }

  const rawBody = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("[stripe:webhook] Signature invalide :", err);
    return NextResponse.json({ error: "Signature invalide." }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.scolyraUserId;
      if (userId && session.customer && session.subscription) {
        await prisma.subscription.upsert({
          where: { userId },
          update: {
            plan: "PREMIUM",
            status: "ACTIVE",
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: session.subscription as string,
          },
          create: {
            userId,
            plan: "PREMIUM",
            status: "ACTIVE",
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: session.subscription as string,
          },
        });
        await prisma.auditLog.create({ data: { userId, action: "STRIPE_SUBSCRIPTION_ACTIVATED" } });
      }
      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const userId = sub.metadata?.scolyraUserId;
      const statusMap: Record<string, "ACTIVE" | "CANCELED" | "PAST_DUE" | "TRIALING" | "INCOMPLETE"> = {
        active: "ACTIVE",
        trialing: "TRIALING",
        past_due: "PAST_DUE",
        canceled: "CANCELED",
        incomplete: "INCOMPLETE",
        incomplete_expired: "CANCELED",
        unpaid: "PAST_DUE",
      };
      if (userId) {
        await prisma.subscription.updateMany({
          where: { userId },
          data: {
            status: statusMap[sub.status] ?? "ACTIVE",
            plan: sub.status === "active" || sub.status === "trialing" ? "PREMIUM" : "FREE",
            currentPeriodEnd: new Date(sub.current_period_end * 1000),
          },
        });
        await prisma.auditLog.create({
          data: { userId, action: "STRIPE_SUBSCRIPTION_UPDATED", metadata: { status: sub.status } },
        });
      }
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const userId = sub.metadata?.scolyraUserId;
      if (userId) {
        await prisma.subscription.updateMany({
          where: { userId },
          data: { plan: "FREE", status: "CANCELED" },
        });
        await prisma.auditLog.create({ data: { userId, action: "STRIPE_SUBSCRIPTION_CANCELLED" } });
      }
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;
      if (customerId) {
        const subscription = await prisma.subscription.findFirst({ where: { stripeCustomerId: customerId } });
        if (subscription) {
          await prisma.subscription.update({ where: { id: subscription.id }, data: { status: "PAST_DUE" } });
          await prisma.auditLog.create({
            data: { userId: subscription.userId, action: "STRIPE_PAYMENT_FAILED" },
          });
        }
      }
      break;
    }

    default:
      // Événements non gérés explicitement — on les ignore sans erreur.
      break;
  }

  return NextResponse.json({ received: true });
}
