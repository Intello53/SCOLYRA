/**
 * Simulateur de coût des études — chiffres INDICATIFS compilés à partir
 * de sources publiques consultées en septembre 2026 : arrêté ministériel
 * des droits d'inscription 2025-2026 (licence 178€, master 254€, doctorat
 * 391€, CVEC 105€), Onisep/CIDJ, étude "coût de la rentrée étudiante
 * 2025" (La finance pour tous / UNEF/GAELIS), Diplomeo, Axiom Academic.
 *
 * Ce ne sont PAS des données officielles Parcoursup et ne doivent
 * jamais être présentées comme telles — uniquement une estimation pour
 * aider à planifier un budget. Les montants réels varient selon
 * l'établissement, la ville et la situation personnelle (bourse,
 * alternance...). Toujours vérifier auprès de l'établissement visé.
 */

export type FormationType = {
  code: string;
  label: string;
  annualTuitionMin: number;
  annualTuitionMax: number;
  note: string;
};

export const FORMATION_TYPES: FormationType[] = [
  { code: "UNIV_LICENCE", label: "Université — Licence / BUT (public)", annualTuitionMin: 178, annualTuitionMax: 285, note: "Droits + CVEC, arrêté 2025-2026" },
  { code: "BTS_PUBLIC", label: "BTS — lycée public", annualTuitionMin: 0, annualTuitionMax: 105, note: "Scolarité gratuite, CVEC seule" },
  { code: "BTS_PRIVE_CONTRAT", label: "BTS — privé sous contrat", annualTuitionMin: 1500, annualTuitionMax: 3000, note: "" },
  { code: "BTS_PRIVE_HORS_CONTRAT", label: "BTS — privé hors contrat", annualTuitionMin: 6000, annualTuitionMax: 10000, note: "" },
  { code: "CPGE_PUBLIQUE", label: "CPGE (prépa) — publique", annualTuitionMin: 0, annualTuitionMax: 105, note: "Scolarité gratuite (lycée), CVEC seule" },
  { code: "ECOLE_ING_PUBLIQUE", label: "École d'ingénieur — publique", annualTuitionMin: 610, annualTuitionMax: 3500, note: "Polytechnique : gratuit et rémunéré" },
  { code: "ECOLE_ING_PRIVEE", label: "École d'ingénieur — privée", annualTuitionMin: 5000, annualTuitionMax: 10000, note: "" },
  { code: "ECOLE_COMMERCE", label: "École de commerce", annualTuitionMin: 8000, annualTuitionMax: 18000, note: "Certains programmes jusqu'à 25 000€" },
  { code: "IEP_SCIENCESPO", label: "IEP / Sciences Po", annualTuitionMin: 0, annualTuitionMax: 14500, note: "Barème progressif selon revenus familiaux" },
  { code: "SANTE_PASS_LAS", label: "Santé (PASS/LAS) — université", annualTuitionMin: 178, annualTuitionMax: 285, note: "" },
];

export type HousingType = {
  code: string;
  label: string;
  monthlyRent: number;
  note: string;
};

export const HOUSING_TYPES: HousingType[] = [
  { code: "CHEZ_PARENTS", label: "Chez les parents", monthlyRent: 0, note: "" },
  { code: "CROUS", label: "Résidence CROUS", monthlyRent: 250, note: "Places limitées (≈1 pour 17 étudiants), sous conditions" },
  { code: "VILLE_MOYENNE", label: "Location — ville moyenne", monthlyRent: 500, note: "" },
  { code: "GRANDE_VILLE", label: "Location — grande ville de province", monthlyRent: 600, note: "" },
  { code: "PARIS", label: "Location — Paris / petite couronne", monthlyRent: 800, note: "" },
];

export const MONTHLY_LIVING_COST_EXCL_HOUSING = 480; // alimentation, transport, divers — estimation médiane

export const SCHOLARSHIP_ANNUAL_RANGE = { min: 1454, max: 6335 }; // bourse CROUS 2025-2026, échelons 0bis à 7

export function simulateCost(input: {
  formationCode: string;
  housingCode: string;
  years: number;
  isScholarshipHolder: boolean;
}) {
  const formation = FORMATION_TYPES.find((f) => f.code === input.formationCode);
  const housing = HOUSING_TYPES.find((h) => h.code === input.housingCode);
  if (!formation || !housing) return null;

  const tuitionMid = (formation.annualTuitionMin + formation.annualTuitionMax) / 2;
  const annualHousing = housing.monthlyRent * 12;
  const annualLiving = MONTHLY_LIVING_COST_EXCL_HOUSING * 12;
  const annualScholarship = input.isScholarshipHolder
    ? (SCHOLARSHIP_ANNUAL_RANGE.min + SCHOLARSHIP_ANNUAL_RANGE.max) / 2
    : 0;

  const annualTotalGross = tuitionMid + annualHousing + annualLiving;
  const annualTotalNet = Math.max(0, annualTotalGross - annualScholarship);

  return {
    formation,
    housing,
    tuitionMid: Math.round(tuitionMid),
    annualHousing,
    annualLiving,
    annualScholarship: Math.round(annualScholarship),
    annualTotalGross: Math.round(annualTotalGross),
    annualTotalNet: Math.round(annualTotalNet),
    totalOverYears: Math.round(annualTotalNet * input.years),
    years: input.years,
  };
}
