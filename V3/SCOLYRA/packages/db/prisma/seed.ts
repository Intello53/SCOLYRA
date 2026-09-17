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

async function main() {
  for (const name of BASE_SUBJECTS) {
    await prisma.subject.upsert({
      where: { name_createdById: { name, createdById: null } },
      update: {},
      create: { name },
    });
  }
  console.log(`${BASE_SUBJECTS.length} matières de référence créées/vérifiées.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
