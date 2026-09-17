import { NextResponse } from "next/server";
import { prisma } from "@scolyra/db";
import { getCurrentUser } from "../../../../lib/session";

/**
 * Passage FREE → PREMIUM. AUCUN paiement réel n'est traité ici (pas de
 * Stripe branché en V0, voir docs/PAYMENTS.md) : c'est un bascule
 * instantané à but de démonstration/test, mais la règle métier sur les
 * mineurs, elle, est réellement appliquée — un compte isMinor=true est
 * bloqué tant qu'aucun LegalGuardianLink vérifié n'existe (§25).
 */
export async function POST() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!dbUser) return NextResponse.json({ error: "Introuvable." }, { status: 404 });

  if (dbUser.isMinor) {
    const verifiedGuardian = await prisma.legalGuardianLink.findFirst({
      where: { studentId: user.id, verified: true },
    });
    if (!verifiedGuardian) {
      return NextResponse.json(
        {
          error:
            "Ce compte est mineur : un représentant légal vérifié est requis avant tout abonnement payant.",
          code: "GUARDIAN_REQUIRED",
        },
        { status: 403 }
      );
    }
  }

  const subscription = await prisma.subscription.upsert({
    where: { userId: user.id },
    update: { plan: "PREMIUM", status: "ACTIVE" },
    create: { userId: user.id, plan: "PREMIUM", status: "ACTIVE" },
  });

  return NextResponse.json({ subscription });
}
