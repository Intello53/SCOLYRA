import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@scolyra/db";
import { getCurrentUser } from "../../../../lib/session";

const patchSchema = z.object({
  milestones: z.array(z.object({ label: z.string(), done: z.boolean() })).optional(),
  status: z.enum(["ACTIVE", "ACHIEVED", "ABANDONED", "EXPIRED"]).optional(),
  currentValue: z.number().min(0).max(20).optional(),
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const goal = await prisma.goal.findUnique({ where: { id: params.id } });
  if (!goal || goal.userId !== user.id) {
    return NextResponse.json({ error: "Introuvable." }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Données invalides." }, { status: 400 });

  const updated = await prisma.goal.update({
    where: { id: params.id },
    data: parsed.data,
  });
  return NextResponse.json({ goal: updated });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const goal = await prisma.goal.findUnique({ where: { id: params.id } });
  if (!goal || goal.userId !== user.id) {
    return NextResponse.json({ error: "Introuvable." }, { status: 404 });
  }
  await prisma.goal.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
