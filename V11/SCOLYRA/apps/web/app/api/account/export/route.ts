import { NextResponse } from "next/server";
import { prisma } from "@scolyra/db";
import { getCurrentUser } from "../../../../lib/session";

/**
 * Export complet des données de l'utilisateur connecté, au format JSON
 * structuré et lisible par machine — droits d'accès et de portabilité
 * (RGPD art. 15 et 20). Ne renvoie QUE les données de l'utilisateur qui
 * fait la demande (jamais un ID transmis par le client).
 *
 * Exclus volontairement : le hash du mot de passe, les jetons de
 * vérification, et les données d'un tiers (l'e-mail du représentant légal
 * est fourni, pas son compte).
 */
export async function GET() {
  const user = await getCurrentUser({ allowPendingGuardian: true });
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  const userId = user.id;

  const [
    account, profile, studentProfile, grades, assessments, mistakes, goals, studySessions,
    documents, courses, revisionPlans, projects, orientationProfile, applications, deadlines,
    notifications, subscription, payments, consents, supportTickets, aiConversations, aiUsage,
    auditLogs, guardianLinks, customSubjects,
  ] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { email: true, role: true, isMinor: true, emailVerified: true, lastLoginAt: true, createdAt: true } }),
    prisma.profile.findUnique({ where: { userId } }),
    prisma.studentProfile.findUnique({ where: { userId }, include: { subjects: { include: { subject: true } }, skills: { include: { skill: true } } } }),
    prisma.grade.findMany({ where: { userId }, include: { subject: { select: { name: true } } } }),
    prisma.assessment.findMany({ where: { userId } }),
    prisma.mistake.findMany({ where: { userId } }),
    prisma.goal.findMany({ where: { userId } }),
    prisma.studySession.findMany({ where: { userId } }),
    prisma.document.findMany({ where: { userId }, select: { id: true, title: true, type: true, status: true, mimeType: true, sizeBytes: true, createdAt: true } }),
    prisma.course.findMany({ where: { userId } }),
    prisma.revisionPlan.findMany({ where: { userId }, include: { sessions: true } }),
    prisma.project.findMany({ where: { userId }, include: { tasks: true } }),
    prisma.orientationProfile.findUnique({ where: { userId } }),
    prisma.application.findMany({ where: { userId }, include: { formation: true } }),
    prisma.deadline.findMany({ where: { userId } }),
    prisma.notification.findMany({ where: { userId } }),
    prisma.subscription.findUnique({ where: { userId }, select: { plan: true, status: true, currentPeriodEnd: true, createdAt: true } }),
    prisma.payment.findMany({ where: { userId }, select: { amountCents: true, currency: true, status: true, createdAt: true } }),
    prisma.consent.findMany({ where: { userId } }),
    prisma.supportTicket.findMany({ where: { userId }, include: { messages: true } }),
    prisma.aIConversation.findMany({ where: { userId }, include: { messages: true } }),
    prisma.aIUsage.findMany({ where: { userId } }),
    prisma.auditLog.findMany({ where: { userId }, select: { action: true, ip: true, createdAt: true } }),
    prisma.legalGuardianLink.findMany({ where: { studentId: userId }, select: { verified: true, createdAt: true, guardian: { select: { email: true } } } }),
    prisma.subject.findMany({ where: { createdById: userId } }),
  ]);

  await prisma.auditLog.create({ data: { userId, action: "DATA_EXPORT_REQUESTED" } });

  const payload = {
    exportedAt: new Date().toISOString(),
    format: "SCOLYRA export v2 (RGPD art. 15 & 20)",
    account, profile, studentProfile, grades, assessments, mistakes, goals, studySessions,
    documents, courses, revisionPlans, projects, orientationProfile, applications, deadlines,
    notifications, subscription, payments, consents, supportTickets, aiConversations, aiUsage,
    securityLog: auditLogs, guardianLinks, customSubjects,
  };

  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="scolyra-export-${userId}.json"`,
      // Données personnelles : jamais mises en cache par un proxy ou le navigateur.
      "Cache-Control": "no-store",
    },
  });
}
