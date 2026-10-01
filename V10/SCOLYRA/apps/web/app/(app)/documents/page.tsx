import { PageHeader } from "../../../components/ui";
import { DocumentsClient } from "../../../components/documents-client";
import { requireUser } from "../../../lib/session";
import { prisma } from "@scolyra/db";

export default async function DocumentsPage() {
  const user = await requireUser();
  const documents = await prisma.document.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } });

  return (
    <div>
      <PageHeader
        eyebrow="Suivi"
        title="Documents"
        description="Cours, copies et fiches — analysés pour alimenter ton profil pédagogique."
      />
      <DocumentsClient
        documents={documents.map((d) => ({
          id: d.id,
          title: d.title,
          type: d.type,
          status: d.status,
          createdAt: d.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
