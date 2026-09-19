import { PageHeader } from "../../../components/ui";
import { ProjetsClient } from "../../../components/projets-client";
import { requireUser } from "../../../lib/session";
import { prisma } from "@scolyra/db";

export default async function ProjetsPage() {
  const user = await requireUser();
  const projects = await prisma.project.findMany({
    where: { userId: user.id },
    include: { tasks: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHeader
        eyebrow="Suivi"
        title="Projets"
        description="Grand Oral, TIPE, dossiers — suivis et décomposés en tâches."
      />
      <ProjetsClient
        projects={projects.map((p) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          deadline: p.deadline ? p.deadline.toISOString() : null,
          tasks: p.tasks.map((t) => ({ id: t.id, title: t.title, status: t.status })),
        }))}
      />
    </div>
  );
}
