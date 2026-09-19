import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@scolyra/db";
import { getCurrentUser } from "../../../../lib/session";

const patchSchema = z.object({ status: z.enum(["TODO", "IN_PROGRESS", "DONE"]) });

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const task = await prisma.projectTask.findUnique({ where: { id: params.id }, include: { project: true } });
  if (!task || task.project.userId !== user.id) {
    return NextResponse.json({ error: "Introuvable." }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Données invalides." }, { status: 400 });

  const updated = await prisma.projectTask.update({ where: { id: params.id }, data: { status: parsed.data.status } });
  return NextResponse.json({ task: updated });
}
