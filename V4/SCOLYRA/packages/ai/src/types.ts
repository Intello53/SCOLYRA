/**
 * SCOLYRA — Abstraction du fournisseur IA (§12)
 *
 * Aucune partie de l'application ne doit appeler directement un SDK
 * OpenAI / Anthropic / Gemini. Tout passe par l'interface AIProvider,
 * afin de pouvoir changer de fournisseur (ou basculer en mode "mock")
 * sans toucher aux agents ni à l'UI.
 */

export type AIRole = "fast" | "powerful" | "vision" | "embeddings";

export interface GenerateTextInput {
  role: AIRole;
  system?: string;
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  userId?: string; // pour le suivi des quotas / AIUsage
}

export interface GenerateTextOutput {
  text: string;
  promptTokens: number;
  outputTokens: number;
}

export interface GenerateStructuredInput<TSchema> {
  role: AIRole;
  system?: string;
  prompt: string;
  schema: TSchema; // schéma Zod attendu en sortie
  userId?: string;
}

export interface GenerateStructuredOutput<T> {
  data: T;
  promptTokens: number;
  outputTokens: number;
}

export interface AnalyzeDocumentInput {
  role: "vision" | "fast" | "powerful";
  documentUrl: string;
  instructions: string;
  userId?: string;
}

export interface AnalyzeDocumentOutput {
  summary: string;
  detectedIssues: string[];
  promptTokens: number;
  outputTokens: number;
}

export interface EmbedInput {
  texts: string[];
  userId?: string;
}

export interface EmbedOutput {
  vectors: number[][];
}

/**
 * Interface que tout fournisseur IA (réel ou mock) doit implémenter.
 */
export interface AIProvider {
  generateText(input: GenerateTextInput): Promise<GenerateTextOutput>;
  generateStructured<T>(
    input: GenerateStructuredInput<unknown>
  ): Promise<GenerateStructuredOutput<T>>;
  analyzeDocument(input: AnalyzeDocumentInput): Promise<AnalyzeDocumentOutput>;
  embed(input: EmbedInput): Promise<EmbedOutput>;
}
