import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

/**
 * Protection réelle des routes (résout le problème "/admin accessible
 * sans aucun code") :
 * - Les routes élève (/dashboard, /objectifs, etc.) exigent une session
 *   valide, sinon redirection vers /login.
 * - Les routes /admin/* exigent en plus le rôle ADMIN, sinon
 *   redirection vers /dashboard (pas de message d'erreur détaillé côté
 *   client, pour ne pas confirmer l'existence de la zone à un visiteur
 *   non autorisé).
 */
export default withAuth(
  function middleware(req) {
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin") || req.nextUrl.pathname.startsWith("/api/admin");
    const role = req.nextauth.token?.role;

    if (isAdminRoute && role !== "ADMIN") {
      // Les pages /admin/* redirigent vers le dashboard ; les appels
      // /api/admin/* renvoient un 403 JSON plutôt qu'une redirection
      // HTML (inutile pour un appel fetch()).
      if (req.nextUrl.pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
      }
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profil/:path*",
    "/matieres/:path*",
    "/objectifs/:path*",
    "/revisions/:path*",
    "/calendrier/:path*",
    "/documents/:path*",
    "/projets/:path*",
    "/orientation/:path*",
    "/coach/:path*",
    "/parametres/:path*",
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/account/:path*",
  ],
};
