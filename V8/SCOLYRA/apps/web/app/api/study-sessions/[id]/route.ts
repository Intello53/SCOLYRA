import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@scolyra/db";
import { getCurrentUser } from "../../../../lib/session";

const patchSchema = z.object({ completed: z.boolean() });

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const studySession = await prisma.studySession.findUnique({ where: { id: params.id } });
  if (!studySession || studySession.userId !== user.id) {
    return NextResponse.json({ error: "Introuvable." }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Données invalides." }, { status: 400 });

  const updated = await prisma.studySession.update({
    where: { id: params.id },
    data: { completed: parsed.data.completed },
  });
  return NextResponse.json({ session: updated });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const studySession = await prisma.studySession.findUnique({ where: { id: params.id } });
  if (!studySession || studySession.userId !== user.id) {
    return NextResponse.json({ error: "Introuvable." }, { status: 404 });
  }
  await prisma.studySession.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
