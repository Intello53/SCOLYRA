# Système IA

## Abstraction

`packages/ai/src/types.ts` définit l'interface `AIProvider` :
`generateText`, `generateStructured`, `analyzeDocument`, `embed`.
`getAIProvider()` (`packages/ai/src/index.ts`) instancie le fournisseur
selon `process.env.AI_PROVIDER` (`mock` par défaut).

**Règle impérative (voir CLAUDE.md) : aucun code hors
`packages/ai/src/providers/` ne doit appeler un SDK IA directement.**

## Rôles

- `fast` — tâches simples (résumés courts, détection d'intention).
- `powerful` — raisonnement plus complexe.
- `vision` — analyse de documents/copies scannées.
- `embeddings` — vectorisation pour le RAG.

## Agents (packages/ai/src/agents/)

| Agent | Rôle |
|---|---|
| `PedagogicalAgent` | Résume le profil pédagogique |
| `ObjectiveAgent` | Module "Objectif 15+" |
| `RevisionAgent` | Priorise les notions à réviser |
| `CopyAnalysisAgent` | Analyse une copie scannée |
| `OrientationAgent` | Suggère des domaines (jamais de données officielles) |
| `ParcoursupAgent` | **Non implémenté** — voir ROADMAP.md V3 |
| `ProjectAgent` | Suggère les prochaines tâches d'un projet |

## Orchestrateur

`AIOrchestrator` (`packages/ai/src/orchestrator.ts`) route un message
vers l'agent pertinent. La détection d'intention V0 est basée sur des
mots-clés simples — à remplacer par `generateStructured` + schéma Zod
dès qu'un fournisseur réel est branché.

## Mode mock

`AI_PROVIDER=mock` (valeur par défaut) permet de faire tourner
l'intégralité de l'app sans clé API. Les réponses sont préfixées
`[MOCK-...]` pour rester clairement identifiables.

## Coûts et quotas (§46)

Chaque appel doit être tracé dans le modèle `AIUsage` (userId, role,
promptTokens, outputTokens, costCents). Cette instrumentation n'est pas
encore branchée dans les agents V0 — à ajouter lors de l'intégration
d'un vrai fournisseur (voir ROADMAP.md).

## Brancher un fournisseur réel

1. Créer `packages/ai/src/providers/mon-provider.ts` implémentant
   `AIProvider`.
2. L'ajouter au `switch` de `getAIProvider()`.
3. Renseigner `AI_API_KEY` et `AI_PROVIDER` dans `.env`.
