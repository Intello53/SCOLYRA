/**
 * Données de démonstration SCOLYRA — 100% fictives.
 * Utilisées quand aucune base de données réelle n'est connectée,
 * pour rendre le dashboard et les pages principales navigables (§21/§45).
 */

export const demoStudent = {
  firstName: "Léa",
  schoolLevel: "Lycée — Terminale",
  establishment: "Lycée démonstration (donnée fictive)",
};

export const demoSubjects = [
  { name: "Mathématiques", average: 12.4, target: 15 },
  { name: "Physique-Chimie", average: 13.8, target: 15 },
  { name: "SES", average: 15.2, target: 16 },
  { name: "Anglais LLCE", average: 16.1, target: 17 },
];

export const demoGoals = [
  {
    title: "Objectif 15+ en Mathématiques",
    currentValue: 12.4,
    targetValue: 15,
    deadline: "dans 10 semaines",
  },
  {
    title: "Consolider les probabilités",
    currentValue: null,
    targetValue: null,
    deadline: "avant le prochain DS",
  },
];

export const demoUpcomingDeadlines = [
  { title: "DS Mathématiques — dérivées & probabilités", inDays: 6 },
  { title: "Rendu dossier Grand Oral", inDays: 14 },
  { title: "Date limite vœux formation (indicative — à vérifier officiellement)", inDays: 40 },
];

export const demoRevisionRecommendations = [
  { skill: "Probabilités conditionnelles", priority: "Haute" },
  { skill: "Suites numériques", priority: "Moyenne" },
  { skill: "Oxydoréduction", priority: "Moyenne" },
];

export const demoAIRecommendation =
  "[MOCK] D'après ton profil de démonstration, priorise les probabilités conditionnelles cette semaine : c'est la notion la plus récurrente dans tes erreurs récentes.";
