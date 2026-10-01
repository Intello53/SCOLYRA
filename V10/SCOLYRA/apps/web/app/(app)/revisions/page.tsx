import { PageHeader } from "../../../components/ui";
import { RevisionsClient } from "../../../components/revisions-client";
import { requireUser } from "../../../lib/session";
import { prisma } from "@scolyra/db";
import { getSubjectsWithStats } from "../../../lib/grades";

export default async function RevisionsPage() {
  const user = await requireUser();
  const [sessions, subjects] = await Promise.all([
    prisma.revisionSession.findMany({
      where: { revisionPlan: { userId: user.id } },
      include: { subject: true },
      orderBy: { createdAt: "desc" },
    }),
    getSubjectsWithStats(user.id),
  ]);

  return (
    <div>
      <PageHeader
        eyebrow="Travail"
        title="Révisions"
        description="Priorise tes notions à réviser en fonction de tes erreurs récentes."
      />
      <RevisionsClient
        sessions={sessions.map((s) => ({
          id: s.id,
          title: s.title,
          subjectName: s.subject?.name ?? null,
          priority: s.priority,
          status: s.status,
        }))}
        subjects={subjects.map((s) => ({ subjectId: s.subjectId, name: s.name }))}
      />
    </div>
  );
}
