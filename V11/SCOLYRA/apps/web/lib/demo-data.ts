/**
 * Données de démonstration SCOLYRA — 100% fictives.
 * Centralise tout le contenu affiché par les pages tant qu'aucune base
 * de données réelle n'est connectée (§21/§45 du cahier des charges).
 */

export const demoStudent = {
  firstName: "Léa",
  lastName: "Moreau",
  schoolLevel: "Terminale générale",
  specialties: ["Mathématiques", "Physique-Chimie", "SES"],
  establishment: "Lycée démonstration (donnée fictive)",
  weeklyAvailableHours: 8,
};

export const demoOverallAverage = 13.9;
export const demoOverallTarget = 15;
export const demoStreak = 6;

export type SubjectDemo = {
  slug: string;
  name: string;
  average: number;
  target: number;
  trend: "up" | "down" | "flat";
  mastery: { skill: string; level: number }[]; // level 0-100
};

export const demoSubjects: SubjectDemo[] = [
  {
    slug: "mathematiques",
    name: "Mathématiques",
    average: 12.4,
    target: 15,
    trend: "up",
    mastery: [
      { skill: "Probabilités conditionnelles", level: 38 },
      { skill: "Suites numériques", level: 61 },
      { skill: "Fonction exponentielle", level: 74 },
      { skill: "Géométrie dans l'espace", level: 55 },
    ],
  },
  {
    slug: "physique-chimie",
    name: "Physique-Chimie",
    average: 13.8,
    target: 15,
    trend: "up",
    mastery: [
      { skill: "Oxydoréduction", level: 42 },
      { skill: "Ondes et signaux", level: 68 },
      { skill: "Mécanique newtonienne", level: 71 },
    ],
  },
  {
    slug: "ses",
    name: "SES",
    average: 15.2,
    target: 16,
    trend: "flat",
    mastery: [
      { skill: "Marché du travail", level: 80 },
      { skill: "Politique monétaire", level: 66 },
    ],
  },
  {
    slug: "anglais-llce",
    name: "Anglais LLCE",
    average: 16.1,
    target: 17,
    trend: "up",
    mastery: [
      { skill: "Expression écrite argumentée", level: 85 },
      { skill: "Analyse filmique", level: 77 },
    ],
  },
  {
    slug: "philosophie",
    name: "Philosophie",
    average: 11.6,
    target: 13,
    trend: "down",
    mastery: [
      { skill: "Dissertation — problématisation", level: 34 },
      { skill: "Explication de texte", level: 52 },
    ],
  },
];

export const demoGoals = [
  {
    title: "Objectif 15+ en Mathématiques",
    subject: "Mathématiques",
    currentValue: 12.4,
    targetValue: 15,
    deadline: "10 semaines",
    milestones: [
      { label: "Palier 1 — viser 13.1/20", done: true },
      { label: "Palier 2 — viser 13.8/20", done: false },
      { label: "Palier 3 — viser 14.4/20", done: false },
      { label: "Palier 4 — viser 15/20", done: false },
    ],
  },
  {
    title: "Consolider la dissertation de philosophie",
    subject: "Philosophie",
    currentValue: null,
    targetValue: null,
    deadline: "avant le prochain DS",
    milestones: [
      { label: "Revoir la méthode de problématisation", done: true },
      { label: "S'entraîner sur 2 sujets blancs", done: false },
    ],
  },
];

export const demoUpcomingDeadlines = [
  { title: "DS Mathématiques — dérivées & probabilités", inDays: 6, kind: "Évaluation" },
  { title: "Rendu dossier Grand Oral", inDays: 14, kind: "Projet" },
  { title: "Sujet blanc Philosophie", inDays: 21, kind: "Évaluation" },
  { title: "Date limite vœux formation (indicative — à vérifier officiellement)", inDays: 40, kind: "Orientation" },
];

export const demoRevisionPlan = {
  title: "Plan de révision — 2 semaines avant le DS",
  sessions: [
    { skill: "Probabilités conditionnelles", subject: "Mathématiques", priority: "Haute", status: "À faire", minutes: 45 },
    { skill: "Oxydoréduction", subject: "Physique-Chimie", priority: "Haute", status: "À faire", minutes: 40 },
    { skill: "Dissertation — problématisation", subject: "Philosophie", priority: "Moyenne", status: "En cours", minutes: 60 },
    { skill: "Suites numériques", subject: "Mathématiques", priority: "Moyenne", status: "Fait", minutes: 30 },
    { skill: "Ondes et signaux", subject: "Physique-Chimie", priority: "Basse", status: "Fait", minutes: 30 },
  ],
};

export const demoCalendarWeek = [
  { day: "Lundi", sessions: [{ time: "18:00", title: "Probabilités — Maths", minutes: 45 }] },
  { day: "Mardi", sessions: [{ time: "17:30", title: "Oxydoréduction — Physique", minutes: 40 }] },
  { day: "Mercredi", sessions: [] },
  { day: "Jeudi", sessions: [{ time: "18:30", title: "Dissertation — Philo", minutes: 60 }] },
  { day: "Vendredi", sessions: [] },
  { day: "Samedi", sessions: [{ time: "10:00", title: "Sujet blanc — Maths", minutes: 90 }] },
  { day: "Dimanche", sessions: [{ time: "16:00", title: "Relecture fiches SES", minutes: 30 }] },
];

