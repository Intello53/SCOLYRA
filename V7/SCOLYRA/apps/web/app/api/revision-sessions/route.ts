import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@scolyra/db";
import { getCurrentUser } from "../../../lib/session";

const createSchema = z.object({
  skill: z.string().min(1).max(200),
  subjectId: z.string().optional(),
  priority: z.number().int().min(1).max(5).default(3),
});

/**
 * Pas de sélection de plan explicite en V0 : chaque élève a un plan de
 * révision "courant" unique, créé automatiquement au premier ajout de
 * session. Simplifie l'UI (pas de gestion de plans multiples à ce
 * stade) tout en restant un vrai enregistrement en base.
 */
async function getOrCreateCurrentPlan(userId: string) {
  const existing = await prisma.revisionPlan.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } });
  if (existing) return existing;
  const now = new Date();
  const inThreeMonths = new Date(now.getTime() + 90 * 86_400_000);
  return prisma.revisionPlan.create({
    data: { userId, title: "Mon plan de révision", startDate: now, endDate: inThreeMonths },
  });
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const sessions = await prisma.revisionSession.findMany({
    where: { revisionPlan: { userId: user.id } },
    include: { subject: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ sessions });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Données invalides." }, { status: 400 });

  const plan = await getOrCreateCurrentPlan(user.id);
  const session = await prisma.revisionSession.create({
    data: {
      revisionPlanId: plan.id,
      subjectId: parsed.data.subjectId || null,
      title: parsed.data.skill,
      priority: parsed.data.priority,
      status: "PLANNED",
    },
    include: { subject: true },
  });

  return NextResponse.json({ session });
}
