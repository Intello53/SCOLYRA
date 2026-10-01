import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@scolyra/db";
import { getCurrentUser } from "../../../../lib/session";

const patchSchema = z.object({ status: z.enum(["PLANNED", "IN_PROGRESS", "DONE", "SKIPPED"]) });

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const session = await prisma.revisionSession.findUnique({
    where: { id: params.id },
    include: { revisionPlan: true },
  });
  if (!session || session.revisionPlan.userId !== user.id) {
    return NextResponse.json({ error: "Introuvable." }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Données invalides." }, { status: 400 });

  const updated = await prisma.revisionSession.update({ where: { id: params.id }, data: { status: parsed.data.status } });
  return NextResponse.json({ session: updated });
}
