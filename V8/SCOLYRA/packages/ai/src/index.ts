import type { AIProvider } from "./types";
import { MockAIProvider } from "./providers/mock-provider";

export * from "./types";
export * from "./orchestrator";

/**
 * getAIProvider — point d'entrée unique pour obtenir un fournisseur IA.
 *
 * Lit process.env.AI_PROVIDER ("mock" par défaut). Pour brancher un
 * vrai fournisseur (Anthropic, OpenAI, Gemini...), créer un fichier
 * providers/<nom>-provider.ts implémentant AIProvider et l'ajouter
 * au switch ci-dessous. Aucun autre fichier du projet ne doit importer
 * un SDK IA directement.
 */
export function getAIProvider(): AIProvider {
  const providerName = process.env.AI_PROVIDER ?? "mock";

  switch (providerName) {
    case "mock":
      return new MockAIProvider();

    // case "anthropic":
    //   return new AnthropicProvider(process.env.AI_API_KEY);

    default:
      console.warn(
        `[@scolyra/ai] Fournisseur "${providerName}" inconnu — repli sur le mode mock.`
      );
      return new MockAIProvider();
  }
}
