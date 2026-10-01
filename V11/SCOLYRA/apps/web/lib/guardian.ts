import crypto from "crypto";
import argon2 from "argon2";
import { prisma } from "@scolyra/db";
import { LEGAL } from "./legal";
import { sendEmail, guardianVerificationEmail } from "./email";

/**
 * Invitation d'un représentant légal — partagée entre l'inscription d'un
 * élève de moins de 15 ans et l'invitation depuis Paramètres.
 *
 * Minimisation : l'e-mail du représentant n'est JAMAIS recopié dans le
 * journal d'audit ; il n'existe que dans son compte « PARENT » minimal,
 * supprimé automatiquement s'il n'est pas validé (voir app/api/cron/purge).
 */
export async function createGuardianInvite(params: {
  studentId: string;
  studentFirstName: string;
  guardianEmail: string;
}): Promise<{ emailSent: boolean }> {
  const guardianEmail = params.guardianEmail.toLowerCase().trim();

  let guardian = await prisma.user.findUnique({ where: { email: guardianEmail } });
  if (!guardian) {
    // Mot de passe aléatoire non communiqué : ce compte ne sert qu'à porter le lien.
    const lockedPasswordHash = await argon2.hash(crypto.randomBytes(32).toString("hex"));
    guardian = await prisma.user.create({
      data: { email: guardianEmail, passwordHash: lockedPasswordHash, role: "PARENT", isMinor: false },
    });
  }

  const verificationToken = crypto.randomBytes(24).toString("hex");
  const tokenExpiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

  await prisma.legalGuardianLink.upsert({
    where: { guardianId_studentId: { guardianId: guardian.id, studentId: params.studentId } },
    update: { verificationToken, tokenExpiresAt, verified: false },
    create: { guardianId: guardian.id, studentId: params.studentId, verificationToken, tokenExpiresAt, verified: false },
  });

  const appUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const { subject, html, text } = guardianVerificationEmail({
    studentFirstName: params.studentFirstName,
    verifyUrl: `${appUrl}/verification-representant?token=${verificationToken}`,
  });
  const result = await sendEmail({ to: guardianEmail, subject, html, text });

  await prisma.auditLog.create({
    data: { userId: params.studentId, action: "GUARDIAN_INVITE_SENT", metadata: { emailMode: result.mode } },
  });
  return { emailSent: result.sent };
}

/**
 * Vrai si l'élève a été déclaré de moins de 15 ans et que l'accord de son
 * représentant légal n'est pas encore confirmé. L'historique des
 * consentements est en ajout seul : le plus récent fait foi.
 */
export async function isAwaitingGuardianApproval(userId: string): Promise<boolean> {
  const latest = await prisma.consent.findFirst({
    where: { userId, type: "LEGAL_GUARDIAN_APPROVAL" },
    orderBy: { createdAt: "desc" },
  });
  return latest ? latest.granted === false : false;
}

export async function recordGuardianApproval(studentId: string, granted: boolean) {
  await prisma.consent.create({
    data: { userId: studentId, type: "LEGAL_GUARDIAN_APPROVAL", granted, version: LEGAL.version },
  });
}
