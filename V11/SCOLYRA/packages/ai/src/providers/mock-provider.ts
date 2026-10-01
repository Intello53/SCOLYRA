import type {
  AIProvider,
  AnalyzeDocumentInput,
  AnalyzeDocumentOutput,
  EmbedInput,
  EmbedOutput,
  GenerateStructuredInput,
  GenerateStructuredOutput,
  GenerateTextInput,
  GenerateTextOutput,
} from "../types";

/**
 * MockAIProvider — utilisé quand AI_PROVIDER=mock (valeur par défaut en dev).
 *
 * Permet de faire tourner tout SCOLYRA (dashboard, coach, révisions...)
 * SANS clé OpenAI/Anthropic/Gemini configurée (§45).
 * Les réponses sont volontairement simples et clairement identifiables
 * comme des données de démonstration.
 */
export class MockAIProvider implements AIProvider {
  async generateText(input: GenerateTextInput): Promise<GenerateTextOutput> {
    const text = `[MOCK-${input.role.toUpperCase()}] Réponse de démonstration pour : "${input.prompt.slice(
      0,
      120
    )}"`;
    return {
      text,
      promptTokens: Math.ceil(input.prompt.length / 4),
      outputTokens: Math.ceil(text.length / 4),
    };
  }

  async generateStructured<T>(
    input: GenerateStructuredInput<unknown>
  ): Promise<GenerateStructuredOutput<T>> {
    // En mode mock, on renvoie un objet vide typé "any" — chaque agent
    // appelant doit gérer ce cas de façon explicite (voir agents/*).
    return {
      data: {} as T,
      promptTokens: Math.ceil(input.prompt.length / 4),
      outputTokens: 0,
    };
  }

  async analyzeDocument(
    input: AnalyzeDocumentInput
  ): Promise<AnalyzeDocumentOutput> {
    return {
      summary: `[MOCK] Analyse simulée du document ${input.documentUrl}.`,
      detectedIssues: ["Analyse réelle indisponible en mode mock."],
      promptTokens: 0,
      outputTokens: 0,
    };
  }

  async embed(input: EmbedInput): Promise<EmbedOutput> {
    // Vecteurs déterministes factices (dimension 1536, alignée sur le
    // schéma Prisma DocumentChunk.embedding) — NE PAS utiliser en prod.
    const vectors = input.texts.map((text) => {
      let seed = 0;
      for (let i = 0; i < text.length; i++) seed = (seed + text.charCodeAt(i)) % 1000;
      return new Array(1536).fill(0).map((_, i) => Math.sin(seed + i) * 0.01);
    });
    return { vectors };
  }
}
