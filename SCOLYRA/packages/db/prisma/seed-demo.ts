/**
 * Seed de démonstration SCOLYRA.
 * Crée un compte élève fictif avec matières, notes, objectifs et
 * révisions — permet de naviguer l'app sans données réelles (§21).
 *
 * Lancer avec : pnpm run seed:demo
 */
import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await argon2.hash("demo-password-not-for-prod");

  const user = await prisma.user.upsert({
    where: { email: "demo@scolyra.app" },
    update: {},
    create: {
      email: "demo@scolyra.app",
      passwordHash,
      role: "STUDENT",
      isMinor: true,
      profile: {
        create: { firstName: "Léa", lastName: "Démo" },
      },
      studentProfile: {
        create: {
          schoolLevel: "LYCEE_TERMINALE",
          establishment: "Lycée démonstration (fictif)",
          weeklyAvailableMin: 480,
        },
      },
      subscription: {
        create: { plan: "FREE", status: "ACTIVE" },
      },
    },
  });

  const maths = await prisma.subject.upsert({
    where: { name: "Mathématiques" },
    update: {},
    create: { name: "Mathématiques", category: "Spécialité" },
  });

  await prisma.grade.create({
    data: {
      userId: user.id,
      subjectId: maths.id,
      value: 12.4,
      label: "DS probabilités (démo)",
    },
  });

  await prisma.goal.create({
    data: {
      userId: user.id,
      title: "Objectif 15+ en Mathématiques",
      subjectId: maths.id,
      targetValue: 15,
      currentValue: 12.4,
      status: "ACTIVE",
    },
  });

  console.log(`Seed de démonstration créé pour l'utilisateur ${user.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
