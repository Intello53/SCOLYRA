import Anthropic from "@anthropic-ai/sdk";
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
 * AnthropicProvider — premier vrai fournisseur IA de SCOLYRA (les
 * autres, MockAIProvider mis à part, restaient de simples stubs
 * commentés). Utilisé quand AI_PROVIDER=anthropic et AI_API_KEY sont
 * renseignés dans .env — voir docs/AI.md pour la configuration
 * complète, étape par étape.
 *
 * Les rôles fast/powerful sont mappés sur deux modèles Claude
 * différents (voir AI_MODEL_FAST / AI_MODEL_POWERFUL dans .env) pour
 * respecter le principe §46 (éviter les appels coûteux inutiles).
 */
export class AnthropicProvider implements AIProvider {
  private client: Anthropic;
  private modelFast: string;
  private modelPowerful: string;

  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey });
    this.modelFast = process.env.AI_MODEL_FAST ?? "claude-haiku-4-5-20251001";
    this.modelPowerful = process.env.AI_MODEL_POWERFUL ?? "claude-sonnet-4-5";
  }

  private modelFor(role: GenerateTextInput["role"]): string {
    if (role === "powerful") return this.modelPowerful;
    return this.modelFast; // "fast" et "vision" utilisent le modèle rapide par défaut
  }

  async generateText(input: GenerateTextInput): Promise<GenerateTextOutput> {
    const response = await this.client.messages.create({
      model: this.modelFor(input.role),
      max_tokens: input.maxTokens ?? 1024,
      temperature: input.temperature,
      system: input.system,
      messages: [{ role: "user", content: input.prompt }],
    });

    const text = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    return {
      text,
      promptTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
    };
  }

  async generateStructured<T>(input: GenerateStructuredInput<unknown>): Promise<GenerateStructuredOutput<T>> {
    // Pas d'API "structured output" native côté Anthropic à l'heure où
    // ce provider a été écrit : on demande du JSON strict par prompt et
    // on le parse nous-mêmes. Si le modèle ne renvoie pas du JSON
    // valide, l'erreur de parsing remonte à l'appelant (préférable à
    // un objet vide silencieux).
    const response = await this.client.messages.create({
      model: this.modelFor(input.role),
      max_tokens: 1024,
      system: `${input.system ?? ""}\n\nRéponds UNIQUEMENT avec un objet JSON valide, sans texte autour, sans balises markdown.`,
      messages: [{ role: "user", content: input.prompt }],
    });

    const text = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("\n")
      .trim()
      .replace(/^```json\s*|```$/g, "");

    return {
      data: JSON.parse(text) as T,
      promptTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
    };
  }

  async analyzeDocument(input: AnalyzeDocumentInput): Promise<AnalyzeDocumentOutput> {
    // SCOLYRA n'a pas encore de vrai stockage de documents (pas de
    // MinIO branché, voir docs/ROADMAP.md) : cette méthode ne peut
    // donc pas encore transmettre une vraie image/PDF à Claude. Elle
    // reste fonctionnelle pour un texte déjà extrait, mais lève une
    // erreur explicite pour une URL de document réelle plutôt que de
    // prétendre avoir analysé quelque chose qu'elle n'a pas vu.
    throw new Error(
      "AnthropicProvider.analyzeDocument : pipeline de stockage/OCR non encore implémenté (voir docs/ROADMAP.md) — impossible de transmettre un vrai fichier à Claude pour l'instant."
    );
  }

  async embed(_input: EmbedInput): Promise<EmbedOutput> {
    // Anthropic ne propose pas d'API d'embeddings publique. Le
    // pipeline RAG de SCOLYRA n'est de toute façon pas encore branché
    // (voir docs/ROADMAP.md) — brancher un fournisseur d'embeddings
    // dédié (Voyage AI, OpenAI...) le moment venu plutôt que de
    // détourner ce provider pour ça.
    throw new Error(
      "AnthropicProvider.embed : Anthropic ne fournit pas d'API d'embeddings — configurer un fournisseur dédié (ex. Voyage AI) pour cette méthode."
    );
  }
}
