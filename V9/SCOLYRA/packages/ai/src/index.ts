import type { AIProvider } from "./types";
import { MockAIProvider } from "./providers/mock-provider";
import { AnthropicProvider } from "./providers/anthropic-provider";

export * from "./types";
export * from "./orchestrator";

/**
 * getAIProvider — point d'entrée unique pour obtenir un fournisseur IA.
 *
 * Lit process.env.AI_PROVIDER ("mock" par défaut). Voir docs/AI.md
 * pour la configuration complète du fournisseur Anthropic.
 */
export function getAIProvider(): AIProvider {
  const providerName = process.env.AI_PROVIDER ?? "mock";

  switch (providerName) {
    case "mock":
      return new MockAIProvider();

    case "anthropic": {
      const apiKey = process.env.AI_API_KEY;
      if (!apiKey) {
        console.warn(
          '[@scolyra/ai] AI_PROVIDER=anthropic mais AI_API_KEY est vide — repli sur le mode mock. Voir docs/AI.md.'
        );
        return new MockAIProvider();
      }
      return new AnthropicProvider(apiKey);
    }

    default:
      console.warn(
        `[@scolyra/ai] Fournisseur "${providerName}" inconnu — repli sur le mode mock.`
      );
      return new MockAIProvider();
  }
}
