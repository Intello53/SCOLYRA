import { getAIProvider } from "../index";

/** RevisionAgent — priorise les notions à réviser (§15). */
export interface RevisionInput {
  userId: string;
  mistakesBySkill: Record<string, number>; // notion -> nb d'erreurs récurrentes
  daysUntilDeadline: number;
}

export interface RevisionPlanSuggestion {
  orderedSkills: string[];
  note: string;
}

export class RevisionAgent {
  private provider = getAIProvider();

  async planPriorities(input: RevisionInput): Promise<RevisionPlanSuggestion> {
    await this.provider.generateText({
      role: "fast",
      system: "Priorise les notions à réviser selon la fréquence des erreurs et le temps restant.",
      prompt: JSON.stringify(input),
      userId: input.userId,
    });

    const orderedSkills = Object.entries(input.mistakesBySkill)
      .sort((a, b) => b[1] - a[1])
      .map(([skill]) => skill);

    return {
      orderedSkills,
      note:
        input.daysUntilDeadline < 7
          ? "Échéance proche : concentre-toi sur les 2-3 notions les plus récurrentes."
          : "Temps suffisant pour couvrir l'ensemble des notions faibles progressivement.",
    };
  }
}
