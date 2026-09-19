import { PageHeader } from "../../../components/ui";
import { FeatureFlagsClient } from "../../../components/feature-flags-client";
import { requireAdmin } from "../../../lib/session";
import { getFeatureFlags } from "../../../lib/feature-flags";

export default async function AdminFeaturesPage() {
  await requireAdmin();
  const flags = await getFeatureFlags();

  return (
    <div>
      <PageHeader
        eyebrow="Administration"
        title="Fonctionnalités"
        description="Décide quelles fonctionnalités sont réservées aux comptes Premium, sans toucher au code."
      />
      <FeatureFlagsClient
        flags={flags.map((f) => ({ id: f.id, key: f.key, label: f.label, description: f.description, premiumOnly: f.premiumOnly }))}
      />
    </div>
  );
}
