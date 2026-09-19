/**
 * Seed de référence (hors démo) : crée le référentiel de matières de base.
 * Lancer avec : pnpm run db:seed
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const BASE_SUBJECTS = [
  "Mathématiques",
  "Physique-Chimie",
  "SVT",
  "Français",
  "Philosophie",
  "Histoire-Géographie",
  "SES",
  "Anglais LLCE",
  "NSI",
];

// Dupliqué volontairement depuis apps/web/lib/feature-flags.ts (FEATURE_DEFAULTS) :
// ce script tourne dans packages/db, indépendamment de l'app Next.
const FEATURE_FLAGS = [
  {
    key: "orientation_quiz",
    label: "Quiz d'orientation approfondi",
    description: "Questionnaire pondéré + contrainte géographique sur /orientation/quiz",
    premiumOnly: true,
  },
  {
    key: "cost_simulator",
    label: "Simulateur de coût des études",
    description: "Estimation budgétaire sur /orientation/simulateur-cout",
    premiumOnly: true,
  },
  {
    key: "unlimited_copy_analysis",
    label: "Analyse de copies illimitée",
    description: "Non encore implémenté techniquement — flag préparé pour la V+1",
    premiumOnly: true,
  },
  {
    key: "advanced_coach",
    label: "Coach IA — mode avancé",
    description: "Non encore implémenté techniquement — flag préparé pour la V+1",
    premiumOnly: true,
  },
];

async function main() {
  for (const name of BASE_SUBJECTS) {
    await prisma.subject.upsert({
      where: { name_createdById: { name, createdById: null } },
      update: {},
      create: { name },
    });
  }
  console.log(`${BASE_SUBJECTS.length} matières de référence créées/vérifiées.`);

  for (const flag of FEATURE_FLAGS) {
    await prisma.featureFlag.upsert({
      where: { key: flag.key },
      update: {},
      create: flag,
    });
  }
  console.log(`${FEATURE_FLAGS.length} feature flags créés/vérifiés.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
