import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@scolyra/db";
import { getCurrentUser } from "../../../../lib/session";

const patchSchema = z.object({ includeInAverage: z.boolean() });

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Données invalides." }, { status: 400 });

  const userSubject = await prisma.userSubject.findUnique({
    where: { id: params.id },
    include: { studentProfile: true },
  });
  if (!userSubject || userSubject.studentProfile.userId !== user.id) {
    return NextResponse.json({ error: "Introuvable." }, { status: 404 });
  }

  const updated = await prisma.userSubject.update({
    where: { id: params.id },
    data: { includeInAverage: parsed.data.includeInAverage },
  });

  return NextResponse.json({ userSubject: updated });
}
