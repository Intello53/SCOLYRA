import { prisma } from "@scolyra/db";

export type SubjectWithStats = {
  userSubjectId: string;
  subjectId: string;
  name: string;
  isSpecialty: boolean;
  isCustom: boolean;
  includeInAverage: boolean;
  average: number | null;
  gradeCount: number;
};

/** Récupère les matières de l'élève avec leur moyenne réelle calculée à partir des notes. */
export async function getSubjectsWithStats(userId: string): Promise<SubjectWithStats[]> {
  const studentProfile = await prisma.studentProfile.findUnique({
    where: { userId },
    include: { subjects: { include: { subject: true } } },
  });
  if (!studentProfile) return [];

  const grades = await prisma.grade.findMany({ where: { userId } });

  return studentProfile.subjects.map((us) => {
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
}

/**
 * Moyenne générale simplifiée : moyenne des moyennes des matières
 * incluses (chaque matière pèse autant qu'une autre). Ce n'est PAS le
 * calcul officiel du contrôle continu du bac, qui pondère différemment
 * spécialités/tronc commun — approximation clairement documentée.
 */
export function computeOverallAverage(subjects: SubjectWithStats[]): number | null {
  const included = subjects.filter((s) => s.includeInAverage && s.average !== null);
  if (included.length === 0) return null;
  const sum = included.reduce((acc, s) => acc + (s.average ?? 0), 0);
  return Math.round((sum / included.length) * 100) / 100;
}
