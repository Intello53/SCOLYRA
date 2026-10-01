# Système IA

## Abstraction

`packages/ai/src/types.ts` définit l'interface `AIProvider` :
`generateText`, `generateStructured`, `analyzeDocument`, `embed`.
`getAIProvider()` (`packages/ai/src/index.ts`) instancie le fournisseur
selon `process.env.AI_PROVIDER` (`mock` par défaut).

**Règle impérative (voir CLAUDE.md) : aucun code hors
`packages/ai/src/providers/` ne doit appeler un SDK IA directement.**

## Mode mock (par défaut, zéro configuration)

`AI_PROVIDER=mock` permet de faire tourner l'intégralité de l'app sans
clé API. Les réponses sont préfixées `[MOCK-...]` et volontairement
simples — le coach répond, mais ne "raisonne" pas vraiment. C'est le
mode par défaut, pensé pour développer/tester sans compte externe.

## Configurer un vrai fournisseur (Anthropic Claude) — étape par étape

Depuis cette version, `AnthropicProvider` est réellement implémenté
(avant, la ligne existait mais était commentée — rien n'était branché,
même en renseignant une clé). Voici comment l'activer :

1. Crée une clé API sur [console.anthropic.com](https://console.anthropic.com/settings/keys)
   (nécessite un compte Anthropic, facturation à l'usage).
2. Dans `.env` :
   ```bash
   AI_PROVIDER="anthropic"
   AI_API_KEY="sk-ant-..."
   ```
3. (Optionnel) Choisis les modèles utilisés pour chaque rôle — les
   valeurs par défaut conviennent pour commencer :
   ```bash
   AI_MODEL_FAST="claude-haiku-4-5-20251001"     # rôle "fast" — la majorité des appels
   AI_MODEL_POWERFUL="claude-sonnet-4-5"          # rôle "powerful" — raisonnement plus poussé
   ```
4. Redémarre `pnpm dev`. Le coach (`/coach`) et les agents
   (`packages/ai/src/agents/`) utiliseront désormais réellement Claude.
5. Si `AI_API_KEY` est vide alors que `AI_PROVIDER=anthropic`, l'app ne
   plante pas : elle retombe sur le mode mock avec un avertissement
   dans les logs du serveur (`[@scolyra/ai] ... repli sur le mode
   mock`) — vérifie ce log si le coach semble "ne pas être configuré".

### Ce qui fonctionne réellement avec Anthropic branché

- `generateText` (utilisé par tous les agents : Pedagogical, Objective,
  Revision, Orientation, Project) — appel réel à l'API Messages.
- `generateStructured` — demande du JSON strict par prompt et le parse ;
  si le modèle ne renvoie pas un JSON valide, l'erreur de parsing
  remonte telle quelle (pas d'objet vide silencieux).

### Ce qui ne fonctionne PAS encore, même avec Anthropic branché

- `analyzeDocument` (analyse de copies) — lève une erreur explicite :
  SCOLYRA n'a pas de pipeline de stockage/OCR réel (pas de MinIO
  branché, voir ROADMAP.md), donc il n'y a pas encore de vrai fichier
  à transmettre à Claude.
- `embed` — Anthropic ne propose pas d'API d'embeddings publique ; le
  pipeline RAG n'est de toute façon pas branché (ROADMAP.md). Un
  fournisseur dédié (ex. Voyage AI) serait nécessaire le jour où le RAG
  sera implémenté.

## Rôles

- `fast` — tâches simples (résumés courts, détection d'intention),
  mappé sur `AI_MODEL_FAST`.
- `powerful` — raisonnement plus complexe, mappé sur `AI_MODEL_POWERFUL`.
- `vision` — analyse de documents/copies scannées (actuellement mappé
  sur `AI_MODEL_FAST` faute de pipeline documents réel, voir ci-dessus).
- `embeddings` — vectorisation pour le RAG (non implémenté, voir ci-dessus).

## Agents (packages/ai/src/agents/)

| Agent | Rôle |
|---|---|
| `PedagogicalAgent` | Résume le profil pédagogique |
| `ObjectiveAgent` | Module "Objectif 15+" |
| `RevisionAgent` | Priorise les notions à réviser |
| `CopyAnalysisAgent` | Analyse une copie scannée (bloqué par `analyzeDocument`, voir ci-dessus) |
| `OrientationAgent` | Suggère des domaines (jamais de données officielles) |
| `ParcoursupAgent` | **Non implémenté** — voir ROADMAP.md V3 |
| `ProjectAgent` | Suggère les prochaines tâches d'un projet |

## Orchestrateur

`AIOrchestrator` (`packages/ai/src/orchestrator.ts`) route un message
vers l'agent pertinent. La détection d'intention est basée sur des
mots-clés simples — à améliorer avec `generateStructured` (classification)
une fois qu'on constate ses limites en usage réel.

## Coûts et quotas (§46)

Chaque appel via `/api/coach` est tracé dans `AIUsage` (userId, role,
promptTokens, outputTokens — les vrais tokens renvoyés par l'API
Anthropic une fois branché, pas une estimation). Aucune limite de
quota n'est encore appliquée automatiquement — à surveiller
manuellement via `/admin` en attendant.

## Dépannage

- **"Le coach ne répond qu'avec des messages [MOCK-...]"** : normal si
  `AI_PROVIDER=mock` (défaut). Vérifie `.env`.
- **"J'ai mis une clé mais rien ne change"** : vérifie que tu as bien
  redémarré `pnpm dev` après avoir modifié `.env`, et regarde les logs
  du terminal pour un éventuel avertissement `repli sur le mode mock`.
- **Erreur 401/403 côté Anthropic** : la clé est invalide/expirée ou le
  compte n'a pas de méthode de paiement active — vérifie sur
  console.anthropic.com.
