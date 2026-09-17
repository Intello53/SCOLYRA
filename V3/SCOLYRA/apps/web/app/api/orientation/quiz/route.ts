import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@scolyra/db";
import { getCurrentUser } from "../../../../lib/session";
import { QUIZ_QUESTIONS, scoreQuiz } from "../../../../lib/orientation-quiz";

async function requirePremium(userId: string) {
  const subscription = await prisma.subscription.findUnique({ where: { userId } });
  return subscription?.plan === "PREMIUM";
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  if (!(await requirePremium(user.id))) {
    return NextResponse.json({ error: "Fonctionnalité réservée à Premium." }, { status: 403 });
  }
  return NextResponse.json({ questions: QUIZ_QUESTIONS });
}

const submitSchema = z.object({
  answers: z.record(z.string()),
  geographicMaxDistanceKm: z.number().min(0).max(2000).nullable().optional(),
  geographicPreferredRegions: z.array(z.string()).max(20).optional(),
});

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  if (!(await requirePremium(user.id))) {
    return NextResponse.json({ error: "Fonctionnalité réservée à Premium." }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = submitSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Données invalides." }, { status: 400 });

  const ranked = scoreQuiz(parsed.data.answers);
  const top = ranked.slice(0, 3);

  const result = {
    computedAt: new Date().toISOString(),
    topDomains: top,
    allScores: ranked,
    geographicMaxDistanceKm: parsed.data.geographicMaxDistanceKm ?? null,
    geographicPreferredRegions: parsed.data.geographicPreferredRegions ?? [],
    disclaimer:
      "Ce résultat suggère des grands domaines cohérents avec tes réponses — ce n'est ni une garantie, ni une liste de formations ou d'écoles précises. Aucune donnée Parcoursup officielle n'est utilisée ici.",
  };

  await prisma.orientationProfile.upsert({
    where: { userId: user.id },
    update: {
      quizAnswers: parsed.data.answers,
      quizResult: result,
      geographicMaxDistanceKm: parsed.data.geographicMaxDistanceKm,
      geographicPreferredRegions: parsed.data.geographicPreferredRegions ?? [],
    },
    create: {
      userId: user.id,
      quizAnswers: parsed.data.answers,
      quizResult: result,
      geographicMaxDistanceKm: parsed.data.geographicMaxDistanceKm,
      geographicPreferredRegions: parsed.data.geographicPreferredRegions ?? [],
    },
  });

  return NextResponse.json({ result });
}
