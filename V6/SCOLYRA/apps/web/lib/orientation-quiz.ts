/**
 * Quiz d'orientation premium — SCOLYRA n'a pas de vrai raisonnement IA
 * branché en V0 (AI_PROVIDER=mock), donc ce quiz fonctionne par
 * pondération de tags de domaine plutôt que par génération dynamique
 * de questions par un LLM. C'est un vrai calcul, pas une simulation
 * vide — mais ce n'est pas un "vrai" raisonnement IA adaptatif tant
 * qu'un fournisseur réel n'est pas branché (voir docs/AI.md).
 *
 * Chaque option est taguée avec les domaines qu'elle renforce. Le
 * résultat final additionne les scores et retourne les domaines les
 * mieux classés — jamais une formation ou une école précise (on
 * n'invente pas de données officielles, §19/§47).
 */

export type DomainTag =
  | "sciences_exactes"
  | "ingenierie"
  | "numerique"
  | "sciences_vivant"
  | "sante"
  | "economie_gestion"
  | "droit_science_politique"
  | "lettres_langues"
  | "sciences_humaines"
  | "arts_creation"
  | "social_education"
  | "artisanat_technique";

export const DOMAIN_LABELS: Record<DomainTag, string> = {
  sciences_exactes: "Sciences exactes & mathématiques",
  ingenierie: "Ingénierie & sciences de l'ingénieur",
  numerique: "Numérique & informatique",
  sciences_vivant: "Sciences du vivant & environnement",
  sante: "Santé & paramédical",
  economie_gestion: "Économie, gestion & commerce",
  droit_science_politique: "Droit & sciences politiques",
  lettres_langues: "Lettres, langues & sciences humaines",
  sciences_humaines: "Histoire, philosophie & sciences sociales",
  arts_creation: "Arts & création",
  social_education: "Social, éducation & santé publique",
  artisanat_technique: "Artisanat & filières techniques courtes",
};

