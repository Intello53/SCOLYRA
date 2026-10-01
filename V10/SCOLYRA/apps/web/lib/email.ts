/**
 * Service email minimal. Si RESEND_API_KEY est absent, les emails sont
 * simplement loggés en console au lieu d'être envoyés — conformément à
 * l'engagement du projet ("le développement doit fonctionner même sans
 * clé Resend", §26/docs/DEVELOPMENT.md). Aucun SDK Resend n'est importé
 * tant que la clé n'est pas présente, pour ne pas ajouter de dépendance
 * inutile à l'exécution en mode dev.
 */

type SendEmailInput = { to: string; subject: string; html: string; text: string };

export async function sendEmail(input: SendEmailInput): Promise<{ sent: boolean; mode: "resend" | "console" }> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log("\n[email:console] ── Aucun RESEND_API_KEY configuré, email simulé ──");
    console.log(`À : ${input.to}`);
    console.log(`Sujet : ${input.subject}`);
    console.log(input.text);
    console.log("──────────────────────────────────────────────────────\n");
    return { sent: false, mode: "console" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM ?? "SCOLYRA <no-reply@scolyra.app>",
        to: input.to,
        subject: input.subject,
        html: input.html,
        text: input.text,
      }),
    });
    if (!res.ok) {
      console.error("[email:resend] Échec de l'envoi :", await res.text().catch(() => res.statusText));
      return { sent: false, mode: "resend" };
    }
    return { sent: true, mode: "resend" };
  } catch (err) {
    console.error("[email:resend] Erreur réseau :", err);
    return { sent: false, mode: "resend" };
  }
}

export function guardianVerificationEmail(params: { studentFirstName: string; verifyUrl: string }) {
  const { studentFirstName, verifyUrl } = params;
  return {
    subject: `${studentFirstName} t'a désigné·e comme représentant légal sur SCOLYRA`,
    text: `Bonjour,\n\n${studentFirstName} utilise SCOLYRA (copilote scolaire et orientation) et vous a désigné·e comme représentant légal. Cette validation est nécessaire avant tout abonnement payant.\n\nPour confirmer, ouvrez ce lien (valable 48h) :\n${verifyUrl}\n\nSi vous n'êtes pas concerné·e par cette demande, ignorez cet email.`,
    html: `<p>Bonjour,</p><p><strong>${studentFirstName}</strong> utilise SCOLYRA (copilote scolaire et orientation) et vous a désigné·e comme représentant légal. Cette validation est nécessaire avant tout abonnement payant.</p><p><a href="${verifyUrl}">Confirmer que je suis le représentant légal</a> (lien valable 48h)</p><p>Si vous n'êtes pas concerné·e par cette demande, ignorez cet email.</p>`,
  };
}
