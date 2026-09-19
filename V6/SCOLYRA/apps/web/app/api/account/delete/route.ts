import { NextResponse } from "next/server";
import { prisma } from "@scolyra/db";
import { getCurrentUser } from "../../../../lib/session";

/**
 * Suppression réelle du compte (droit à l'effacement, RGPD art. 17).
 * La suppression du User entraîne la suppression en cascade de la
 * quasi-totalité de ses données (voir onDelete: Cascade dans le schéma
 * Prisma) ; cette entrée d'audit devient anonyme après coup
 * (AuditLog.userId passe à null via onDelete: SetNull), ce qui
 * préserve une trace sans donnée personnelle résiduelle.
 */
export async function DELETE() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  await prisma.auditLog.create({ data: { userId: user.id, action: "ACCOUNT_DELETION_REQUESTED" } });
  await prisma.user.delete({ where: { id: user.id } });

  return NextResponse.json({ ok: true });
}