export const demoDocuments = [
  { name: "DS Probabilités — copie corrigée.pdf", subject: "Mathématiques", status: "Analysé", uploadedDaysAgo: 2 },
  { name: "Fiche oxydoréduction.pdf", subject: "Physique-Chimie", status: "Analysé", uploadedDaysAgo: 5 },
  { name: "Cours dissertation méthode.pdf", subject: "Philosophie", status: "En traitement", uploadedDaysAgo: 0 },
  { name: "Annales SES 2024.pdf", subject: "SES", status: "Analysé", uploadedDaysAgo: 12 },
];

export const demoProjects = [
  {
    title: "Grand Oral — Les mathématiques du hasard",
    status: "En cours",
    progress: 55,
    deadline: "dans 14 jours",
    tasks: [
      { label: "Choisir la problématique définitive", done: true },
      { label: "Rédiger le plan détaillé", done: true },
      { label: "Préparer les supports visuels", done: false },
      { label: "Répétition chronométrée", done: false },
    ],
  },
  {
    title: "TIPE — Modélisation épidémique",
    status: "Planifié",
    progress: 10,
    deadline: "dans 3 mois",
    tasks: [
      { label: "Définir le sujet avec le professeur référent", done: true },
      { label: "Bibliographie initiale", done: false },
    ],
  },
];

export const demoOrientation = {
  desiredFields: ["Écoles d'ingénieur post-bac", "Classes préparatoires MPSI", "Licence de mathématiques"],
  applications: [
    { formation: "TODO — source officielle à intégrer", establishment: "À compléter", status: "Brouillon" },
  ],
  deadlines: [
    { title: "Ouverture de la plateforme de vœux (indicative)", inDays: 40 },
    { title: "Fin de saisie des vœux (indicative)", inDays: 75 },
  ],
};

export const demoAIRecommendation =
  "[MOCK] D'après ton profil de démonstration, priorise les probabilités conditionnelles cette semaine : c'est la notion la plus récurrente dans tes erreurs récentes en Mathématiques.";

export const demoCoachConversation = [
  { role: "user", content: "Je bloque sur les probabilités conditionnelles, par où commencer ?" },
  {
    role: "assistant",
    content:
      "[MOCK] Reprends d'abord la formule de Bayes sur 2-3 exercices simples, puis enchaîne avec les arbres pondérés. C'est la notion la plus récurrente dans tes erreurs récentes — je te l'ai mise en priorité haute dans ton plan de révision.",
  },
];

export const demoSubscription = {
  plan: "FREE" as "FREE" | "PREMIUM",
  renewalNote: "Passe en Premium pour débloquer l'analyse de copies illimitée et le coach IA avancé.",
};

// ---------------------------------------------------------------------
// Données ADMIN (démonstration) — jamais de vraies données personnelles
// ---------------------------------------------------------------------

export const demoAdminStats = {
  totalUsers: 482,
  activeThisWeek: 311,
  premiumUsers: 64,
  aiCallsToday: 1240,
  avgGoalProgress: 0.58,
};

export const demoAdminUsers = [
  { name: "Léa Moreau", level: "Terminale", plan: "FREE", lastActive: "il y a 2h", status: "Actif" },
  { name: "Noah Bernard", level: "1ère", plan: "PREMIUM", lastActive: "il y a 1j", status: "Actif" },
  { name: "Inès Petit", level: "Terminale", plan: "FREE", lastActive: "il y a 6j", status: "Inactif" },
  { name: "Adam Roux", level: "2nde", plan: "FREE", lastActive: "il y a 3h", status: "Actif" },
  { name: "Chloé Girard", level: "1ère", plan: "PREMIUM", lastActive: "il y a 30min", status: "Actif" },
];

export const demoAdminAlerts = [
  { title: "Pic d'appels IA détecté", detail: "1240 appels aujourd'hui, +38% vs moyenne 7j", tone: "warn" as const },
  { title: "3 comptes mineurs sans représentant légal vérifié", detail: "Bloque l'accès Premium pour ces comptes", tone: "warn" as const },
  { title: "Aucun incident de sécurité", detail: "Dernier audit log suspect : aucun", tone: "mastery" as const },
];

export const demoAdminAuditLog = [
  { action: "Connexion admin", user: "admin@scolyra.app", when: "il y a 5 min" },
  { action: "Mise à jour Formation #TODO", user: "admin@scolyra.app", when: "il y a 1h" },
  { action: "Export RGPD demandé", user: "eleve-1834@scolyra.app", when: "il y a 4h" },
  { action: "Suppression de compte", user: "eleve-0952@scolyra.app", when: "hier" },
];
