import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireUser } from "../../lib/session";
import { isAwaitingGuardianApproval } from "../../lib/guardian";
import { GuardianPendingClient } from "../../components/guardian-pending-client";

export const metadata: Metadata = {
  title: "Accord parental requis",
  robots: { index: false, follow: false },
};

export default async function AccordParentalPage() {
  const user = await requireUser({ allowPendingGuardian: true });
  if (!(await isAwaitingGuardianApproval(user.id))) redirect("/dashboard");

  return (
    <main id="contenu" tabIndex={-1} className="mx-auto max-w-lg px-6 py-16 outline-none">
      <h1 className="font-display text-2xl text-ink-900 dark:text-white">Accord de ton représentant légal requis</h1>
      <p className="mt-3 text-sm text-ink-900/70 dark:text-white/70">
        Avant 15 ans, la loi demande l'accord d'un parent ou représentant légal pour utiliser un service comme SCOLYRA.
        Un e-mail contenant un lien de confirmation (valable 48 h) lui a été envoyé. Dès qu'il aura confirmé, recharge cette
        page : ton espace s'ouvrira.
      </p>
      <GuardianPendingClient />
    </main>
  );
}
