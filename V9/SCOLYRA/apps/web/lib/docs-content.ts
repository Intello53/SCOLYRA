export type DocBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "code"; lang: string; code: string }
  | { type: "list"; items: string[] }
  | { type: "note"; tone: "info" | "warn"; text: string }
  | { type: "table"; headers: string[]; rows: string[][] };

export type DocChapter = {
  slug: string;
  section: string;
  title: string;
  summary: string;
  blocks: DocBlock[];
};

export const DOC_CHAPTERS: DocChapter[] = [
  {
    slug: "demarrage-rapide",
    section: "Prise en main",
    title: "Démarrage rapide",
    summary: "Lancer SCOLYRA en local en moins de 10 minutes.",
    blocks: [
      { type: "p", text: "Vérifie d'abord ce qui est déjà installé — inutile de réinstaller ce que tu as déjà." },
      {
        type: "code",
        lang: "bash",
        code: "git --version\nnode --version\npnpm --version\ndocker --version\ndocker compose version",
      },
      { type: "h2", text: "Installer et lancer" },
      {
        type: "code",
        lang: "bash",
        code: "git clone <url-de-votre-dépôt> SCOLYRA\ncd SCOLYRA\npnpm install\ncp .env.example .env\ndocker compose -f infra/docker-compose.yml up -d\npnpm db:migrate\npnpm db:seed\npnpm seed:demo\npnpm dev",
      },
      {
        type: "note",
        tone: "info",
        text: "Ouvre http://localhost:3000/dashboard — les données affichées sont fictives, aucune clé API externe n'est requise (AI_PROVIDER=mock par défaut).",
      },
    ],
  },
  {
    slug: "installation",
    section: "Prise en main",
    title: "Installation détaillée (Fedora)",
    summary: "Chaque étape, avec les commandes exactes pour Fedora.",
    blocks: [
      { type: "h2", text: "Outils de base" },
      { type: "code", lang: "bash", code: "sudo dnf upgrade --refresh -y\nsudo dnf install -y git curl" },
      { type: "h2", text: "Node.js 20+" },
      {
        type: "code",
        lang: "bash",
        code: "curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -\nsudo dnf install -y nodejs",
      },
      { type: "h2", text: "pnpm" },
      { type: "code", lang: "bash", code: "corepack enable\ncorepack prepare pnpm@9.9.0 --activate" },
      {
        type: "note",
        tone: "warn",
        text: "Ne lance jamais de commande destructrice sans avoir compris ce qu'elle fait. Aucune commande de ce tutoriel ne supprime une installation existante.",
      },
    ],
  },
  {
    slug: "architecture",
    section: "Comprendre le projet",
    title: "Architecture",
    summary: "Le monorepo, ses packages, et pourquoi ils sont séparés ainsi.",
    blocks: [
      {
        type: "p",
        text: "SCOLYRA sépare la présentation (apps/web), le schéma de données (packages/db) et toute la logique IA (packages/ai), pour que chaque partie puisse évoluer indépendamment.",
      },
      {
        type: "table",
        headers: ["Dossier", "Rôle"],
        rows: [
          ["apps/web", "Application Next.js — présentation uniquement"],
          ["packages/db", "Schéma Prisma, migrations, seeds"],
          ["packages/ai", "Abstraction AI_PROVIDER, agents, orchestrateur"],
          ["infra/", "docker-compose (Postgres, Redis, MinIO)"],
          ["docs/", "Documentation source, affichée sur /docs"],
        ],
      },
      { type: "h2", text: "Flux du coach IA" },
      {
        type: "code",
        lang: "text",
        code: "Message utilisateur\n  → AIOrchestrator.detectIntent()\n  → Agent spécialisé\n  → Profil pédagogique\n  → AIProvider.generateText()\n  → Réponse → UI",
      },
    ],
  },
  {
    slug: "base-de-donnees",
    section: "Comprendre le projet",
    title: "Base de données",
    summary: "Les 30 entités du schéma Prisma et leurs rôles.",
    blocks: [
      { type: "h2", text: "Groupes d'entités" },
      {
        type: "list",
        items: [
          "Identité & profil : User, Profile, StudentProfile, LegalGuardianLink",
          "Pédagogie : Subject, UserSubject, Skill, UserSkill, Grade, Assessment, Mistake",
          "Objectifs & travail : Goal, StudySession, RevisionPlan, RevisionSession",
          "Documents / RAG : Document, DocumentChunk (vector(1536)), Course",
          "Projets : Project, ProjectTask",
          "Orientation : OrientationProfile, Formation, Application, Deadline",
          "Facturation : Subscription, Payment",
          "IA : AIConversation, AIMessage, AIUsage",
          "Conformité : AuditLog, Consent",
        ],
      },
      {
        type: "note",
        tone: "warn",
        text: "Formation ne contient jamais de données réelles pré-remplies. Le champ sourceUrl trace l'origine d'un futur import vérifié.",
      },
    ],
  },
  {
    slug: "systeme-ia",
    section: "Comprendre le projet",
    title: "Système IA",
    summary: "L'abstraction AI_PROVIDER, les agents, et le mode mock.",
    blocks: [
      {
        type: "p",
        text: "Aucun code hors packages/ai/src/providers/ ne doit appeler un SDK IA directement. Tout passe par getAIProvider().",
      },
      {
        type: "table",
        headers: ["Agent", "Rôle"],
        rows: [
          ["PedagogicalAgent", "Résume le profil pédagogique"],
          ["ObjectiveAgent", "Module Objectif 15+"],
          ["RevisionAgent", "Priorise les notions à réviser"],
          ["CopyAnalysisAgent", "Analyse une copie scannée"],
          ["OrientationAgent", "Suggère des domaines (jamais de données officielles)"],
          ["ParcoursupAgent", "Non implémenté — voir Roadmap V3"],
          ["ProjectAgent", "Suggère les prochaines tâches d'un projet"],
        ],
      },
      {
        type: "code",
        lang: "typescript",
        code: 'export function getAIProvider(): AIProvider {\n  const providerName = process.env.AI_PROVIDER ?? "mock";\n  switch (providerName) {\n    case "mock":\n      return new MockAIProvider();\n    default:\n      return new MockAIProvider();\n  }\n}',
      },
    ],
  },
  {
    slug: "ajouter-un-agent",
    section: "Guides pratiques",
    title: "Ajouter un agent IA",
    summary: "Créer, enregistrer et router un nouvel agent.",
    blocks: [
      {
        type: "list",
        items: [
          "Créer packages/ai/src/agents/mon-agent.ts, une classe qui utilise getAIProvider()",
          "L'enregistrer dans AIOrchestrator (packages/ai/src/orchestrator.ts)",
          "Ajouter une détection d'intention dans detectIntent()",
        ],
      },
      {
        type: "code",
        lang: "typescript",
        code: 'export class MonAgent {\n  private provider = getAIProvider();\n\n  async run(input: { userId: string }) {\n    return this.provider.generateText({\n      role: "fast",\n      prompt: "…",\n      userId: input.userId,\n    });\n  }\n}',
      },
    ],
  },
  {
    slug: "modifier-le-dashboard",
    section: "Guides pratiques",
    title: "Modifier le dashboard",
    summary: "Passer des données de démo aux vraies requêtes Prisma.",
    blocks: [
      {
        type: "p",
        text: "Le dashboard démo lit apps/web/lib/demo-data.ts. Pour le connecter à de vraies données, remplace ces imports par des requêtes Prisma (@scolyra/db) dans un composant serveur.",
      },
      {
        type: "code",
        lang: "typescript",
        code: 'import { prisma } from "@scolyra/db";\n\nconst goals = await prisma.goal.findMany({\n  where: { userId: session.userId, status: "ACTIVE" },\n});',
      },
    ],
  },
  {
    slug: "securite",
    section: "Guides pratiques",
    title: "Sécurité & RGPD",
    summary: "Isolation des données, mineurs, conformité.",
    blocks: [
      {
        type: "note",
        tone: "warn",
        text: "La conformité juridique et RGPD doit être validée par un professionnel compétent avant toute commercialisation. La présence de modèles techniques (Consent, LegalGuardianLink) ne constitue pas, en soi, une conformité.",
      },
      {
        type: "list",
        items: [
          "Chaque requête doit filtrer explicitement par userId côté serveur",
          "Un compte isMinor=true ne peut jamais initier un paiement sans LegalGuardianLink vérifié",
          "Toute entrée utilisateur est validée avec Zod côté serveur",
        ],
      },
    ],
  },
  {
    slug: "depannage",
    section: "Référence",
    title: "Dépannage",
    summary: "Les problèmes les plus courants et leur solution.",
    blocks: [
      { type: "h2", text: "Erreur de connexion à PostgreSQL" },
      {
        type: "code",
        lang: "bash",
        code: "docker compose -f infra/docker-compose.yml ps\ndocker compose -f infra/docker-compose.yml logs postgres",
      },
      { type: "h2", text: "Le coach IA répond de façon très simple" },
      {
        type: "p",
        text: "C'est normal en mode AI_PROVIDER=mock (par défaut) : les réponses sont volontairement simplifiées et préfixées [MOCK-...].",
      },
    ],
  },
  {
    slug: "roadmap",
    section: "Référence",
    title: "Roadmap",
    summary: "V0, V1, V2, V3 — ce qui vient ensuite.",
    blocks: [
      { type: "h2", text: "V1" },
      { type: "list", items: ["Pipeline RAG complet", "Analyse de copies fonctionnelle", "Projets : UI complète"] },
      { type: "h2", text: "V2" },
      { type: "list", items: ["Import de formations vérifiées", "Stripe fonctionnel", "Notifications"] },
      { type: "h2", text: "V3" },
      { type: "list", items: ["Intégration Parcoursup", "Mémoire longue durée du coach IA"] },
    ],
  },
  {
    slug: "etat-du-projet",
    section: "Référence",
    title: "État du projet",
    summary: "Ce qui est terminé, partiel, ou non implémenté — sans enjolivement.",
    blocks: [
      { type: "h2", text: "Terminé" },
      {
        type: "list",
        items: [
          "Schéma Prisma complet",
          "Abstraction IA + agents + orchestrateur",
          "Dashboard démo fonctionnel",
          "Documentation complète",
        ],
      },
      { type: "h2", text: "Non implémenté" },
      {
        type: "list",
        items: ["Authentification réelle", "Stripe", "Pipeline RAG réel", "Tests automatisés"],
      },
    ],
  },
];

export function getChapterBySlug(slug: string) {
  return DOC_CHAPTERS.find((c) => c.slug === slug);
}

export function getChapterNeighbors(slug: string) {
  const index = DOC_CHAPTERS.findIndex((c) => c.slug === slug);
  return {
    prev: index > 0 ? DOC_CHAPTERS[index - 1] : null,
    next: index < DOC_CHAPTERS.length - 1 ? DOC_CHAPTERS[index + 1] : null,
  };
}
