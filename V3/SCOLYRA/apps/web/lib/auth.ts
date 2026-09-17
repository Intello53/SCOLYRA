import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import argon2 from "argon2";
import { prisma } from "@scolyra/db";

/**
 * Authentification réelle de SCOLYRA — Credentials provider vérifié
 * contre la table User (mot de passe hashé Argon2id), session JWT
 * (pas de table Session en base, plus simple pour cette V0). Le rôle
 * (STUDENT/PARENT/ADMIN) est inclus dans le JWT et la session pour que
 * le middleware puisse protéger /admin sans requête supplémentaire.
 */
export const authOptions: AuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Email et mot de passe",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
          include: { profile: true },
        });
        if (!user) return null;

        const valid = await argon2.verify(user.passwordHash, credentials.password);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.profile?.firstName ?? user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = (user as { id: string }).id;
        token.role = (user as { role: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string; role?: string }).id = token.userId as string;
        (session.user as { id?: string; role?: string }).role = token.role as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
