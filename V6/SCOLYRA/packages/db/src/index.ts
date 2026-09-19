import { PrismaClient } from "@prisma/client";

/**
 * Singleton PrismaClient — en dev, Next.js recharge les modules à chaud
 * ce qui recréerait une connexion à chaque changement de fichier sans
 * cette précaution (globalThis survit au hot-reload, contrairement à
 * une variable de module classique).
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export * from "@prisma/client";
