import { NextResponse } from "next/server";
import { prisma } from "@scolyra/db";
import { getCurrentUser } from "../../../../lib/session";

/**
 * Export complet des données de l'utilisateur connecté, au format
 * JSON — droit à la portabilité (RGPD art. 20). Ne renvoie QUE les
 * données de l'utilisateur qui fait la demande (isolation stricte,
 * jamais un ID transmis par le client).
 */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const [
    account,
    profile,
    studentProfile,
    grades,
    goals,
    studySessions,
    documents,
    projects,
    orientationProfile,
    applications,
    subscription,
    consents,
  ] = await Promise.all([
    prisma.user.findUnique({ where: { id: user.id }, select: { email: true, isMinor: true, createdAt: true } }),
    prisma.profile.findUnique({ where: { userId: user.id } }),
    prisma.studentProfile.findUnique({ where: { userId: user.id }, include: { subjects: { include: { subject: true } } } }),
    prisma.grade.findMany({ where: { userId: user.id } }),
    prisma.goal.findMany({ where: { userId: user.id } }),
    prisma.studySession.findMany({ where: { userId: user.id } }),
    prisma.document.findMany({ where: { userId: user.id } }),
    prisma.project.findMany({ where: { userId: user.id }, include: { tasks: true } }),
    prisma.orientationProfile.findUnique({ where: { userId: user.id } }),
    prisma.application.findMany({ where: { userId: user.id }, include: { formation: true } }),
    prisma.subscription.findUnique({ where: { userId: user.id } }),
    prisma.consent.findMany({ where: { userId: user.id } }),
  ]);

  await prisma.auditLog.create({ data: { userId: user.id, action: "DATA_EXPORT_REQUESTED" } });

  const payload = {
    exportedAt: new Date().toISOString(),
    account,
    profile,
    studentProfile,
    grades,
    goals,
    studySessions,
    documents,
    projects,
    orientationProfile,
    applications,
    subscription,
    consents,
  };

  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="scolyra-export-${user.id}.json"`,
    },
  });
}
