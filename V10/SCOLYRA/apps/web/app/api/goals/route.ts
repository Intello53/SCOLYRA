import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@scolyra/db";
import { getCurrentUser } from "../../../lib/session";

const goalSchema = z.object({
  title: z.string().min(1).max(160),
  subjectId: z.string().optional(),
  targetValue: z.number().min(0).max(20).optional(),
  currentValue: z.number().min(0).max(20).optional(),
  deadline: z.string().optional(), // ISO date string
  milestones: z.array(z.object({ label: z.string(), done: z.boolean() })).default([]),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const goals = await prisma.goal.findMany({
    where: { userId: user.id, status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ goals });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = goalSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides.", details: parsed.error.flatten() }, { status: 400 });
  }

  const goal = await prisma.goal.create({
    data: {
      userId: user.id,
      title: parsed.data.title,
      subjectId: parsed.data.subjectId || null,
      targetValue: parsed.data.targetValue,
      currentValue: parsed.data.currentValue,
      deadline: parsed.data.deadline ? new Date(parsed.data.deadline) : null,
      milestones: parsed.data.milestones,
    },
  });
  return NextResponse.json({ goal });
}
