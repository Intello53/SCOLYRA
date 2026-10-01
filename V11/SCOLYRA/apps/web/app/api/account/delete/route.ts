import { NextResponse } from "next/server";
import { prisma } from "@scolyra/db";
import { getCurrentUser } from "../../../../lib/session";
import { getStripe } from "../../../../lib/stripe";

/**
 * Suppression réelle du compte (droit à l'effacement, RGPD art. 17).
 *
 * Ordre important :
 *  1. résilier l'abonnement Stripe (sinon la personne continuerait d'être
 *     prélevée alors que son compte n'existe plus) ;
 *  2. supprimer l'utilisateur — la quasi-totalité de ses données part en
 *     cascade (onDelete: Cascade) ; l'entrée d'audit devient anonyme
 *     (userId → null) ;
 *  3. supprimer les comptes « représentant légal » devenus orphelins.
 *
 * Les factures restent chez Stripe (obligation comptable de 10 ans) : le
 * client Stripe n'est volontairement PAS supprimé.
 */
export async function DELETE() {
  const user = await getCurrentUser({ allowPendingGuardian: true });
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const subscription = await prisma.subscription.findUnique({ where: { userId: user.id } });
  if (subscription?.stripeSubscriptionId) {
    const stripe = getStripe();
    if (!stripe) {
      console.error("[account:delete] Abonnement Stripe présent mais Stripe non configuré — suppression refusée.");
      return NextResponse.json(
        { error: "Le service de paiement est indisponible : ton abonnement n'a pas pu être résilié. Réessaie plus tard ou contacte l'assistance." },
        { status: 503 }
      );
    }
    try {
      await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
    } catch (err) {
      const code = (err as { code?: string }).code;
      if (code !== "resource_missing") {
        console.error("[account:delete] Échec de la résiliation Stripe :", err);
        return NextResponse.json(
          { error: "Impossible de résilier ton abonnement pour l'instant : le compte n'a pas été supprimé. Réessaie plus tard." },
          { status: 502 }
        );
      }
      // resource_missing = déjà résilié côté Stripe : on continue.
    }
  }

  const guardianIds = (
    await prisma.legalGuardianLink.findMany({ where: { studentId: user.id }, select: { guardianId: true } })
  ).map((l) => l.guardianId);

  await prisma.auditLog.create({ data: { userId: user.id, action: "ACCOUNT_DELETION_REQUESTED" } });
  await prisma.user.delete({ where: { id: user.id } });

  // Comptes « PARENT » créés uniquement pour porter ce lien : on ne garde pas l'e-mail d'un tiers.
  for (const guardianId of guardianIds) {
    const remaining = await prisma.legalGuardianLink.count({ where: { guardianId } });
    if (remaining === 0) {
      await prisma.user.deleteMany({ where: { id: guardianId, role: "PARENT" } });
    }
  }

  return NextResponse.json({ ok: true });
}
