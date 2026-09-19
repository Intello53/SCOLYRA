import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@scolyra/db";
import { getCurrentUser } from "../../../lib/session";

const createSubjectSchema = z.object({
  name: z.string().min(1).max(80),
  includeInAverage: z.boolean().default(true),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const studentProfile = await prisma.studentProfile.findUnique({
    where: { userId: user.id },
    include: {
      subjects: { include: { subject: true } },
    },
  });
  if (!studentProfile) return NextResponse.json({ subjects: [] });

  const grades = await prisma.grade.findMany({ where: { userId: user.id } });

  const subjects = studentProfile.subjects.map((us) => {
    const subjectGrades = grades.filter((g) => g.subjectId === us.subjectId);
    const totalCoef = subjectGrades.reduce((sum, g) => sum + g.coefficient, 0);
    const average =
      totalCoef > 0
        ? subjectGrades.reduce((sum, g) => sum + (g.value / g.maxValue) * 20 * g.coefficient, 0) / totalCoef
        : null;
    return {
      userSubjectId: us.id,
      subjectId: us.subjectId,
      name: us.subject.name,
      isSpecialty: us.isSpecialty,
      isCustom: us.subject.isCustom,
      includeInAverage: us.includeInAverage,
      average: average !== null ? Math.round(average * 100) / 100 : null,
      gradeCount: subjectGrades.length,
    };
  });

  return NextResponse.json({ subjects });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = createSubjectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides." }, { status: 400 });
  }

  const studentProfile = await prisma.studentProfile.findUnique({ where: { userId: user.id } });
  if (!studentProfile) return NextResponse.json({ error: "Profil élève introuvable." }, { status: 404 });

  let subject;
  try {
    subject = await prisma.subject.create({
      data: { name: parsed.data.name, category: "Personnalisée", isCustom: true, createdById: user.id },
    });
  } catch {
    return NextResponse.json({ error: "Tu as déjà une matière avec ce nom." }, { status: 409 });
  }

  const userSubject = await prisma.userSubject.create({
    data: {
      studentProfileId: studentProfile.id,
      subjectId: subject.id,
      includeInAverage: parsed.data.includeInAverage,
    },
  });

  return NextResponse.json({ subject, userSubject });
}
