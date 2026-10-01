import Link from "next/link";
import { PageHeader, Panel, Badge } from "../../../../components/ui";
import { Button } from "../../../../components/button";
import { OrientationQuizClient } from "../../../../components/orientation-quiz-client";
import { requireUser } from "../../../../lib/session";
import { prisma } from "@scolyra/db";
import { QUIZ_QUESTIONS } from "../../../../lib/orientation-quiz";
import { isFeatureAccessible, FEATURE_KEYS } from "../../../../lib/feature-flags";

export default async function OrientationQuizPage() {
  const user = await requireUser();
  const [subscription, profile] = await Promise.all([
    prisma.subscription.findUnique({ where: { userId: user.id } }),
    prisma.orientationProfile.findUnique({ where: { userId: user.id } }),
  ]);

  const plan = subscription?.plan ?? "FREE";
  const accessible = await isFeatureAccessible(FEATURE_KEYS.ORIENTATION_QUIZ, plan);

  return (
    <div>
      <PageHeader eyebrow="Orientation" title="Quiz d'orientation" action={<Badge tone="gold">Premium</Badge>} />

      {!accessible ? (
        <Panel>
          <h2 className="font-display text-lg text-ink-900 dark:text-white">Réservé aux comptes Premium</h2>
          <p className="mt-2 text-sm text-ink-900/60 dark:text-white/60">
            Passe en Premium pour accéder au quiz d'orientation approfondi.
          </p>
          <Link href="/parametres">
            <Button className="mt-4">Voir les options Premium</Button>
          </Link>
        </Panel>
      ) : (
        <OrientationQuizClient
          questions={QUIZ_QUESTIONS}
          initialMaxDistance={profile?.geographicMaxDistanceKm ?? null}
          initialRegions={profile?.geographicPreferredRegions ?? []}
        />
      )}
    </div>
  );
}