export type QuizOption = { id: string; label: string; tags: Partial<Record<DomainTag, number>> };
export type QuizQuestion = { id: string; prompt: string; options: QuizOption[] };

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    prompt: "Face à un problème compliqué, tu préfères...",
    options: [
      { id: "a", label: "Poser une équation et calculer", tags: { sciences_exactes: 2, ingenierie: 1 } },
      { id: "b", label: "Comprendre le contexte humain derrière", tags: { sciences_humaines: 2, sciences_vivant: 0 } },
      { id: "c", label: "Bricoler une solution concrète", tags: { artisanat_technique: 2, ingenierie: 1 } },
      { id: "d", label: "Chercher ce qui a déjà été écrit dessus", tags: { lettres_langues: 2, droit_science_politique: 1 } },
    ],
  },
  {
    id: "q2",
    prompt: "Quelle matière te procure le plus de plaisir, indépendamment des notes ?",
    options: [
      { id: "a", label: "Mathématiques", tags: { sciences_exactes: 3 } },
      { id: "b", label: "SVT / Biologie", tags: { sciences_vivant: 3, sante: 1 } },
      { id: "c", label: "Histoire-géographie / HGGSP", tags: { sciences_humaines: 3, droit_science_politique: 1 } },
      { id: "d", label: "Arts / musique / théâtre", tags: { arts_creation: 3 } },
      { id: "e", label: "SES", tags: { economie_gestion: 3 } },
      { id: "f", label: "NSI / informatique", tags: { numerique: 3 } },
    ],
  },
  {
    id: "q3",
    prompt: "Tu t'imagines plus tard...",
    options: [
      { id: "a", label: "Dans un labo ou un bureau d'études", tags: { sciences_exactes: 1, ingenierie: 2 } },
      { id: "b", label: "Au contact direct de gens à aider", tags: { social_education: 2, sante: 2 } },
      { id: "c", label: "À créer des choses (visuelles, écrites, sonores)", tags: { arts_creation: 3 } },
      { id: "d", label: "À monter/gérer un projet ou une entreprise", tags: { economie_gestion: 3 } },
      { id: "e", label: "Sur le terrain, avec les mains", tags: { artisanat_technique: 3 } },
    ],
  },
  {
    id: "q4",
    prompt: "Une longue étude théorique sans application immédiate, ça te...",
    options: [
      { id: "a", label: "Motive plutôt", tags: { sciences_humaines: 1, sciences_exactes: 1 } },
      { id: "b", label: "Décourage, je veux du concret vite", tags: { artisanat_technique: 2, ingenierie: 1 } },
    ],
  },
  {
    id: "q5",
    prompt: "Tu préfères un métier où tu...",
    options: [
      { id: "a", label: "Résous des problèmes techniques précis", tags: { ingenierie: 2, numerique: 1 } },
      { id: "b", label: "Débats et argumentes", tags: { droit_science_politique: 2, sciences_humaines: 1 } },
      { id: "c", label: "Soignes ou accompagnes", tags: { sante: 2, social_education: 2 } },
      { id: "d", label: "Analyses des données/marchés", tags: { economie_gestion: 2, numerique: 1 } },
    ],
  },
  {
    id: "q6",
    prompt: "Coder un programme ou une page web, c'est...",
    options: [
      { id: "a", label: "Un vrai plaisir", tags: { numerique: 3 } },
      { id: "b", label: "Neutre, ni plus ni moins qu'autre chose", tags: {} },
      { id: "c", label: "Pas du tout mon truc", tags: { arts_creation: 1, sciences_humaines: 1 } },
    ],
  },
  {
    id: "q7",
    prompt: "Un sujet de dissertation qui te tente le plus :",
    options: [
      { id: "a", label: "La démocratie est-elle menacée ?", tags: { droit_science_politique: 2, sciences_humaines: 1 } },
      { id: "b", label: "Peut-on tout démontrer ?", tags: { sciences_exactes: 1, sciences_humaines: 2 } },
      { id: "c", label: "L'art peut-il se passer de règles ?", tags: { arts_creation: 3 } },
    ],
  },
  {
    id: "q8",
    prompt: "Tu regardes plutôt des vidéos/documentaires sur...",
    options: [
      { id: "a", label: "L'espace, la physique, les maths", tags: { sciences_exactes: 2 } },
      { id: "b", label: "La médecine, le corps humain", tags: { sante: 2, sciences_vivant: 1 } },
      { id: "c", label: "L'économie, la géopolitique", tags: { economie_gestion: 2, droit_science_politique: 1 } },
      { id: "d", label: "Le cinéma, la musique, le design", tags: { arts_creation: 2 } },
      { id: "e", label: "La nature, l'écologie, les animaux", tags: { sciences_vivant: 2 } },
    ],
  },
  {
    id: "q9",
    prompt: "En groupe de travail, tu es plutôt celui/celle qui...",
    options: [
      { id: "a", label: "Structure et planifie", tags: { economie_gestion: 1, ingenierie: 1 } },
      { id: "b", label: "Apporte les idées créatives", tags: { arts_creation: 2 } },
      { id: "c", label: "Vérifie que tout le monde va bien", tags: { social_education: 2 } },
      { id: "d", label: "Fait les calculs/vérifications techniques", tags: { sciences_exactes: 2, ingenierie: 1 } },
    ],
  },
  {
    id: "q10",
    prompt: "Une carrière longue (8-10 ans d'études, médecine, recherche...) te...",
    options: [
      { id: "a", label: "Ne fait pas peur si le métier me plaît", tags: { sante: 1, sciences_exactes: 1 } },
      { id: "b", label: "Je préfère une formation plus courte et professionnalisante", tags: { artisanat_technique: 2, economie_gestion: 1 } },
    ],
  },
];

export function scoreQuiz(answers: Record<string, string>): { domain: DomainTag; label: string; score: number }[] {
  const scores: Partial<Record<DomainTag, number>> = {};

  for (const question of QUIZ_QUESTIONS) {
    const chosenOptionId = answers[question.id];
    if (!chosenOptionId) continue;
    const option = question.options.find((o) => o.id === chosenOptionId);
    if (!option) continue;
    for (const [tag, weight] of Object.entries(option.tags) as [DomainTag, number][]) {
      scores[tag] = (scores[tag] ?? 0) + weight;
    }
  }

  return (Object.entries(scores) as [DomainTag, number][])
    .map(([domain, score]) => ({ domain, label: DOMAIN_LABELS[domain], score }))
    .sort((a, b) => b.score - a.score)
    .filter((d) => d.score > 0);
}
