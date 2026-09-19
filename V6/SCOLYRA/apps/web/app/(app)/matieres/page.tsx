import { PageHeader, StatBlock, EmptyState } from "../../../components/ui";
import { MatieresClient } from "../../../components/matieres-client";
import { requireUser } from "../../../lib/session";
import { getSubjectsWithStats, computeOverallAverage } from "../../../lib/grades";

export default async function MatieresPage() {
  const user = await requireUser();
  const subjects = await getSubjectsWithStats(user.id);
  const overall = computeOverallAverage(subjects);

  return (
    <div>
      <PageHeader
        eyebrow="Suivi"
        title="Matières"
        description="Tes vraies notes, matière par matière. Décoche une matière pour l'exclure de ta moyenne générale."
        action={
          overall !== null ? (
            <StatBlock value={overall.toString()} unit="/20" label="Moyenne générale (approx.)" tone="primary" />
          ) : undefined
        }
      />

      {subjects.length === 0 ? (
        <EmptyState
          title="Aucune matière pour l'instant"
          description="Les matières choisies à l'inscription (options, spécialités) apparaîtront ici. Tu peux aussi en ajouter librement."
        />
      ) : null}

      <MatieresClient subjects={subjects} />
    </div>
  );
}
