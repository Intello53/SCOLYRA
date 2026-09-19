import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import argon2 from "argon2";
import { prisma } from "@scolyra/db";
import { getCurrentUser } from "../../../../lib/session";
import { checkRateLimit } from "../../../../lib/rate-limit";
import { sendEmail, guardianVerificationEmail } from "../../../../lib/email";

const inviteSchema = z.object({ guardianEmail: z.string().email() });

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const rl = await checkRateLimit(`guardian-invite:${user.id}`, 5, 60 * 60);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Trop de demandes. Réessaie plus tard." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = inviteSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Email invalide." }, { status: 400 });

  const guardianEmail = parsed.data.guardianEmail.toLowerCase().trim();
  const student = await prisma.user.findUnique({ where: { id: user.id }, include: { profile: true } });
  if (!student) return NextResponse.json({ error: "Introuvable." }, { status: 404 });

  if (guardianEmail === student.email) {
    return NextResponse.json({ error: "Le représentant légal doit avoir un email différent du tien." }, { status: 400 });
  }

  // Le représentant légal n'a pas forcément de compte SCOLYRA : on en
  // crée un minimal (rôle PARENT) s'il n'existe pas encore. Le mot de
  // passe aléatoire n'est communiqué à personne — ce compte sert
  // uniquement à porter la relation LegalGuardianLink pour l'instant.
  let guardian = await prisma.user.findUnique({ where: { email: guardianEmail } });
  if (!guardian) {
    const lockedPasswordHash = await argon2.hash(crypto.randomBytes(32).toString("hex"));
    guardian = await prisma.user.create({
      data: { email: guardianEmail, passwordHash: lockedPasswordHash, role: "PARENT", isMinor: false },
    });
  }

  const verificationToken = crypto.randomBytes(24).toString("hex");
  const tokenExpiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

  await prisma.legalGuardianLink.upsert({
    where: { guardianId_studentId: { guardianId: guardian.id, studentId: user.id } },
    update: { verificationToken, tokenExpiresAt, verified: false },
    create: { guardianId: guardian.id, studentId: user.id, verificationToken, tokenExpiresAt, verified: false },
  });

  const appUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const verifyUrl = `${appUrl}/verification-representant?token=${verificationToken}`;
  const { subject, html, text } = guardianVerificationEmail({
    studentFirstName: student.profile?.firstName ?? "Un élève",
    verifyUrl,
  });
  const emailResult = await sendEmail({ to: guardianEmail, subject, html, text });

  await prisma.auditLog.create({
    data: { userId: user.id, action: "GUARDIAN_INVITE_SENT", metadata: { guardianEmail, emailMode: emailResult.mode } },
  });

  return NextResponse.json({
    ok: true,
    // En mode dev sans Resend, l'email est seulement loggé en console
    // (voir lib/email.ts) — on le signale pour ne pas laisser croire
    // qu'un vrai email a été envoyé.
    emailSent: emailResult.sent,
  });
}
