import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./auth";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  return session.user as { id: string; email: string; name?: string | null; role: string };
}

/**
 * À utiliser dans les Server Components des pages déjà protégées par le
 * middleware. Redirige vers /login au lieu de planter si jamais cette
 * page était atteinte sans session (filet de sécurité, pas la
 * protection principale — voir middleware.ts).
 */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}
