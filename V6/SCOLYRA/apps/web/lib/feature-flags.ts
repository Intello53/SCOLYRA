import { prisma } from "@scolyra/db";

/**
 * Clés de fonctionnalités pouvant être basculées Premium/Free depuis
 * /admin/fonctionnalites. Toute nouvelle fonctionnalité qui doit
 * pouvoir être gérée ainsi doit être ajoutée ici ET vérifiée via
 * `isFeatureAccessible()` à l'endroit où elle est utilisée.
 */
export const FEATURE_KEYS = {
  ORIENTATION_QUIZ: "orientation_quiz",
  COST_SIMULATOR: "cost_simulator",
  UNLIMITED_COPY_ANALYSIS: "unlimited_copy_analysis",
  ADVANCED_COACH: "advanced_coach",
} as const;

export type FeatureKey = (typeof FEATURE_KEYS)[keyof typeof FEATURE_KEYS];

export const FEATURE_DEFAULTS: { key: FeatureKey; label: string; description: string; premiumOnly: boolean }[] = [
  {
    key: FEATURE_KEYS.ORIENTATION_QUIZ,
    label: "Quiz d'orientation approfondi",
    description: "Questionnaire pondéré + contrainte géographique sur /orientation/quiz",
    premiumOnly: true,
  },
  {
    key: FEATURE_KEYS.COST_SIMULATOR,
    label: "Simulateur de coût des études",
    description: "Estimation budgétaire sur /orientation/simulateur-cout",
    premiumOnly: true,
  },
  {
    key: FEATURE_KEYS.UNLIMITED_COPY_ANALYSIS,
    label: "Analyse de copies illimitée",
    description: "Non encore implémenté techniquement — flag préparé pour la V+1",
    premiumOnly: true,
  },
  {
    key: FEATURE_KEYS.ADVANCED_COACH,
    label: "Coach IA — mode avancé",
    description: "Non encore implémenté techniquement — flag préparé pour la V+1",
    premiumOnly: true,
  },
];

/** Lit la config actuelle (crée les entrées manquantes avec leurs valeurs par défaut). */
export async function getFeatureFlags() {
  const existing = await prisma.featureFlag.findMany();
  const existingKeys = new Set(existing.map((f) => f.key));

  const missing = FEATURE_DEFAULTS.filter((d) => !existingKeys.has(d.key));
  if (missing.length > 0) {
    await prisma.featureFlag.createMany({ data: missing, skipDuplicates: true });
    return prisma.featureFlag.findMany({ orderBy: { label: "asc" } });
  }
  return existing.sort((a, b) => a.label.localeCompare(b.label));
}

/**
 * Vérifie si l'utilisateur peut accéder à une fonctionnalité : soit
 * elle n'est pas premiumOnly (accessible à tous), soit l'utilisateur
 * est Premium.
 */
export async function isFeatureAccessible(key: FeatureKey, userPlan: "FREE" | "PREMIUM"): Promise<boolean> {
  const flag = await prisma.featureFlag.findUnique({ where: { key } });
  const premiumOnly = flag?.premiumOnly ?? FEATURE_DEFAULTS.find((d) => d.key === key)?.premiumOnly ?? true;
  if (!premiumOnly) return true;
  return userPlan === "PREMIUM";
}
