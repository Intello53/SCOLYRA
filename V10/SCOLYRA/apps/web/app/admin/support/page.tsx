import { PageHeader, Badge } from "../../../components/ui";
import { AdminSupportClient } from "../../../components/admin-support-client";
import { requireAdmin } from "../../../lib/session";
import { prisma } from "@scolyra/db";

export default async function AdminSupportPage() {
  await requireAdmin();
  const tickets = await prisma.supportTicket.findMany({
    include: { user: { include: { profile: true } } },
    orderBy: { updatedAt: "desc" },
  });

  const openCount = tickets.filter((t) => t.status === "OPEN").length;

  return (
    <div>
      <PageHeader
        eyebrow="Administration"
        title="Support"
        description="Questions et problèmes remontés par les élèves."
        action={openCount > 0 ? <Badge tone="warn">{openCount} ouvert(s)</Badge> : undefined}
      />
      <AdminSupportClient
        tickets={tickets.map((t) => ({
          id: t.id,
          subject: t.subject,
          status: t.status,
          updatedAt: t.updatedAt.toISOString(),
          user: { email: t.user.email, profile: t.user.profile ? { firstName: t.user.profile.firstName } : null },
        }))}
      />
    </div>
  );
}
