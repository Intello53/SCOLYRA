import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@scolyra/db";
import { getCurrentUser } from "../../../../lib/session";
import { checkRateLimit } from "../../../../lib/rate-limit";
import { createGuardianInvite } from "../../../../lib/guardian";

const inviteSchema = z.object({ guardianEmail: z.string().email().max(254) });

export async function POST(req: Request) {
  // allowPendingGuardian : un élève de moins de 15 ans en attente d'accord doit pouvoir (ré)inviter son représentant.
  const user = await getCurrentUser({ allowPendingGuardian: true });
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const rl = await checkRateLimit(`guardian-invite:${user.id}`, 5, 60 * 60);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Trop de demandes. Réessaie plus tard." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = inviteSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Email invalide." }, { status: 400 });

  const student = await prisma.user.findUnique({ where: { id: user.id }, include: { profile: true } });
  if (!student) return NextResponse.json({ error: "Introuvable." }, { status: 404 });

  const guardianEmail = parsed.data.guardianEmail.toLowerCase().trim();
  if (guardianEmail === student.email) {
    return NextResponse.json({ error: "Le représentant légal doit avoir un email différent du tien." }, { status: 400 });
  }

  const { emailSent } = await createGuardianInvite({
    studentId: user.id,
    studentFirstName: student.profile?.firstName ?? "Un élève",
    guardianEmail,
  });

  // emailSent=false en dev sans Resend : l'e-mail est seulement loggé dans la console du serveur.
  return NextResponse.json({ ok: true, emailSent });
}
