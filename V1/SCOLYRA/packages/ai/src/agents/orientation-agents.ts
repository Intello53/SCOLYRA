import { getAIProvider } from "../index";

/**
 * OrientationAgent — aide à structurer les domaines/formations envisagés
 * à partir du profil pédagogique. Ne génère AUCUNE donnée officielle
 * (formations, prérequis) : ce sont des champs à importer depuis des
 * sources vérifiées (voir Formation.sourceUrl dans le schéma Prisma, §19/§47).
 */
export class OrientationAgent {
  private provider = getAIProvider();

  async suggestFields(input: {
    userId: string;
    strengths: string[];
    interests: string[];
  }) {
    await this.provider.generateText({
      role: "fast",
      system:
        "Suggère des DOMAINES généraux (pas de noms d'établissements ni de statistiques officielles) à partir des points forts et centres d'intérêt.",
      prompt: JSON.stringify(input),
      userId: input.userId,
    });
    return {
      suggestedDomains: input.interests.slice(0, 3),
      disclaimer:
        "Suggestions génériques. Les données de formations/écoles doivent provenir d'une source officielle vérifiée (TODO import).",
    };
  }
}

/**
 * ParcoursupAgent — architecture prête pour une future intégration
 * Parcoursup. AUCUN appel réel n'est implémenté en V0 (pas d'API
 * publique stable généralisée) : voir docs/ROADMAP.md, V3.
 */
export class ParcoursupAgent {
  async syncApplications(_userId: string): Promise<never> {
    throw new Error(
      "ParcoursupAgent.syncApplications: NON IMPLÉMENTÉ — intégration prévue en V3 (docs/ROADMAP.md). Nécessite une source de données officielle."
    );
  }
}

/** ProjectAgent — assistant IA pour l'espace projets (§18). */
export class ProjectAgent {
  private provider = getAIProvider();

  async suggestNextTasks(input: {
    userId: string;
    projectTitle: string;
    existingTasks: string[];
  }) {
    const result = await this.provider.generateText({
      role: "fast",
      system: "Propose 2 à 4 prochaines tâches concrètes pour ce projet étudiant.",
      prompt: `Projet: ${input.projectTitle}. Tâches existantes: ${input.existingTasks.join(", ") || "aucune"}.`,
      userId: input.userId,
    });
    return { suggestion: result.text };
  }
}
