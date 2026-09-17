import { PageHeader, Panel, Badge } from "../../../components/ui";
import { StaggerGroup, StaggerItem } from "../../../components/motion";
import { requireUser } from "../../../lib/session";
import { prisma } from "@scolyra/db";
import { getSubjectsWithStats } from "../../../lib/grades";
import { getLevel, SPECIALTIES, COLLEGE_OPTIONS, SECONDE_OPTIONS, LYCEE_CYCLE_TERMINAL_OPTIONS, type SchoolLevelCode } from "../../../lib/curriculum";

function labelFor(code: string) {
  const all = [...SPECIALTIES, ...COLLEGE_OPTIONS, ...SECONDE_OPTIONS, ...LYCEE_CYCLE_TERMINAL_OPTIONS];
  return all.find((i) => i.code === code)?.label ?? code;
}

export default async function ProfilPage() {
  const user = await requireUser();
  const [profile, studentProfile, subjects] = await Promise.all([
    prisma.profile.findUnique({ where: { userId: user.id } }),
    prisma.studentProfile.findUnique({ where: { userId: user.id } }),
    getSubjectsWithStats(user.id),
  ]);

  const level = studentProfile ? getLevel(studentProfile.schoolLevel as SchoolLevelCode) : null;
  const weakSubjects = subjects.filter((s) => s.average !== null && s.average < 10);

  return (
    <div>
      <PageHeader
        eyebrow="Compte"
        title="Profil pédagogique"
        description="Ce que SCOLYRA sait de toi — la base de toutes les recommandations."
      />

      <StaggerGroup className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <StaggerItem>
          <Panel hover>
            <h2 className="font-display text-lg text-ink-900 dark:text-white">Identité scolaire</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-900/55 dark:text-white/55">Nom</dt>
                <dd className="text-ink-900 dark:text-white">{profile?.firstName} {profile?.lastName ?? ""}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-900/55 dark:text-white/55">Niveau</dt>
                <dd className="text-ink-900 dark:text-white">{level?.label ?? "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-900/55 dark:text-white/55">Établissement</dt>
                <dd className="text-ink-900 dark:text-white">{studentProfile?.establishment ?? "Non renseigné"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-900/55 dark:text-white/55">Temps disponible</dt>
                <dd className="text-ink-900 dark:text-white">
                  {studentProfile?.weeklyAvailableMin ? `${Math.round(studentProfile.weeklyAvailableMin / 60)} h / semaine` : "Non renseigné"}
                </dd>
              </div>
            </dl>
          </Panel>
        </StaggerItem>

        <StaggerItem>
          <Panel hover>
            <h2 className="font-display text-lg text-ink-900 dark:text-white">Spécialités & options</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {(studentProfile?.specialties ?? []).map((code) => (
                <Badge key={code} tone="primary">{labelFor(code)}</Badge>
              ))}
              {(studentProfile?.options ?? []).map((code) => (
                <Badge key={code} tone="neutral">{labelFor(code)}</Badge>
              ))}
              {(!studentProfile?.specialties.length && !studentProfile?.options.length) && (
                <p className="text-sm text-ink-900/45 dark:text-white/45">Aucune renseignée.</p>
              )}
            </div>
            <h2 className="mt-6 font-display text-lg text-ink-900 dark:text-white">Matières sous les 10/20</h2>
            <ul className="mt-3 space-y-1.5 text-sm text-ink-900/65 dark:text-white/65">
              {weakSubjects.length === 0 && <li className="text-ink-900/45 dark:text-white/45">Aucune pour l'instant.</li>}
              {weakSubjects.map((s) => (
                <li key={s.userSubjectId}>— {s.name} ({s.average}/20)</li>
              ))}
            </ul>
          </Panel>
        </StaggerItem>
      </StaggerGroup>
    </div>
  );
}
