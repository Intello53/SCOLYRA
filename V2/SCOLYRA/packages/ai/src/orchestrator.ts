import { PedagogicalAgent } from "./agents/pedagogical-agent";
import { ObjectiveAgent } from "./agents/objective-agent";
import { RevisionAgent } from "./agents/revision-agent";
import { CopyAnalysisAgent } from "./agents/copy-analysis-agent";
import { OrientationAgent, ProjectAgent } from "./agents/orientation-agents";

/**
 * AIOrchestrator — point d'entrée unique pour router un message
 * utilisateur (coach IA) vers l'agent spécialisé pertinent (§13).
 *
 * Détection d'intention V0 : mots-clés simples. À remplacer par une
 * vraie classification (generateStructured + schéma Zod) dès qu'un
 * fournisseur IA réel est branché — voir docs/AI.md.
 */
export type AgentName =
  | "pedagogical"
  | "objective"
  | "revision"
  | "copyAnalysis"
  | "orientation"
  | "project";

export class AIOrchestrator {
  private agents = {
    pedagogical: new PedagogicalAgent(),
    objective: new ObjectiveAgent(),
    revision: new RevisionAgent(),
    copyAnalysis: new CopyAnalysisAgent(),
    orientation: new OrientationAgent(),
    project: new ProjectAgent(),
  };

  detectIntent(message: string): AgentName {
    const m = message.toLowerCase();
    if (m.includes("objectif") || m.includes("moyenne")) return "objective";
    if (m.includes("révis") || m.includes("revis")) return "revision";
    if (m.includes("copie") || m.includes("correction")) return "copyAnalysis";
    if (m.includes("orientation") || m.includes("formation") || m.includes("parcoursup"))
      return "orientation";
    if (m.includes("projet")) return "project";
    return "pedagogical";
  }

  getAgent(name: AgentName) {
    return this.agents[name];
  }
}
