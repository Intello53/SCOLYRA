/**
 * Référentiel du système scolaire français utilisé par l'onboarding.
 *
 * Sources (consultées en septembre 2026) : education.gouv.fr ("Les
 * choix d'enseignements de spécialité et d'enseignements optionnels à
 * la rentrée 2025", Note d'Information n°26-06 DEPP ; "Choisir ses
 * enseignements de spécialité au lycée" ; "Les programmes du lycée
 * général et technologique"), onisep.fr, Wikipédia ("Enseignement de
 * spécialité").
 *
 * Ce référentiel couvre la voie GÉNÉRALE (collège + lycée général).
 * La voie technologique (STMG, STI2D, ST2S...) et professionnelle ne
 * sont pas couvertes en V0 — voir docs/ROADMAP.md.
 *
 * Les intitulés et l'offre réelle varient selon l'établissement
 * (toutes les spécialités/options ne sont pas proposées partout) :
 * ce référentiel liste ce qui EXISTE nationalement, pas ce qui est
 * garanti disponible dans un lycée donné.
 */

export type SchoolLevelCode =
  | "COLLEGE_6E"
  | "COLLEGE_5E"
  | "COLLEGE_4E"
  | "COLLEGE_3E"
  | "LYCEE_2NDE"
  | "LYCEE_1ERE"
  | "LYCEE_TERMINALE"
  | "POST_BAC";

export type CurriculumItem = { code: string; label: string; note?: string };

export type LevelDefinition = {
  code: SchoolLevelCode;
  label: string;
  stage: "college" | "lycee" | "post-bac";
  hasOptions: boolean;
  hasSpecialties: boolean;
  optionsNote?: string;
  specialtiesNote?: string;
};

export const SCHOOL_LEVELS: LevelDefinition[] = [
  { code: "COLLEGE_6E", label: "6e", stage: "college", hasOptions: true, hasSpecialties: false },
  { code: "COLLEGE_5E", label: "5e", stage: "college", hasOptions: true, hasSpecialties: false },
  { code: "COLLEGE_4E", label: "4e", stage: "college", hasOptions: true, hasSpecialties: false },
  { code: "COLLEGE_3E", label: "3e", stage: "college", hasOptions: true, hasSpecialties: false },
  {
    code: "LYCEE_2NDE",
    label: "2de générale et technologique",
    stage: "lycee",
    hasOptions: true,
    hasSpecialties: false,
    specialtiesNote:
      "Il n'y a pas de spécialités en 2de : elles se choisissent pour l'entrée en 1re.",
  },
  {
    code: "LYCEE_1ERE",
    label: "1re générale",
    stage: "lycee",
    hasOptions: true,
    hasSpecialties: true,
    specialtiesNote: "3 spécialités à choisir en 1re (4h/semaine chacune).",
  },
  {
    code: "LYCEE_TERMINALE",
    label: "Terminale générale",
    stage: "lycee",
    hasOptions: true,
    hasSpecialties: true,
    specialtiesNote: "2 des 3 spécialités de 1re sont conservées en terminale (6h/semaine chacune).",
  },
  { code: "POST_BAC", label: "Post-bac", stage: "post-bac", hasOptions: false, hasSpecialties: false },
];

// ---------------------------------------------------------------------
// Options par niveau
// ---------------------------------------------------------------------

export const COLLEGE_OPTIONS: CurriculumItem[] = [
  { code: "BILANGUE", label: "Classe bilangue (2 langues vivantes dès la 6e)", note: "Selon établissement" },
  { code: "LCA_LATIN", label: "Latin (LCA)", note: "Généralement à partir de la 5e" },
  { code: "LCA_GREC", label: "Grec ancien (LCA)", note: "Généralement à partir de la 3e" },
  { code: "SECTION_EURO", label: "Section européenne / internationale" },
  { code: "CHAM", label: "Classe à horaires aménagés (musique, danse, sport...)" },
  { code: "DECOUVERTE_PRO", label: "Découverte professionnelle", note: "3e uniquement" },
];

