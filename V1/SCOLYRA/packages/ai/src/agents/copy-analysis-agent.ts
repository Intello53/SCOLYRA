import { getAIProvider } from "../index";

/**
 * CopyAnalysisAgent — analyse une copie/évaluation numérisée (§17).
 * Les erreurs détectées doivent être répercutées dans le modèle Mistake
 * pour alimenter le profil pédagogique (StudentProfile / UserSkill).
 */
export interface CopyAnalysisInput {
  userId: string;
  documentUrl: string;
  subjectHint?: string;
}

export interface CopyAnalysisResult {
  detectedMistakes: string[];
  suggestedSkillsToReinforce: string[];
  rawSummary: string;
}

export class CopyAnalysisAgent {
  private provider = getAIProvider();

  async analyze(input: CopyAnalysisInput): Promise<CopyAnalysisResult> {
    const result = await this.provider.analyzeDocument({
      role: "vision",
      documentUrl: input.documentUrl,
      instructions: `Analyse cette copie${
        input.subjectHint ? ` de ${input.subjectHint}` : ""
      } : détecte les erreurs, les notions mal comprises et les récurrences.`,
      userId: input.userId,
    });

    return {
      detectedMistakes: result.detectedIssues,
      suggestedSkillsToReinforce: result.detectedIssues.slice(0, 3),
      rawSummary: result.summary,
    };
  }
}
