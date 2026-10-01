"use client";

import { useMemo, useState } from "react";

/**
 * Formulaire type de rétractation (modèle de l'annexe à l'article R221-1 du
 * Code de la consommation). Aucune donnée n'est envoyée à un serveur : le
 * texte est généré dans le navigateur puis ouvert dans le client de messagerie
 * de l'utilisateur, ou copié.
 */
export function RetractationForm({ recipient, sellerName, sellerAddress }: { recipient: string | null; sellerName: string; sellerAddress: string }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [accountEmail, setAccountEmail] = useState("");
  const [copied, setCopied] = useState(false);

  const today = new Date().toLocaleDateString("fr-FR");
  const body = useMemo(
    () =>
      `À l'attention de ${sellerName}, ${sellerAddress} :\n\n` +
      `Je vous notifie par la présente ma rétractation du contrat portant sur la prestation de services suivante : abonnement SCOLYRA Premium.\n\n` +
      `Commandé le : ${orderDate || "[date]"}\n` +
      `Adresse e-mail du compte : ${accountEmail || "[e-mail]"}\n` +
      `Nom du consommateur : ${name || "[nom]"}\n` +
      `Adresse du consommateur : ${address || "[adresse]"}\n\n` +
      `Date : ${today}`,
    [name, address, orderDate, accountEmail, sellerName, sellerAddress, today]
  );

  const mailto = recipient
    ? `mailto:${recipient}?subject=${encodeURIComponent("Rétractation — abonnement SCOLYRA Premium")}&body=${encodeURIComponent(body)}`
    : null;

  async function copy() {
    try {
      await navigator.clipboard.writeText(body);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }

  const field = "focus-ring w-full rounded-lg border border-ink-900/50 bg-white px-3 py-2 text-sm text-ink-900";
  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4" aria-describedby="retractation-aide">
      <p id="retractation-aide" className="text-sm">
        Remplis les champs ci-dessous : le texte de ta déclaration se met à jour. Rien n'est envoyé tant que tu n'as pas
        cliqué sur « Ouvrir dans ma messagerie ».
      </p>
      <div>
        <label htmlFor="r-name" className="mb-1.5 block text-sm font-medium text-ink-900">Nom et prénom</label>
        <input id="r-name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={field} />
      </div>
      <div>
        <label htmlFor="r-address" className="mb-1.5 block text-sm font-medium text-ink-900">Adresse postale</label>
        <input id="r-address" autoComplete="street-address" value={address} onChange={(e) => setAddress(e.target.value)} className={field} />
      </div>
      <div>
        <label htmlFor="r-email" className="mb-1.5 block text-sm font-medium text-ink-900">E-mail du compte SCOLYRA</label>
        <input id="r-email" type="email" autoComplete="email" value={accountEmail} onChange={(e) => setAccountEmail(e.target.value)} className={field} />
      </div>
      <div>
        <label htmlFor="r-date" className="mb-1.5 block text-sm font-medium text-ink-900">Date de la commande</label>
        <input id="r-date" type="date" value={orderDate} onChange={(e) => setOrderDate(e.target.value)} className={field} />
      </div>

      <div>
        <label htmlFor="r-preview" className="mb-1.5 block text-sm font-medium text-ink-900">Aperçu de la déclaration</label>
        <textarea id="r-preview" readOnly rows={10} value={body} className={`${field} font-mono text-xs`} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {mailto ? (
          <a href={mailto} className="focus-ring rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
            Ouvrir dans ma messagerie
          </a>
        ) : (
          <p role="note" className="text-sm text-amber-900">Adresse de contact non renseignée : copie le texte et envoie-le à l'éditeur.</p>
        )}
        <button type="button" onClick={copy} className="focus-ring rounded-lg border border-ink-900/30 px-4 py-2 text-sm font-medium text-ink-900 hover:bg-ink-900/5">
          Copier le texte
        </button>
        <span role="status" aria-live="polite" className="text-sm text-mastery-700">{copied ? "Texte copié." : ""}</span>
      </div>
    </form>
  );
}
