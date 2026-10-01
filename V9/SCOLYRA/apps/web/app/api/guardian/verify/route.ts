import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@scolyra/db";
import { checkRateLimit } from "../../../../lib/rate-limit";

const verifySchema = z.object({ token: z.string().min(10) });

/**
 * Route PUBLIQUE (pas de session requise) : c'est le représentant
 * légal qui clique sur le lien reçu par email, il n'a pas forcément de
 * session SCOLYRA active. La sécurité repose sur le token aléatoire
 * (48h de validité) + un rate limit pour dissuader le brute-force.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = verifySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Requête invalide." }, { status: 400 });

  const rl = await checkRateLimit(`guardian-verify:${parsed.data.token.slice(0, 8)}`, 10, 15 * 60);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Trop de tentatives. Réessaie plus tard." }, { status: 429 });
  }

  const link = await prisma.legalGuardianLink.findUnique({
    where: { verificationToken: parsed.data.token },
    include: { student: { include: { profile: true } } },
  });

  if (!link || !link.tokenExpiresAt || link.tokenExpiresAt < new Date()) {
    return NextResponse.json({ error: "Lien invalide ou expiré. Redemande une invitation." }, { status: 400 });
  }

  await prisma.legalGuardianLink.update({
    where: { id: link.id },
    data: { verified: true, verificationToken: null, tokenExpiresAt: null },
  });

  await prisma.auditLog.create({
    data: { userId: link.studentId, action: "GUARDIAN_VERIFIED" },
  });

  return NextResponse.json({ ok: true, studentFirstName: link.student.profile?.firstName ?? "l'élève" });
}
