import { PageHeader } from "../../../components/ui";
import { CalendrierClient } from "../../../components/calendrier-client";
import { requireUser } from "../../../lib/session";
import { prisma } from "@scolyra/db";
import { getSubjectsWithStats } from "../../../lib/grades";

const DAY_LABELS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

function startOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay(); // 0 = dimanche
  const diff = day === 0 ? -6 : 1 - day; // lundi comme premier jour
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default async function CalendrierPage() {
  const user = await requireUser();
  const monday = startOfWeek(new Date());
  const sunday = new Date(monday);
  sunday.setDate(sunday.getDate() + 7);

  const [sessions, subjects] = await Promise.all([
    prisma.studySession.findMany({
      where: { userId: user.id, startAt: { gte: monday, lt: sunday } },
      include: { subject: true },
      orderBy: { startAt: "asc" },
    }),
    getSubjectsWithStats(user.id),
  ]);

  const week = DAY_LABELS.map((label, i) => {
    const dayDate = new Date(monday);
    dayDate.setDate(dayDate.getDate() + i);
    const daySessions = sessions.filter((s) => {
      const d = new Date(s.startAt);
      return d.toDateString() === dayDate.toDateString();
    });
    return {
      day: label,
      date: dayDate.toISOString(),
      sessions: daySessions.map((s) => ({
        id: s.id,
        title: s.title,
        startAt: s.startAt.toISOString(),
        endAt: s.endAt.toISOString(),
        completed: s.completed,
        subjectName: s.subject?.name ?? null,
      })),
    };
  });

  return (
    <div>
      <PageHeader
        eyebrow="Travail"
        title="Calendrier"
        description="Ta semaine réelle — ajoute une session, clique dessus pour la marquer comme faite."
      />
      <CalendrierClient week={week} subjects={subjects.map((s) => ({ subjectId: s.subjectId, name: s.name }))} />
    </div>
  );
}
