import { DashboardView } from "../../../components/dashboard-view";
import { requireUser } from "../../../lib/session";
import { prisma } from "@scolyra/db";
import { getSubjectsWithStats, computeOverallAverage } from "../../../lib/grades";
import { getLevel, type SchoolLevelCode } from "../../../lib/curriculum";

export default async function DashboardPage() {
  const user = await requireUser();

  const [profile, studentProfile, subjects, goalsRaw, studySessions] = await Promise.all([
    prisma.profile.findUnique({ where: { userId: user.id } }),
    prisma.studentProfile.findUnique({ where: { userId: user.id } }),
    getSubjectsWithStats(user.id),
    prisma.goal.findMany({ where: { userId: user.id, status: "ACTIVE" }, orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.studySession.findMany({
      where: { userId: user.id, completed: false, startAt: { gte: new Date() } },
      orderBy: { startAt: "asc" },
      take: 5,
    }),
  ]);

  const overallAverage = computeOverallAverage(subjects);
  const levelLabel = studentProfile ? getLevel(studentProfile.schoolLevel as SchoolLevelCode)?.label ?? "" : "";

  const goalDeadlines = goalsRaw
    .filter((g) => g.deadline)
    .map((g) => ({ title: g.title, date: g.deadline!.toISOString(), kind: "Objectif" }));
  const sessionDeadlines = studySessions.map((s) => ({ title: s.title, date: s.startAt.toISOString(), kind: "Session de travail" }));
  const upcoming = [...goalDeadlines, ...sessionDeadlines].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <DashboardView
      firstName={profile?.firstName ?? "there"}
      schoolLevelLabel={levelLabel}
      establishment={studentProfile?.establishment ?? null}
      overallAverage={overallAverage}
      subjects={subjects}
      goals={goalsRaw.map((g) => ({
        id: g.id,
        title: g.title,
        currentValue: g.currentValue,
        targetValue: g.targetValue,
        deadline: g.deadline ? g.deadline.toISOString() : null,
      }))}
      upcoming={upcoming}
    />
  );
}
