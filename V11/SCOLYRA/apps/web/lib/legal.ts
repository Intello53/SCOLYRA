/**
 * SOURCE UNIQUE des informations légales de SCOLYRA.
 *
 * Toutes les pages légales (/mentions-legales, /confidentialite, /cgu,
 * /cgv, /cookies, /retractation, /accessibilite) lisent ce fichier.
 * Une valeur à `null` = information manquante : la page affiche un
 * repère visible « À COMPLÉTER » au lieu d'inventer quoi que ce soit.
 *
 * ⚠️ Renseigne UNIQUEMENT des informations exactes. Ce fichier n'a pas
 * été validé par un juriste — voir docs/CONFORMITE.md.
 */

export const LEGAL = {
  /** Version des textes, enregistrée dans le modèle Consent à l'inscription. */
  version: "2026-09-30-v2",
  lastUpdated: "30 septembre 2026",

  /** Éditeur du site (LCEN art. 6-III). */
  editor: {
    name: null as string | null, // nom/prénom (personne physique) ou dénomination (société, association)
    legalForm: null as string | null, // ex. « Entrepreneur individuel (micro-entreprise) », « SAS », « Association loi 1901 »
    address: null as string | null,
    phone: null as string | null,
    email: null as string | null, // aussi utilisé comme point de contact RGPD si dpo.email est vide
    siret: null as string | null, // SIREN/SIRET ou n° RNA pour une association
    registry: null as string | null, // ex. « RCS Paris B 123 456 789 » / « RNE » / « non immatriculé »
    shareCapital: null as string | null, // sociétés uniquement
    vatNumber: null as string | null, // n° de TVA intracommunautaire, si assujetti
    /** Mention TVA affichée sur les prix. Ex. « TVA non applicable, art. 293 B du CGI » (franchise en base). */
    vatMention: null as string | null,
    publicationDirector: null as string | null,
  },

  /** Hébergeur du site ET de la base de données (LCEN art. 6-III-2). */
  host: {
    name: null as string | null,
    address: null as string | null,
    phone: null as string | null,
    country: null as string | null, // pays d'hébergement des données (important pour les transferts hors UE)
  },

  /** Point de contact protection des données (DPO si désigné, sinon l'éditeur). */
  dpo: {
    designated: false, // true uniquement si un DPO a réellement été désigné
    name: null as string | null,
    email: null as string | null,
  },

  /** Médiateur de la consommation (Code de la consommation L612-1) — obligatoire pour vendre à des consommateurs. */
  mediator: {
    name: null as string | null,
    website: null as string | null,
    address: null as string | null,
  },

  /** Offre Premium (doit rester cohérente avec la page Tarifs et Stripe). */
  premium: {
    priceTtcEuros: "6,90",
    period: "mois",
    immediateAccess: true,
  },

  /**
   * Durées de conservation — valeurs PROPOSÉES (recommandations CNIL
   * usuelles). À confirmer/ajuster ; elles sont appliquées par
   * app/api/cron/purge.
   */
  retention: {
    inactiveAccountMonths: 24,
    securityLogsMonths: 12,
    supportTicketsMonthsAfterClose: 12,
    unverifiedGuardianDays: 7,
    invoicesYears: 10, // obligation comptable (Code de commerce L123-22)
  },

  /** Sous-traitants réellement utilisés par le code. */
  processors: {
    payments: { name: "Stripe Payments Europe, Ltd.", country: "Irlande", note: "Stripe Inc. (États-Unis) peut intervenir : transferts encadrés par les clauses contractuelles types / le Data Privacy Framework." },
    email: { name: "Resend", country: "États-Unis", note: "Envoi des e-mails transactionnels (invitation du représentant légal)." },
    ai: { name: "Anthropic", country: "États-Unis", note: "Uniquement si le fournisseur IA externe est activé." },
  },

  /** Médiation : la plateforme européenne de règlement en ligne des litiges (RLL) a fermé le 20 juillet 2025. */
  odrPlatformClosed: true,
} as const;

export type LegalConfig = typeof LEGAL;

/** Liste des champs obligatoires encore vides (utilisée par la vérification de build et les pages). */
export function missingLegalFields(): string[] {
  const missing: string[] = [];
  const need: [string, string | null][] = [
    ["editor.name", LEGAL.editor.name],
    ["editor.legalForm", LEGAL.editor.legalForm],
    ["editor.address", LEGAL.editor.address],
    ["editor.email", LEGAL.editor.email],
    ["editor.publicationDirector", LEGAL.editor.publicationDirector],
    ["host.name", LEGAL.host.name],
    ["host.address", LEGAL.host.address],
    ["host.country", LEGAL.host.country],
    ["mediator.name", LEGAL.mediator.name],
    ["mediator.website", LEGAL.mediator.website],
  ];
  for (const [k, v] of need) if (!v || !v.trim()) missing.push(k);
  return missing;
}

/** Adresse de contact pour l'exercice des droits RGPD. */
export function privacyContactEmail(): string | null {
  return LEGAL.dpo.email ?? LEGAL.editor.email;
}

/** Durée de session JWT de next-auth (défaut next-auth : 30 jours) — affichée dans la politique de cookies. */
export const SESSION_DAYS = 30;