/** Enseignements optionnels en 2de générale et technologique (1 à 2 au choix selon lycée). */
export const SECONDE_OPTIONS: CurriculumItem[] = [
  { code: "LV3", label: "Langue vivante 3" },
  { code: "LCA_LATIN", label: "Latin (LCA)" },
  { code: "LCA_GREC", label: "Grec ancien (LCA)" },
  { code: "ARTS", label: "Un enseignement artistique (arts plastiques, musique, théâtre, cinéma...)" },
  { code: "EPS_COMPLEMENT", label: "EPS (enseignement complémentaire)" },
  { code: "CIT", label: "Création et innovation technologiques", note: "Selon lycée" },
  { code: "SECTION_EURO", label: "Section européenne / internationale" },
];

/** Enseignements optionnels en 1re/Terminale, en plus des 3→2 spécialités. */
export const LYCEE_CYCLE_TERMINAL_OPTIONS: CurriculumItem[] = [
  { code: "LV3", label: "Langue vivante 3" },
  { code: "LCA_LATIN", label: "Latin (LCA)" },
  { code: "LCA_GREC", label: "Grec ancien (LCA)" },
  { code: "EPS_COMPLEMENT", label: "EPS (enseignement complémentaire)" },
  { code: "DGEMC", label: "Droit et grands enjeux du monde contemporain", note: "Terminale" },
  {
    code: "MATHS_COMPLEMENTAIRES",
    label: "Mathématiques complémentaires",
    note: "Terminale — pour qui a arrêté la spécialité maths en 1re",
  },
  {
    code: "MATHS_EXPERTES",
    label: "Mathématiques expertes",
    note: "Terminale — pour qui garde la spécialité maths",
  },
];

// ---------------------------------------------------------------------
// Spécialités (cycle terminal — 1re et Terminale)
// ---------------------------------------------------------------------

export const SPECIALTIES: CurriculumItem[] = [
  { code: "ARTS", label: "Arts (plastiques, cirque, théâtre, danse, musique, cinéma-audiovisuel...)" },
  { code: "BIOLOGIE_ECOLOGIE", label: "Biologie-écologie", note: "Lycées agricoles uniquement" },
  { code: "HGGSP", label: "Histoire-géographie, géopolitique et sciences politiques" },
  { code: "HLP", label: "Humanités, littérature et philosophie" },
  { code: "LLCER", label: "Langues, littératures et cultures étrangères et régionales", note: "Préciser la langue" },
  { code: "LCA_LITTERATURE", label: "Littérature et langues et cultures de l'Antiquité (LCA)" },
  { code: "MATHEMATIQUES", label: "Mathématiques" },
  { code: "NSI", label: "Numérique et sciences informatiques" },
  { code: "PHYSIQUE_CHIMIE", label: "Physique-chimie" },
  { code: "SVT", label: "Sciences de la vie et de la Terre" },
  { code: "SI", label: "Sciences de l'ingénieur" },
  { code: "SES", label: "Sciences économiques et sociales" },
  { code: "EPPCS", label: "Éducation physique, pratiques et culture sportives", note: "Proposée dans peu de lycées" },
];

export function getLevel(code: SchoolLevelCode) {
  return SCHOOL_LEVELS.find((l) => l.code === code);
}

export function getOptionsForLevel(code: SchoolLevelCode): CurriculumItem[] {
  switch (code) {
    case "COLLEGE_6E":
    case "COLLEGE_5E":
    case "COLLEGE_4E":
    case "COLLEGE_3E":
      return COLLEGE_OPTIONS;
    case "LYCEE_2NDE":
      return SECONDE_OPTIONS;
    case "LYCEE_1ERE":
    case "LYCEE_TERMINALE":
      return LYCEE_CYCLE_TERMINAL_OPTIONS;
    default:
      return [];
  }
}

export function getSpecialtiesForLevel(code: SchoolLevelCode): CurriculumItem[] {
  if (code === "LYCEE_1ERE" || code === "LYCEE_TERMINALE") return SPECIALTIES;
  return [];
}

export function getMaxSpecialties(code: SchoolLevelCode): number {
  if (code === "LYCEE_1ERE") return 3;
  if (code === "LYCEE_TERMINALE") return 2;
  return 0;
}
