import Link from "next/link";
import { PageHeader, Panel, Badge } from "../../../../components/ui";
import { Button } from "../../../../components/button";
import { CostSimulatorClient } from "../../../../components/cost-simulator-client";
import { requireUser } from "../../../../lib/session";
import { prisma } from "@scolyra/db";

export default async function CostSimulatorPage() {
  const user = await requireUser();
  const subscription = await prisma.subscription.findUnique({ where: { userId: user.id } });
  const isPremium = subscription?.plan === "PREMIUM";

  return (
    <div>
      <PageHeader
        eyebrow="Orientation"
        title="Simulateur de coût des études"
        description="Une estimation indicative pour anticiper le budget d'une formation."
        action={<Badge tone="gold">Premium</Badge>}
      />

      {!isPremium ? (
        <Panel>
          <h2 className="font-display text-lg text-ink-900 dark:text-white">Réservé aux comptes Premium</h2>
          <p className="mt-2 text-sm text-ink-900/60 dark:text-white/60">
            Passe en Premium pour accéder au simulateur de coût des études.
          </p>
          <Link href="/parametres">
            <Button className="mt-4">Voir les options Premium</Button>
          </Link>
        </Panel>
      ) : (
        <CostSimulatorClient />
      )}
    </div>
  );
}
