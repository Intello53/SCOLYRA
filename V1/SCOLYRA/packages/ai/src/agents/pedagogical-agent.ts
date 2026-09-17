import { getAIProvider } from "../index";

/**
 * PedagogicalAgent — analyse le profil pédagogique d'un élève
 * (matières, compétences, notes, difficultés) et produit un résumé
 * exploitable par le dashboard et les autres agents.
 *
 * NB : la logique de corrélation avancée (croisement notes/compétences/
 * objectifs) est volontairement simplifiée en V0. C'est le cœur de
 * différenciation du produit (§4) et mérite un travail dédié — voir
 * docs/ROADMAP.md, V1.
 */
export interface PedagogicalSummaryInput {
  userId: string;
  strengths: string[];
  weaknesses: string[];
  recentGradesAvg?: number;
}

export interface PedagogicalSummaryOutput {
  summary: string;
  priorityFocusAreas: string[];
}

export class PedagogicalAgent {
  private provider = getAIProvider();

  async summarize(
    input: PedagogicalSummaryInput
  ): Promise<PedagogicalSummaryOutput> {
    const prompt = `Élève ${input.userId}. Points forts: ${input.strengths.join(
      ", "
    )}. Points faibles: ${input.weaknesses.join(", ")}. Moyenne récente: ${
      input.recentGradesAvg ?? "inconnue"
    }.`;

    const result = await this.provider.generateText({
      role: "fast",
      system:
        "Tu es un agent pédagogique. Résume la situation scolaire de l'élève de façon factuelle, sans jamais garantir de résultat futur.",
      prompt,
      userId: input.userId,
    });

    return {
      summary: result.text,
      priorityFocusAreas: input.weaknesses.slice(0, 3),
    };
  }
}
