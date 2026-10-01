import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@scolyra/db";
import { getCurrentUser } from "../../../lib/session";

const gradeSchema = z.object({
  subjectId: z.string().min(1),
  value: z.number().min(0).max(20),
  maxValue: z.number().min(1).max(20).default(20),
  coefficient: z.number().min(0.1).max(20).default(1),
  label: z.string().max(160).optional(),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const grades = await prisma.grade.findMany({
    where: { userId: user.id },
    include: { subject: true },
    orderBy: { date: "desc" },
  });
  return NextResponse.json({ grades });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = gradeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides.", details: parsed.error.flatten() }, { status: 400 });
  }

  // Vérifie que la matière appartient bien à l'utilisateur (isolation des données, §24)
  const studentProfile = await prisma.studentProfile.findUnique({ where: { userId: user.id } });
  if (!studentProfile) {
    return NextResponse.json({ error: "Profil élève introuvable." }, { status: 404 });
  }
  const owns = await prisma.userSubject.findFirst({
    where: { studentProfileId: studentProfile.id, subjectId: parsed.data.subjectId },
  });
  if (!owns) {
    return NextResponse.json({ error: "Cette matière n'est pas dans ton profil." }, { status: 403 });
  }

  const grade = await prisma.grade.create({
    data: { userId: user.id, ...parsed.data },
  });
  return NextResponse.json({ grade });
}
