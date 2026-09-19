import { Sidebar } from "../../components/sidebar";
import { CelebrationProvider } from "../../components/celebration";
import { requireUser } from "../../lib/session";
import { prisma } from "@scolyra/db";
import { getSubjectsWithStats, computeOverallAverage } from "../../lib/grades";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const [profile, subjects, activeGoal, completedThisWeek] = await Promise.all([
    prisma.profile.findUnique({ where: { userId: user.id } }),
    getSubjectsWithStats(user.id),
    prisma.goal.findFirst({ where: { userId: user.id, status: "ACTIVE", targetValue: { not: null } }, orderBy: { createdAt: "desc" } }),
    prisma.studySession.findMany({
      where: {
        userId: user.id,
        completed: true,
        startAt: { gte: new Date(Date.now() - 7 * 86_400_000) },
      },
      select: { startAt: true },
    }),
  ]);

  const overallAverage = computeOverallAverage(subjects) ?? 0;
  const overallTarget = activeGoal?.targetValue ?? 15;
  const activeDays = new Set(completedThisWeek.map((s) => s.startAt.toDateString())).size;

  return (
    <CelebrationProvider>
      <div className="flex min-h-screen">
        <Sidebar
          firstName={profile?.firstName ?? "there"}
          overallAverage={overallAverage}
          overallTarget={overallTarget}
          activeDaysThisWeek={activeDays}
        />
        <main className="flex-1 px-6 py-8 md:px-10 md:py-10">
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>
      </div>
    </CelebrationProvider>
  );
}
