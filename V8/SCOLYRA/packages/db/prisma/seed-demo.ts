/**
 * Seed de démonstration SCOLYRA — crée deux comptes RÉELS et
 * utilisables (mots de passe hashés Argon2id, pas des mocks) :
 *  - un compte élève : demo@scolyra.app / demo12345
 *  - un compte admin  : admin@scolyra.app / admin12345
 *
 * Lancer avec : pnpm run seed:demo
 */
import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";

const prisma = new PrismaClient();

async function main() {
  // --- Compte élève de démonstration -----------------------------------
  const studentPasswordHash = await argon2.hash("demo12345");

  const student = await prisma.user.upsert({
    where: { email: "demo@scolyra.app" },
    update: {},
    create: {
      email: "demo@scolyra.app",
      passwordHash: studentPasswordHash,
      role: "STUDENT",
      isMinor: true,
      profile: { create: { firstName: "Léa", lastName: "Démo" } },
      studentProfile: {
        create: {
          schoolLevel: "LYCEE_TERMINALE",
          establishment: "Lycée démonstration (fictif)",
          weeklyAvailableMin: 480,
          specialties: ["MATHEMATIQUES", "PHYSIQUE_CHIMIE"],
          options: ["MATHS_EXPERTES"],
        },
      },
      subscription: { create: { plan: "FREE", status: "ACTIVE" } },
      orientationProfile: { create: { desiredFields: "Écoles d'ingénieur, CPGE MPSI" } },
    },
    include: { studentProfile: true },
  });

  const maths = await prisma.subject.upsert({
    where: { name_createdById: { name: "Mathématiques", createdById: null } },
    update: {},
    create: { name: "Mathématiques", category: "Spécialité" },
  });

  if (student.studentProfile) {
    await prisma.userSubject.upsert({
      where: { studentProfileId_subjectId: { studentProfileId: student.studentProfile.id, subjectId: maths.id } },
      update: {},
      create: {
        studentProfileId: student.studentProfile.id,
        subjectId: maths.id,
        isSpecialty: true,
        includeInAverage: true,
      },
    });
  }

  await prisma.grade.create({
    data: {
      userId: student.id,
      subjectId: maths.id,
      value: 12.4,
      label: "DS probabilités (démo)",
    },
  });

  await prisma.goal.create({
    data: {
      userId: student.id,
      title: "Objectif 15+ en Mathématiques",
      subjectId: maths.id,
      targetValue: 15,
      currentValue: 12.4,
      status: "ACTIVE",
      milestones: [
        { label: "Palier 1 — viser 13.1/20", done: true },
        { label: "Palier 2 — viser 13.8/20", done: false },
        { label: "Palier 3 — viser 14.4/20", done: false },
        { label: "Palier 4 — viser 15/20", done: false },
      ],
    },
  });

  // --- Compte administrateur --------------------------------------------
  const adminPasswordHash = await argon2.hash("admin12345");

  await prisma.user.upsert({
    where: { email: "admin@scolyra.app" },
    update: {},
    create: {
      email: "admin@scolyra.app",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      isMinor: false,
      profile: { create: { firstName: "Admin" } },
    },
  });

  console.log("Comptes de démonstration créés :");
  console.log("  Élève : demo@scolyra.app / demo12345");
  console.log("  Admin : admin@scolyra.app / admin12345");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
