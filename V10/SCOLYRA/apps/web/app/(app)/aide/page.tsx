import { PageHeader } from "../../../components/ui";
import { AideClient } from "../../../components/aide-client";
import { requireUser } from "../../../lib/session";
import { prisma } from "@scolyra/db";

export default async function AidePage() {
  const user = await requireUser();
  const tickets = await prisma.supportTicket.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <PageHeader
        eyebrow="Compte"
        title="Aide & assistance"
        description="Une question, un bug, un problème avec ton compte ? Écris-nous ici."
      />
      <AideClient
        tickets={tickets.map((t) => ({
          id: t.id,
          subject: t.subject,
          status: t.status,
          updatedAt: t.updatedAt.toISOString(),
        }))}
      />
    </div>
  );
}
