import { PageHeader } from "../../../components/ui";
import { ObjectifsClient } from "../../../components/objectifs-client";
import { requireUser } from "../../../lib/session";
import { prisma } from "@scolyra/db";
import { getSubjectsWithStats } from "../../../lib/grades";

export default async function ObjectifsPage() {
  const user = await requireUser();
  const [goalsRaw, subjects] = await Promise.all([
    prisma.goal.findMany({ where: { userId: user.id, status: "ACTIVE" }, orderBy: { createdAt: "desc" } }),
    getSubjectsWithStats(user.id),
  ]);

  const goals = goalsRaw.map((g) => ({
    id: g.id,
    title: g.title,
    targetValue: g.targetValue,
    currentValue: g.currentValue,
    deadline: g.deadline ? g.deadline.toISOString() : null,
    milestones: (g.milestones as { label: string; done: boolean }[] | null) ?? [],
  }));

  return (
    <div>
      <PageHeader
        eyebrow="Travail"
        title="Objectifs"
        description="Crée un objectif, décompose-le en paliers, coche-les au fur et à mesure. Les estimations ne garantissent jamais un résultat."
      />
      <ObjectifsClient goals={goals} subjects={subjects.map((s) => ({ subjectId: s.subjectId, name: s.name }))} />
    </div>
  );
}
