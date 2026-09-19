import { PageHeader } from "../../../components/ui";
import { ParametresClient } from "../../../components/parametres-client";
import { requireUser } from "../../../lib/session";
import { prisma } from "@scolyra/db";

export default async function ParametresPage() {
  const user = await requireUser();
  const [dbUser, subscription, guardianLink] = await Promise.all([
    prisma.user.findUnique({ where: { id: user.id } }),
    prisma.subscription.findUnique({ where: { userId: user.id } }),
    prisma.legalGuardianLink.findFirst({ where: { studentId: user.id, verified: true } }),
  ]);

  return (
    <div>
      <PageHeader eyebrow="Compte" title="Paramètres" description="Abonnement, notifications et confidentialité." />
      <ParametresClient
        plan={subscription?.plan ?? "FREE"}
        isMinor={dbUser?.isMinor ?? false}
        hasVerifiedGuardian={!!guardianLink}
      />
    </div>
  );
}
