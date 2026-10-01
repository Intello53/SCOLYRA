import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@scolyra/db";
import { getCurrentUser } from "../../../lib/session";
import { AIOrchestrator } from "@scolyra/ai";

const messageSchema = z.object({ message: z.string().min(1).max(2000) });

/**
 * Ce endpoint appelle réellement AIOrchestrator + les agents avec les
 * VRAIES données Prisma de l'utilisateur (notes, objectifs, erreurs,
 * orientation) — ce n'est plus une réponse aléatoire tirée d'une liste
 * fixe. Mais le raisonnement reste celui du MockAIProvider tant
 * qu'AI_PROVIDER n'est pas configuré avec un vrai fournisseur (voir
 * docs/AI.md) : les phrases produites restent volontairement simples.
 */
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = messageSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Message invalide." }, { status: 400 });

  const orchestrator = new AIOrchestrator();
  const intent = orchestrator.detectIntent(parsed.data.message);

  const [goals, mistakes, grades, orientationProfile] = await Promise.all([
    prisma.goal.findMany({ where: { userId: user.id, status: "ACTIVE" } }),
    prisma.mistake.findMany({ where: { userId: user.id }, include: { skill: true } }),
    prisma.grade.findMany({ where: { userId: user.id } }),
    prisma.orientationProfile.findUnique({ where: { userId: user.id } }),
  ]);

  const recentGradesAvg = grades.length
    ? grades.reduce((s, g) => s + (g.value / g.maxValue) * 20, 0) / grades.length
    : undefined;

  let reply: string;
  let suggestion: unknown = null;

  switch (intent) {
    case "objective": {
      const goal = goals[0];
      const agent = orchestrator.getAgent("objective");
      if (goal?.targetValue != null && goal.currentValue != null) {
        const rec = await agent.recommend({
          userId: user.id,
          targetAverage: goal.targetValue,
          currentAverage: goal.currentValue,
          deadlineDays: goal.deadline
            ? Math.max(1, Math.ceil((goal.deadline.getTime() - Date.now()) / 86_400_000))
            : 60,
          weakSubjects: [],
        });
        reply = `${rec.disclaimer} Priorité : ${rec.prioritySubjects.join(", ") || "aucune matière identifiée pour l'instant"}.`;
        suggestion = rec;
      } else {
        reply =
          "Tu n'as pas encore d'objectif chiffré actif — crée-en un dans l'onglet Objectifs pour que je puisse t'aider précisément.";
      }
      break;
    }
    case "revision": {
      const agent = orchestrator.getAgent("revision");
      const mistakesBySkill: Record<string, number> = {};
      for (const m of mistakes) {
        const key = m.skill?.name ?? m.description.slice(0, 40);
        mistakesBySkill[key] = (mistakesBySkill[key] ?? 0) + m.recurrence;
      }
      const plan = await agent.planPriorities({ userId: user.id, mistakesBySkill, daysUntilDeadline: 14 });
      reply =
        plan.orderedSkills.length > 0
          ? `${plan.note} En premier : ${plan.orderedSkills[0]}.`
          : "Je n'ai pas encore d'erreurs enregistrées pour toi — importe une copie ou ajoute des erreurs pour que je puisse prioriser tes révisions.";
      suggestion = plan;
      break;
    }
    case "orientation": {
      const agent = orchestrator.getAgent("orientation");
      const interests =
        orientationProfile?.desiredFields
          ?.split(",")
          .map((s) => s.trim())
          .filter(Boolean) ?? [];
      const rec = await agent.suggestFields({ userId: user.id, strengths: [], interests });
      reply = interests.length
        ? `D'après tes domaines déclarés (${interests.join(", ")}), ${rec.disclaimer.toLowerCase()}`
        : "Renseigne tes domaines envisagés dans l'onglet Orientation, ou fais le quiz d'orientation (Premium) pour des suggestions plus précises.";
      suggestion = rec;
      break;
    }
    case "project": {
      reply = "Dis-m'en plus sur ton projet (titre, tâches déjà faites) et je te proposerai les prochaines étapes.";
      break;
    }
    case "copyAnalysis": {
      reply = "Importe le document dans l'onglet Documents pour que je puisse l'analyser.";
      break;
    }
    default: {
      const agent = orchestrator.getAgent("pedagogical");
      const summary = await agent.summarize({
        userId: user.id,
        strengths: [],
        weaknesses: mistakes.slice(0, 3).map((m) => m.description),
        recentGradesAvg,
      });
      reply = summary.summary;
    }
  }

  await prisma.aIUsage.create({
    data: { userId: user.id, role: "FAST", promptTokens: parsed.data.message.length, outputTokens: reply.length },
  });

  return NextResponse.json({ reply, intent, suggestion });
}
