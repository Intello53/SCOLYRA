import { getAIProvider } from "../index";

/**
 * ObjectiveAgent — module "Objectif 15+" (§14).
 * Propose des matières prioritaires et objectifs intermédiaires
 * à partir d'un objectif de moyenne et de la moyenne actuelle.
 *
 * IMPORTANT : ne jamais formuler la sortie comme une garantie de résultat.
 * Toujours présenter les recommandations comme des estimations pédagogiques.
 */
export interface ObjectiveInput {
  userId: string;
  targetAverage: number;
  currentAverage: number;
  deadlineDays: number;
  weakSubjects: string[];
}

export interface ObjectiveRecommendation {
  disclaimer: string;
  prioritySubjects: string[];
  intermediateMilestones: string[];
}

export class ObjectiveAgent {
  private provider = getAIProvider();

  async recommend(input: ObjectiveInput): Promise<ObjectiveRecommendation> {
    const prompt = `Objectif: ${input.targetAverage}/20 en ${input.deadlineDays} jours. Moyenne actuelle: ${input.currentAverage}/20. Matières faibles: ${input.weakSubjects.join(", ")}.`;

    await this.provider.generateText({
      role: "fast",
      system:
        "Propose un plan réaliste. Ne promets jamais une note future. Présente toujours les résultats comme des estimations.",
      prompt,
      userId: input.userId,
    });

    const gap = input.targetAverage - input.currentAverage;
    const milestoneCount = Math.min(4, Math.max(1, Math.round(input.deadlineDays / 30)));
    const step = gap / milestoneCount;

    return {
      disclaimer:
        "Ces recommandations sont des estimations pédagogiques, pas une garantie de résultat.",
      prioritySubjects: input.weakSubjects.slice(0, 3),
      intermediateMilestones: Array.from({ length: milestoneCount }, (_, i) =>
        `Palier ${i + 1} : viser ~${(input.currentAverage + step * (i + 1)).toFixed(1)}/20`
      ),
    };
  }
}
