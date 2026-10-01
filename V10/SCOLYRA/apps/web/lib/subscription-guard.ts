import { prisma } from "@scolyra/db";

/**
 * Règle métier partagée entre le bascule de démo
 * (/api/subscription/upgrade) et le vrai paiement Stripe
 * (/api/stripe/checkout) : un compte mineur ne doit jamais pouvoir
 * initier un paiement sans représentant légal vérifié (§25).
 */
export async function guardianBlocksUpgrade(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user?.isMinor) return false;

  const verifiedGuardian = await prisma.legalGuardianLink.findFirst({
    where: { studentId: userId, verified: true },
  });
  return !verifiedGuardian;
}

export const GUARDIAN_REQUIRED_MESSAGE =
  "Ce compte est mineur : un représentant légal vérifié est requis avant tout abonnement payant.";
