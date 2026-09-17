import { PageHeader } from "../../../components/ui";
import { OrientationClient } from "../../../components/orientation-client";
import { requireUser } from "../../../lib/session";
import { prisma } from "@scolyra/db";

export default async function OrientationPage() {
  const user = await requireUser();
  const [profile, applications, subscription] = await Promise.all([
    prisma.orientationProfile.findUnique({ where: { userId: user.id } }),
    prisma.application.findMany({ where: { userId: user.id }, include: { formation: true }, orderBy: { createdAt: "desc" } }),
    prisma.subscription.findUnique({ where: { userId: user.id } }),
  ]);

  return (
    <div>
      <PageHeader
        eyebrow="Suivi"
        title="Orientation"
        description="Domaines envisagés, candidatures et échéances — reliés à ton profil pédagogique."
      />
      <OrientationClient
        profile={
          profile
            ? {
                desiredFields: profile.desiredFields,
                geographicMaxDistanceKm: profile.geographicMaxDistanceKm,
                geographicPreferredRegions: profile.geographicPreferredRegions,
              }
            : null
        }
        applications={applications.map((a) => ({
          id: a.id,
          status: a.status,
          formation: {
            name: a.formation.name,
            establishment: a.formation.establishment,
            isVerified: a.formation.isVerified,
          },
        }))}
        isPremium={subscription?.plan === "PREMIUM"}
      />
    </div>
  );
}
