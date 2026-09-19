import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import argon2 from "argon2";
import { prisma } from "@scolyra/db";
import { checkRateLimit, resetRateLimit } from "./rate-limit";

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
  // Cookies explicitement durcis (httpOnly + sameSite=lax + secure en
  // production). next-auth applique déjà ces valeurs par défaut ; on
  // les rend explicites ici pour que ce ne soit jamais une régression
  // silencieuse lors d'une future modification.
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production" ? "__Secure-next-auth.session-token" : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
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
        const email = credentials.email.toLowerCase().trim();

        // Protection brute-force : 8 tentatives / 15 min par email visé.
        const rl = await checkRateLimit(`login:${email}`, 8, 15 * 60);
        if (!rl.allowed) {
          throw new Error(
            `Trop de tentatives pour ce compte. Réessaie dans ${Math.ceil((rl.retryAfterSeconds ?? 900) / 60)} min.`
          );
        }

        const user = await prisma.user.findUnique({
          where: { email },
          include: { profile: true },
        });
        // Toujours faire vérifier un hash, même si l'utilisateur n'existe
        // pas, pour que le temps de réponse ne révèle pas si l'email est
        // enregistré (mitigation basique de l'énumération de comptes).
        const dummyHash =
          "$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHRzb21lc2FsdA$Q2hhbmdlTWVQbGVhc2VDaGFuZ2VNZQ";
        const valid = await argon2.verify(user?.passwordHash ?? dummyHash, credentials.password).catch(() => false);
        if (!user || !valid) return null;

        await resetRateLimit(`login:${email}`);

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
  events: {
    async signIn({ user }) {
      await prisma.auditLog.create({ data: { userId: (user as { id: string }).id, action: "LOGIN" } }).catch(() => {});
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
