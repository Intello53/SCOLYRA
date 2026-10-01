import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./auth";
import { isAwaitingGuardianApproval } from "./guardian";

type SessionUser = { id: string; email: string; name?: string | null; role: string };

/**
 * Utilisateur connecté, ou null.
 *
 * Un élève de moins de 15 ans dont le représentant légal n'a pas encore
 * confirmé son accord est traité comme NON autorisé sur toutes les routes
 * de données (il n'obtient que l'écran d'attente, l'export, la suppression
 * et le renvoi d'invitation, qui passent `allowPendingGuardian: true`).
 */
export async function getCurrentUser(opts?: { allowPendingGuardian?: boolean }): Promise<SessionUser | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  const user = session.user as SessionUser;
  if (!opts?.allowPendingGuardian && user.role === "STUDENT" && (await isAwaitingGuardianApproval(user.id))) {
    return null;
  }
  return user;
}

/**
 * À utiliser dans les Server Components des pages déjà protégées par le
 * middleware. Redirige vers /login (pas de session) ou vers l'écran
 * d'attente d'accord parental.
 */
export async function requireUser(opts?: { allowPendingGuardian?: boolean }) {
  const user = await getCurrentUser({ allowPendingGuardian: true });
  if (!user) redirect("/login");
  if (!opts?.allowPendingGuardian && user.role === "STUDENT" && (await isAwaitingGuardianApproval(user.id))) {
    redirect("/accord-parental");
  }
  return user;
}

/** Filet de sécurité identique pour les routes /admin (le middleware protège déjà en première ligne). */
export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN") redirect("/dashboard");
  return user;
}
