import React from "react";
// Questions par matière et niveau
const MATIERES = [
  { id: 1, nom: "Mathématiques" },
  { id: 2, nom: "Physique" },
  { id: 3, nom: "Chimie" },
  { id: 4, nom: "Français" },
  { id: 5, nom: "Anglais" },
  { id: 6, nom: "Philosophie" },
  { id: 7, nom: "Histoire" },
  { id: 8, nom: "SVT" },
  { id: 9, nom: "Informatique" },
  { id: 10, nom: "ECM" },
  { id: 11, nom: "Géographie" },
];
const QUESTIONS_BY_SUBJECT = {
  Mathématiques: {
    primaire: [
      {
        id: "math_primaire_1",
        text: "Comment enseignez-vous les tables de multiplication ?",
        options: [
          { value: "par_coeur", label: "Apprentissage par cœur", score: 1 },
          { value: "jeux", label: "À travers des jeux éducatifs", score: 3 },
          {
            value: "problemes",
            label: "En les appliquant à des problèmes concrets",
            score: 2,
          },
        ],
      },
      {
        id: "math_primaire_2",
        text: "Comment rendez-vous l’addition plus accessible ?",
        options: [
          {
            value: "objets",
            label: "Utilisation d’objets physiques",
            score: 3,
          },
          { value: "calcul", label: "Enchainement de calculs", score: 1 },
          { value: "jeux", label: "Jeux de comptage", score: 2 },
        ],
      },
      {
        id: "math_primaire_3",
        text: "Quelle méthode utilisez-vous pour enseigner la soustraction ?",
        options: [
          {
            value: "retrait",
            label: "Méthode classique de retrait",
            score: 1,
          },
          {
            value: "illustrations",
            label: "Illustrations avec des images",
            score: 3,
          },
          {
            value: "histoires",
            label: "Contextualisation avec des histoires",
            score: 2,
          },
        ],
      },
      {
        id: "math_primaire_4",
        text: "Comment expliquez-vous les formes géométriques de base ?",
        options: [
          { value: "dessin", label: "Dessin sur tableau", score: 1 },
          {
            value: "manipulables",
            label: "Formes en papier ou objets",
            score: 3,
          },
          { value: "vidéos", label: "Vidéos éducatives", score: 2 },
        ],
      },
      {
        id: "math_primaire_5",
        text: "Quelle stratégie utilisez-vous pour enseigner l’heure ?",
        options: [
          { value: "horloge_papier", label: "Horloge en papier", score: 3 },
          { value: "numérique", label: "Applications numériques", score: 2 },
          { value: "oral", label: "Explication orale", score: 1 },
        ],
      },
      {
        id: "math_primaire_6",
        text: "Comment introduisez-vous les fractions ?",
        options: [
          {
            value: "nombres",
            label: "Explication purement numérique",
            score: 1,
          },
          {
            value: "gâteau",
            label: "Modèles concrets (ex: gâteau)",
            score: 3,
          },
          { value: "schémas", label: "Représentation graphique", score: 2 },
        ],
      },
      {
        id: "math_primaire_7",
        text: "Quelle approche utilisez-vous pour enseigner les suites logiques ?",
        options: [
          { value: "schéma", label: "Dessins de motifs", score: 3 },
          { value: "calcul", label: "Calcul mental", score: 1 },
          {
            value: "histoire",
            label: "Narration d’histoires logiques",
            score: 2,
          },
        ],
      },
      {
        id: "math_primaire_8",
        text: "Comment introduisez-vous la division ?",
        options: [
          { value: "partage", label: "Avec des jeux de partage", score: 3 },
          {
            value: "formules",
            label: "Directement via des formules",
            score: 1,
          },
          { value: "dessin", label: "Illustrations avec objets", score: 2 },
        ],
      },
      {
        id: "math_primaire_9",
        text: "Comment travaillez-vous les problèmes mathématiques ?",
        options: [
          {
            value: "lecture",
            label: "Lecture et compréhension du texte",
            score: 2,
          },
          {
            value: "mémorisation",
            label: "Mémorisation de types d’énoncés",
            score: 1,
          },
          {
            value: "mise_en_situation",
            label: "Mise en situation réelle",
            score: 3,
          },
        ],
      },
      {
        id: "math_primaire_10",
        text: "Comment évaluez-vous la compréhension des élèves ?",
        options: [
          { value: "exercices", label: "Exercices réguliers", score: 2 },
          { value: "quiz", label: "Quiz interactifs", score: 3 },
          { value: "oral", label: "Questions orales", score: 1 },
        ],
      },
    ],
    "college/lycee": [
      {
        id: "math_college_1",
        text: "Comment abordez-vous la résolution d'équations du premier degré ?",
        options: [
          {
            value: "methode_standard",
            label: "Je montre la méthode standard",
            score: 1,
          },
          {
            value: "exemples_concrets",
            label: "Avec des exemples concrets",
            score: 3,
          },
          {
            value: "approche_visuelle",
            label: "Utilisation de graphiques",
            score: 2,
          },
        ],
      },
      {
        id: "math_college_2",
        text: "Comment enseignez-vous les fonctions ?",
        options: [
          { value: "définition", label: "Définition et formule", score: 1 },
          { value: "graphiques", label: "Visualisation graphique", score: 3 },
          { value: "cas_pratiques", label: "Cas pratiques", score: 2 },
        ],
      },
      {
        id: "math_college_3",
        text: "Comment introduisez-vous les statistiques ?",
        options: [
          {
            value: "tableaux",
            label: "Par des tableaux de données",
            score: 1,
          },
          {
            value: "exemples",
            label: "À l’aide d’enquêtes simples",
            score: 3,
          },
          {
            value: "formules",
            label: "Par les formules statistiques",
            score: 2,
          },
        ],
      },
      {
        id: "math_college_4",
        text: "Quelle approche utilisez-vous pour enseigner les dérivées ?",
        options: [
          { value: "formules", label: "Formule directe", score: 1 },
          { value: "visualisation", label: "Graphique de pente", score: 3 },
          {
            value: "explication_orale",
            label: "Explication intuitive",
            score: 2,
          },
        ],
      },
      {
        id: "math_college_5",
        text: "Comment rendez-vous les probabilités accessibles ?",
        options: [
          { value: "dés", label: "Jeux de dés/cartes", score: 3 },
          { value: "formules", label: "Règles classiques", score: 1 },
          { value: "situations", label: "Cas concrets", score: 2 },
        ],
      },
      {
        id: "math_college_6",
        text: "Comment enseignez-vous les systèmes d'équations ?",
        options: [
          {
            value: "méthode_substitution",
            label: "Par substitution",
            score: 1,
          },
          { value: "graphique", label: "Par tracé graphique", score: 2 },
          {
            value: "exemples_vie",
            label: "Avec des problèmes de la vie réelle",
            score: 3,
          },
        ],
      },
      {
        id: "math_college_7",
        text: "Comment évaluez-vous les compétences de raisonnement logique ?",
        options: [
          { value: "tests_logiques", label: "Tests logiques", score: 3 },
          {
            value: "exercices_classiques",
            label: "Exercices classiques",
            score: 1,
          },
          { value: "jeux_logiques", label: "Jeux de réflexion", score: 2 },
        ],
      },
      {
        id: "math_college_8",
        text: "Comment gérez-vous les difficultés des élèves ?",
        options: [
          {
            value: "soutien_individuel",
            label: "Soutien individuel",
            score: 3,
          },
          { value: "revisions", label: "Séances de révision", score: 2 },
          {
            value: "accélération",
            label: "Passage plus rapide des notions",
            score: 1,
          },
        ],
      },
      {
        id: "math_college_9",
        text: "Quel rôle joue le calcul mental dans vos cours ?",
        options: [
          { value: "quotidien", label: "Exercices quotidiens", score: 3 },
          { value: "rare", label: "Utilisé occasionnellement", score: 1 },
          { value: "soutien", label: "Utilisé en soutien", score: 2 },
        ],
      },
      {
        id: "math_college_10",
        text: "Comment abordez-vous les devoirs à la maison ?",
        options: [
          { value: "réguliers", label: "Devoirs réguliers", score: 2 },
          { value: "optionnels", label: "Exercices optionnels", score: 1 },
          {
            value: "autocorrectifs",
            label: "Sujets autocorrectifs",
            score: 3,
          },
        ],
      },
    ],
  },
  Physique: {
    "college/lycee": [
      {
        id: "physique_1",
        text: "Comment enseignez-vous les concepts de cinématique ?",
        options: [
          { value: "formules", label: "En partant des formules", score: 1 },
          {
            value: "experiences",
            label: "Par des expériences pratiques",
            score: 3,
          },
          {
            value: "analogies",
            label: "Avec des analogies concrètes",
            score: 2,
          },
        ],
      },
      {
        id: "physique_2",
        text: "Comment introduisez-vous la notion de force ?",
        options: [
          { value: "définition", label: "Définition académique", score: 1 },
          { value: "démonstration", label: "Expériences simples", score: 3 },
          { value: "simulation", label: "Simulations numériques", score: 2 },
        ],
      },
      {
        id: "physique_3",
        text: "Quelle méthode utilisez-vous pour enseigner l'électricité ?",
        options: [
          { value: "formules", label: "Formules et schémas", score: 1 },
          { value: "montage", label: "Montage de circuits réels", score: 3 },
          { value: "animation", label: "Animations interactives", score: 2 },
        ],
      },
      {
        id: "physique_4",
        text: "Comment expliquez-vous la pression ?",
        options: [
          { value: "lois", label: "Loi de Pascal uniquement", score: 1 },
          { value: "exemples", label: "Exemples quotidiens", score: 3 },
          { value: "vidéos", label: "Vidéos illustratives", score: 2 },
        ],
      },
      {
        id: "physique_5",
        text: "Comment enseignez-vous la loi d'Ohm ?",
        options: [
          {
            value: "application",
            label: "Par résolution d'exercices",
            score: 2,
          },
          { value: "montage", label: "Montage de circuits", score: 3 },
          { value: "théorie", label: "Présentation théorique", score: 1 },
        ],
      },
      {
        id: "physique_6",
        text: "Comment introduisez-vous les ondes ?",
        options: [
          {
            value: "définition",
            label: "Définitions et propriétés",
            score: 1,
          },
          {
            value: "expériences",
            label: "Expériences de propagation",
            score: 3,
          },
          {
            value: "simulations",
            label: "Animations interactives",
            score: 2,
          },
        ],
      },
      {
        id: "physique_7",
        text: "Quelle méthode utilisez-vous pour enseigner l’énergie ?",
        options: [
          { value: "formule", label: "Formules classiques", score: 1 },
          {
            value: "cas_reels",
            label: "Cas réels (voiture, maison...)",
            score: 3,
          },
          {
            value: "infographies",
            label: "Infographies explicatives",
            score: 2,
          },
        ],
      },
      {
        id: "physique_8",
        text: "Comment abordez-vous les lois de Newton ?",
        options: [
          { value: "théorie", label: "Par la théorie uniquement", score: 1 },
          { value: "simulations", label: "Simulations en classe", score: 2 },
          { value: "jeux", label: "Jeux et activités pratiques", score: 3 },
        ],
      },
      {
        id: "physique_9",
        text: "Comment évaluez-vous les compétences expérimentales ?",
        options: [
          { value: "fiches", label: "Fiches de suivi", score: 2 },
          { value: "observation", label: "Observation directe", score: 3 },
          { value: "quizz", label: "Évaluations classiques", score: 1 },
        ],
      },
      {
        id: "physique_10",
        text: "Comment gérez-vous l’erreur expérimentale ?",
        options: [
          { value: "ignorée", label: "Je ne la traite pas", score: 1 },
          {
            value: "analysée",
            label: "Elle est discutée et analysée",
            score: 3,
          },
          { value: "tolérée", label: "Elle est tolérée", score: 2 },
        ],
      },
    ],
  },
  Chimie: {
    "college/lycee": [
      {
        id: "chimie_1",
        text: "Comment expliquez-vous la structure atomique aux élèves ?",
        options: [
          { value: "modeles", label: "Avec des modèles 3D", score: 3 },
          { value: "historique", label: "Approche historique", score: 2 },
          { value: "theorie", label: "Théorie directement", score: 1 },
        ],
      },
      {
        id: "chimie_2",
        text: "Comment enseignez-vous les réactions chimiques ?",
        options: [
          {
            value: "experiences",
            label: "Expériences en laboratoire",
            score: 3,
          },
          { value: "equations", label: "Équations chimiques", score: 2 },
          { value: "theorie", label: "Explications théoriques", score: 1 },
        ],
      },
      {
        id: "chimie_3",
        text: "Quelle approche pour la classification périodique ?",
        options: [
          {
            value: "proprietes",
            label: "Par les propriétés des éléments",
            score: 3,
          },
          { value: "histoire", label: "Approche historique", score: 2 },
          { value: "memorisation", label: "Mémorisation", score: 1 },
        ],
      },
      {
        id: "chimie_4",
        text: "Comment expliquez-vous les liaisons chimiques ?",
        options: [
          { value: "modeles", label: "Modèles moléculaires", score: 3 },
          { value: "analogies", label: "Analogies", score: 2 },
          { value: "theorie", label: "Théorie", score: 1 },
        ],
      },
      {
        id: "chimie_5",
        text: "Comment abordez-vous la cinétique chimique ?",
        options: [
          {
            value: "experiences",
            label: "Expériences de vitesse de réaction",
            score: 3,
          },
          { value: "courbes", label: "Analyse de courbes", score: 2 },
          { value: "lois", label: "Lois théoriques", score: 1 },
        ],
      },
      {
        id: "chimie_6",
        text: "Comment enseignez-vous l'équilibre chimique ?",
        options: [
          {
            value: "demonstrations",
            label: "Démonstrations expérimentales",
            score: 3,
          },
          { value: "principes", label: "Principe de Le Chatelier", score: 2 },
          { value: "calculs", label: "Calculs d'équilibre", score: 1 },
        ],
      },
      {
        id: "chimie_7",
        text: "Quelle méthode pour les solutions aqueuses ?",
        options: [
          {
            value: "dosages",
            label: "Travaux pratiques de dosage",
            score: 3,
          },
          { value: "calculs", label: "Calculs de concentrations", score: 2 },
          { value: "theorie", label: "Théorie des solutions", score: 1 },
        ],
      },
      {
        id: "chimie_8",
        text: "Comment expliquez-vous l'électrochimie ?",
        options: [
          { value: "piles", label: "Expériences avec piles", score: 3 },
          {
            value: "applications",
            label: "Applications industrielles",
            score: 2,
          },
          { value: "theorie", label: "Potentiels redox", score: 1 },
        ],
      },
      {
        id: "chimie_9",
        text: "Comment abordez-vous la chimie organique ?",
        options: [
          { value: "modeles", label: "Modèles moléculaires", score: 3 },
          {
            value: "applications",
            label: "Applications quotidiennes",
            score: 2,
          },
          { value: "nomenclature", label: "Nomenclature", score: 1 },
        ],
      },
      {
        id: "chimie_10",
        text: "Comment préparez-vous aux épreuves pratiques ?",
        options: [
          {
            value: "entrainement",
            label: "TP types en conditions réelles",
            score: 3,
          },
          {
            value: "methodologie",
            label: "Méthodologie d'analyse",
            score: 2,
          },
          { value: "theorie", label: "Révision théorique", score: 1 },
        ],
      },
    ],
  },
  Français: {
    primaire: [
      {
        id: "fr_primaire_1",
        text: "Comment enseignez-vous la lecture aux débutants ?",
        options: [
          { value: "syllabique", label: "Méthode syllabique", score: 2 },
          { value: "globale", label: "Méthode globale", score: 1 },
          { value: "mixte", label: "Approche mixte", score: 3 },
        ],
      },
      {
        id: "fr_primaire_2",
        text: "Comment introduisez-vous une nouvelle notion de grammaire ?",
        options: [
          { value: "exemples", label: "Par des exemples concrets", score: 3 },
          {
            value: "definition",
            label: "En partant de la définition",
            score: 1,
          },
          { value: "jeu", label: "À travers des jeux", score: 2 },
        ],
      },
      {
        id: "fr_primaire_3",
        text: "Quelle est votre méthode pour enrichir le vocabulaire des élèves ?",
        options: [
          { value: "lecture", label: "Lecture régulière", score: 3 },
          { value: "mots_du_jour", label: "Mot du jour", score: 2 },
          { value: "memorisation", label: "Listes à mémoriser", score: 1 },
        ],
      },
      {
        id: "fr_primaire_4",
        text: "Comment aidez-vous les élèves à comprendre un texte ?",
        options: [
          {
            value: "questions",
            label: "Par des questions de compréhension",
            score: 3,
          },
          {
            value: "lecture_expressive",
            label: "Lecture expressive",
            score: 2,
          },
          {
            value: "traduction",
            label: "Traduction en langue locale",
            score: 1,
          },
        ],
      },
      {
        id: "fr_primaire_5",
        text: "Quelle activité favorisez-vous pour travailler l’orthographe ?",
        options: [
          { value: "dictée", label: "Dictées régulières", score: 3 },
          { value: "jeux", label: "Jeux orthographiques", score: 2 },
          { value: "relecture", label: "Relecture autonome", score: 1 },
        ],
      },
      {
        id: "fr_primaire_6",
        text: "Comment travaillez-vous la production écrite avec vos élèves ?",
        options: [
          {
            value: "images",
            label: "Production à partir d'images",
            score: 2,
          },
          { value: "sujets_libres", label: "Sujets libres", score: 1 },
          { value: "textes_guides", label: "Guides structurés", score: 3 },
        ],
      },
      {
        id: "fr_primaire_7",
        text: "Comment corrigez-vous les erreurs de grammaire à l’écrit ?",
        options: [
          {
            value: "code",
            label: "Utilisation d’un code de correction",
            score: 2,
          },
          {
            value: "reformulation",
            label: "Reformulation avec l’élève",
            score: 3,
          },
          { value: "note", label: "Notation sans correction", score: 1 },
        ],
      },
      {
        id: "fr_primaire_8",
        text: "Quelle fréquence donnez-vous aux lectures à voix haute ?",
        options: [
          { value: "quotidienne", label: "Tous les jours", score: 3 },
          { value: "hebdo", label: "Une fois par semaine", score: 2 },
          { value: "rarement", label: "Occasionnellement", score: 1 },
        ],
      },
      {
        id: "fr_primaire_9",
        text: "Comment motivez-vous vos élèves à aimer lire ?",
        options: [
          {
            value: "bibliotheque",
            label: "Création d’un coin lecture",
            score: 3,
          },
          {
            value: "concours",
            label: "Organisation de concours de lecture",
            score: 2,
          },
          {
            value: "obligation",
            label: "Lecture imposée avec évaluation",
            score: 1,
          },
        ],
      },
      {
        id: "fr_primaire_10",
        text: "Quelle place donnez-vous à l’expression orale ?",
        options: [
          {
            value: "quotidien",
            label: "Prise de parole quotidienne",
            score: 3,
          },
          {
            value: "occasionnel",
            label: "Prise de parole lors d’activités spécifiques",
            score: 2,
          },
          { value: "rare", label: "Peu d’importance accordée", score: 1 },
        ],
      },
    ],
    "college/lycee": [
      {
        id: "fr_college_1",
        text: "Comment enseignez-vous l'analyse grammaticale ?",
        options: [
          {
            value: "exercices",
            label: "Beaucoup d'exercices pratiques",
            score: 3,
          },
          { value: "tableaux", label: "Tableaux récapitulatifs", score: 2 },
          { value: "theorie", label: "Explications théoriques", score: 1 },
        ],
      },
      {
        id: "fr_college_2",
        text: "Comment abordez-vous les textes littéraires classiques ?",
        options: [
          {
            value: "contextualisation",
            label: "Contexte historique et culturel",
            score: 3,
          },
          {
            value: "lecture_commentee",
            label: "Lecture commentée linéaire",
            score: 2,
          },
          { value: "resume", label: "Résumé suivi de questions", score: 1 },
        ],
      },
      {
        id: "fr_college_3",
        text: "Comment travaillez-vous la dissertation avec vos élèves ?",
        options: [
          {
            value: "plan_detaille",
            label: "Construction de plans détaillés",
            score: 3,
          },
          {
            value: "sujets_corriges",
            label: "Analyse de sujets corrigés",
            score: 2,
          },
          { value: "expose_theorique", label: "Exposé des règles", score: 1 },
        ],
      },
      {
        id: "fr_college_4",
        text: "Quelle méthode utilisez-vous pour enseigner l’orthographe ?",
        options: [
          { value: "texte_a_lacunes", label: "Textes à corriger", score: 3 },
          { value: "dictees", label: "Dictées régulières", score: 2 },
          {
            value: "lecons_classiques",
            label: "Leçons classiques et bilans",
            score: 1,
          },
        ],
      },
      {
        id: "fr_college_5",
        text: "Comment gérez-vous l’enseignement de l’argumentation ?",
        options: [
          { value: "debats", label: "Débats en classe", score: 3 },
          {
            value: "analyse_textes",
            label: "Analyse de textes argumentatifs",
            score: 2,
          },
          { value: "definition", label: "Définitions et schémas", score: 1 },
        ],
      },
      {
        id: "fr_college_6",
        text: "Quelle approche avez-vous pour améliorer l’expression écrite ?",
        options: [
          {
            value: "ecriture_creative",
            label: "Écriture créative",
            score: 3,
          },
          { value: "fiches_memo", label: "Fiches méthodologiques", score: 2 },
          {
            value: "corrections_collectives",
            label: "Corrections collectives",
            score: 1,
          },
        ],
      },
      {
        id: "fr_college_7",
        text: "Comment évaluez-vous la compréhension orale ?",
        options: [
          {
            value: "audio_questions",
            label: "Extraits audio suivis de questions",
            score: 3,
          },
          {
            value: "prise_de_notes",
            label: "Prise de notes pendant l’écoute",
            score: 2,
          },
          { value: "resume_oral", label: "Demande de résumé oral", score: 1 },
        ],
      },
      {
        id: "fr_college_8",
        text: "Comment favorisez-vous la prise de parole en continu ?",
        options: [
          { value: "expose", label: "Exposés oraux", score: 3 },
          {
            value: "lecture_expressive",
            label: "Lecture expressive à voix haute",
            score: 2,
          },
          {
            value: "interrogation",
            label: "Interrogations ponctuelles",
            score: 1,
          },
        ],
      },
      {
        id: "fr_college_9",
        text: "Quelle place donnez-vous aux activités interdisciplinaires ?",
        options: [
          {
            value: "collaboration",
            label: "Projets avec d'autres matières",
            score: 3,
          },
          {
            value: "integrer_theme",
            label: "Intégration de thèmes communs",
            score: 2,
          },
          {
            value: "rare",
            label: "Peu ou pas d'activités croisées",
            score: 1,
          },
        ],
      },
      {
        id: "fr_college_10",
        text: "Comment préparez-vous les élèves aux examens officiels ?",
        options: [
          {
            value: "entrainements_reguliers",
            label: "Entraînements réguliers sur sujets type",
            score: 3,
          },
          {
            value: "corrections_explicites",
            label: "Corrections explicites en classe",
            score: 2,
          },
          {
            value: "revisions_autonomes",
            label: "Révisions individuelles guidées",
            score: 1,
          },
        ],
      },
    ],
  },
  Anglais: {
    primaire: [
      {
        id: "anglais_primaire_1",
        text: "Comment enseignez-vous l'alphabet anglais ?",
        options: [
          { value: "recitation", label: "Récitation simple", score: 1 },
          { value: "chanson", label: "Chanson de l'alphabet", score: 3 },
          { value: "ecriture", label: "Écriture répétée", score: 2 },
        ],
      },
      {
        id: "anglais_primaire_2",
        text: "Comment introduisez-vous le vocabulaire de base ?",
        options: [
          { value: "liste", label: "Listes de mots à apprendre", score: 1 },
          {
            value: "images",
            label: "Images et associations visuelles",
            score: 3,
          },
          { value: "repetition", label: "Répétition orale", score: 2 },
        ],
      },
      {
        id: "anglais_primaire_3",
        text: "Quelle méthode utilisez-vous pour enseigner les salutations ?",
        options: [
          { value: "dialogue", label: "Dialogues simples", score: 2 },
          { value: "memorisation", label: "Mémorisation directe", score: 1 },
          { value: "jeux_role", label: "Jeux de rôle", score: 3 },
        ],
      },
      {
        id: "anglais_primaire_4",
        text: "Comment travaillez-vous la prononciation ?",
        options: [
          {
            value: "repetition",
            label: "Répétition après le professeur",
            score: 2,
          },
          {
            value: "phonetique",
            label: "Apprentissage phonétique",
            score: 1,
          },
          { value: "chansons", label: "Chansons et comptines", score: 3 },
        ],
      },
      {
        id: "anglais_primaire_5",
        text: "Comment enseignez-vous les couleurs en anglais ?",
        options: [
          { value: "objets", label: "Objets colorés en classe", score: 3 },
          { value: "tableau", label: "Écriture au tableau", score: 1 },
          { value: "dessins", label: "Dessins et coloriages", score: 2 },
        ],
      },
      {
        id: "anglais_primaire_6",
        text: "Quelle approche utilisez-vous pour les nombres ?",
        options: [
          { value: "comptage", label: "Comptage avec les doigts", score: 3 },
          { value: "ecriture", label: "Écriture des nombres", score: 1 },
          { value: "jeux", label: "Jeux de comptage", score: 2 },
        ],
      },
      {
        id: "anglais_primaire_7",
        text: "Comment introduisez-vous les animaux en anglais ?",
        options: [
          { value: "sons", label: "Imitation des cris d'animaux", score: 3 },
          { value: "liste", label: "Liste de vocabulaire", score: 1 },
          { value: "histoires", label: "Histoires avec animaux", score: 2 },
        ],
      },
      {
        id: "anglais_primaire_8",
        text: "Comment travaillez-vous l'écoute ?",
        options: [
          { value: "audio", label: "Enregistrements audio", score: 2 },
          { value: "dictee", label: "Dictées simples", score: 1 },
          { value: "chansons", label: "Chansons anglaises", score: 3 },
        ],
      },
      {
        id: "anglais_primaire_9",
        text: "Quelle méthode pour enseigner les verbes d'action ?",
        options: [
          { value: "gestes", label: "Gestes et mimiques", score: 3 },
          { value: "traduction", label: "Traduction directe", score: 1 },
          { value: "phrases", label: "Phrases d'exemple", score: 2 },
        ],
      },
      {
        id: "anglais_primaire_10",
        text: "Comment évaluez-vous la compréhension ?",
        options: [
          { value: "oral", label: "Questions orales", score: 2 },
          { value: "ecrit", label: "Exercices écrits", score: 1 },
          { value: "jeux", label: "Jeux interactifs", score: 3 },
        ],
      },
    ],
    "college/lycee": [
      {
        id: "anglais_college_1",
        text: "Comment abordez-vous la grammaire anglaise ?",
        options: [
          { value: "regles", label: "Règles et exceptions", score: 1 },
          { value: "contexte", label: "Grammaire en contexte", score: 3 },
          { value: "exercices", label: "Exercices systématiques", score: 2 },
        ],
      },
      {
        id: "anglais_college_2",
        text: "Comment développez-vous l'expression orale ?",
        options: [
          { value: "debats", label: "Débats et discussions", score: 3 },
          { value: "lecture", label: "Lecture à haute voix", score: 2 },
          { value: "recitation", label: "Récitation de textes", score: 1 },
        ],
      },
      {
        id: "anglais_college_3",
        text: "Quelle approche pour l'étude des textes littéraires ?",
        options: [
          {
            value: "analyse",
            label: "Analyse littéraire classique",
            score: 1,
          },
          { value: "adaptation", label: "Adaptations modernes", score: 2 },
          { value: "immersion", label: "Lecture immersive", score: 3 },
        ],
      },
      {
        id: "anglais_college_4",
        text: "Comment travaillez-vous la compréhension écrite ?",
        options: [
          {
            value: "questions",
            label: "Questions de compréhension",
            score: 2,
          },
          { value: "vocabulaire", label: "Étude du vocabulaire", score: 1 },
          { value: "discussion", label: "Discussion sur le texte", score: 3 },
        ],
      },
      {
        id: "anglais_college_5",
        text: "Comment enseignez-vous l'expression écrite ?",
        options: [
          { value: "redaction", label: "Rédaction guidée", score: 3 },
          { value: "modeles", label: "Modèles à suivre", score: 2 },
          { value: "grammaire", label: "Focus sur la grammaire", score: 1 },
        ],
      },
      {
        id: "anglais_college_6",
        text: "Quelle place donnez-vous à la culture anglophone ?",
        options: [
          { value: "centrale", label: "Aspect central du cours", score: 3 },
          { value: "complement", label: "Complément occasionnel", score: 2 },
          { value: "secondaire", label: "Aspect secondaire", score: 1 },
        ],
      },
      {
        id: "anglais_college_7",
        text: "Comment préparez-vous aux examens oraux ?",
        options: [
          { value: "simulations", label: "Simulations d'examens", score: 3 },
          {
            value: "presentation",
            label: "Présentations régulières",
            score: 2,
          },
          { value: "theorie", label: "Théorie et conseils", score: 1 },
        ],
      },
      {
        id: "anglais_college_8",
        text: "Comment gérez-vous les différents niveaux ?",
        options: [
          {
            value: "differenciation",
            label: "Pédagogie différenciée",
            score: 3,
          },
          { value: "groupes", label: "Travail en groupes", score: 2 },
          { value: "uniforme", label: "Approche uniforme", score: 1 },
        ],
      },
      {
        id: "anglais_college_9",
        text: "Quel rôle pour les médias anglophones ?",
        options: [
          { value: "regulier", label: "Utilisation régulière", score: 3 },
          { value: "occasionnel", label: "Usage occasionnel", score: 2 },
          { value: "rare", label: "Rarement utilisés", score: 1 },
        ],
      },
      {
        id: "anglais_college_10",
        text: "Comment évaluez-vous les progrès ?",
        options: [
          { value: "portfolio", label: "Portfolio de travaux", score: 3 },
          { value: "tests", label: "Tests réguliers", score: 2 },
          { value: "examen", label: "Examens formels", score: 1 },
        ],
      },
    ],
  },

  Philosophie: {
    primaire: [
      {
        id: "philo_primaire_1",
        text: "Comment introduisez-vous la réflexion philosophique ?",
        options: [
          { value: "questions", label: "Questions ouvertes", score: 3 },
          { value: "definitions", label: "Définitions claires", score: 1 },
          { value: "histoires", label: "Histoires à réflexion", score: 2 },
        ],
      },
      {
        id: "philo_primaire_2",
        text: "Comment travaillez-vous sur le concept de justice ?",
        options: [
          { value: "regles", label: "Règles de classe", score: 2 },
          { value: "theories", label: "Théories de justice", score: 1 },
          { value: "situations", label: "Situations concrètes", score: 3 },
        ],
      },
      {
        id: "philo_primaire_3",
        text: "Quelle approche pour parler du bonheur ?",
        options: [
          { value: "partage", label: "Partage d'expériences", score: 3 },
          { value: "definition", label: "Définition du bonheur", score: 1 },
          { value: "exemples", label: "Exemples variés", score: 2 },
        ],
      },
      {
        id: "philo_primaire_4",
        text: "Comment abordez-vous la différence ?",
        options: [
          {
            value: "tolerance",
            label: "Discussions sur la tolérance",
            score: 3,
          },
          { value: "categories", label: "Catégorisation", score: 1 },
          {
            value: "observation",
            label: "Observation et comparaison",
            score: 2,
          },
        ],
      },
      {
        id: "philo_primaire_5",
        text: "Comment travaillez-vous sur l'amitié ?",
        options: [
          { value: "vecu", label: "Expériences vécues", score: 3 },
          { value: "definition", label: "Définition de l'amitié", score: 1 },
          { value: "litterature", label: "Littérature jeunesse", score: 2 },
        ],
      },
      {
        id: "philo_primaire_6",
        text: "Quelle méthode pour parler de la vérité ?",
        options: [
          { value: "enquete", label: "Enquêtes et découvertes", score: 3 },
          { value: "opposition", label: "Vrai/faux", score: 1 },
          { value: "temoignages", label: "Témoignages", score: 2 },
        ],
      },
      {
        id: "philo_primaire_7",
        text: "Comment abordez-vous la mort avec les enfants ?",
        options: [
          { value: "ecoute", label: "Écoute et discussion", score: 3 },
          { value: "evitement", label: "Évitement du sujet", score: 1 },
          { value: "metaphores", label: "Métaphores douces", score: 2 },
        ],
      },
      {
        id: "philo_primaire_8",
        text: "Comment développez-vous l'esprit critique ?",
        options: [
          {
            value: "questionnement",
            label: "Questionnement constant",
            score: 3,
          },
          { value: "autorite", label: "Appel à l'autorité", score: 1 },
          { value: "comparaison", label: "Comparaison d'idées", score: 2 },
        ],
      },
      {
        id: "philo_primaire_9",
        text: "Quelle place pour les émotions ?",
        options: [
          { value: "expression", label: "Expression libre", score: 3 },
          { value: "controle", label: "Contrôle des émotions", score: 1 },
          { value: "analyse", label: "Analyse des émotions", score: 2 },
        ],
      },
      {
        id: "philo_primaire_10",
        text: "Comment évaluez-vous la réflexion philosophique ?",
        options: [
          { value: "participation", label: "Participation active", score: 3 },
          { value: "reponses", label: "Justesse des réponses", score: 1 },
          {
            value: "progression",
            label: "Progression du raisonnement",
            score: 2,
          },
        ],
      },
    ],
    "college/lycee": [
      {
        id: "philo_college_1",
        text: "Comment introduisez-vous les grands philosophes ?",
        options: [
          { value: "chronologie", label: "Ordre chronologique", score: 1 },
          { value: "problematiques", label: "Par problématiques", score: 3 },
          { value: "textes", label: "Lecture de textes", score: 2 },
        ],
      },
      {
        id: "philo_college_2",
        text: "Comment travaillez-vous la dissertation ?",
        options: [
          { value: "methode", label: "Méthode stricte", score: 1 },
          {
            value: "reflexion",
            label: "Développement de la réflexion",
            score: 3,
          },
          { value: "exemples", label: "Modèles et exemples", score: 2 },
        ],
      },
      {
        id: "philo_college_3",
        text: "Quelle approche pour l'explication de texte ?",
        options: [
          { value: "analyse", label: "Analyse linéaire", score: 1 },
          {
            value: "comprehension",
            label: "Compréhension globale",
            score: 3,
          },
          { value: "structure", label: "Structure argumentative", score: 2 },
        ],
      },
      {
        id: "philo_college_4",
        text: "Comment abordez-vous l'éthique ?",
        options: [
          { value: "dilemmes", label: "Dilemmes moraux", score: 3 },
          { value: "theories", label: "Théories éthiques", score: 1 },
          { value: "cas", label: "Études de cas", score: 2 },
        ],
      },
      {
        id: "philo_college_5",
        text: "Comment enseignez-vous la logique ?",
        options: [
          { value: "formelle", label: "Logique formelle", score: 1 },
          { value: "pratique", label: "Application pratique", score: 3 },
          { value: "exercices", label: "Exercices types", score: 2 },
        ],
      },
      {
        id: "philo_college_6",
        text: "Quelle place pour l'actualité ?",
        options: [
          {
            value: "centrale",
            label: "Lien constant avec l'actualité",
            score: 3,
          },
          {
            value: "illustrative",
            label: "Illustrations ponctuelles",
            score: 2,
          },
          {
            value: "evitee",
            label: "Évitée au profit des classiques",
            score: 1,
          },
        ],
      },
      {
        id: "philo_college_7",
        text: "Comment développez-vous l'argumentation ?",
        options: [
          { value: "debats", label: "Débats structurés", score: 3 },
          { value: "modeles", label: "Modèles d'argumentation", score: 2 },
          { value: "regles", label: "Règles formelles", score: 1 },
        ],
      },
      {
        id: "philo_college_8",
        text: "Comment gérez-vous les questions sensibles ?",
        options: [
          { value: "ouverture", label: "Discussion ouverte", score: 3 },
          { value: "prudence", label: "Approche prudente", score: 2 },
          { value: "evitement", label: "Évitement", score: 1 },
        ],
      },
      {
        id: "philo_college_9",
        text: "Quel rôle pour la créativité ?",
        options: [
          { value: "encourage", label: "Fortement encouragée", score: 3 },
          { value: "cadree", label: "Encadrée par la méthode", score: 2 },
          { value: "limitee", label: "Limitée par la rigueur", score: 1 },
        ],
      },
      {
        id: "philo_college_10",
        text: "Comment préparez-vous au baccalauréat ?",
        options: [
          { value: "entrainement", label: "Entraînement intensif", score: 2 },
          {
            value: "competences",
            label: "Développement des compétences",
            score: 3,
          },
          { value: "bachotage", label: "Bachotage ciblé", score: 1 },
        ],
      },
    ],
  },

  Histoire: {
    primaire: [
      {
        id: "histoire_primaire_1",
        text: "Comment introduisez-vous la notion de temps ?",
        options: [
          { value: "chronologie", label: "Ligne chronologique", score: 2 },
          { value: "abstrait", label: "Concept abstrait", score: 1 },
          { value: "vecu", label: "Temps vécu de l'enfant", score: 3 },
        ],
      },
      {
        id: "histoire_primaire_2",
        text: "Comment enseignez-vous la préhistoire ?",
        options: [
          {
            value: "reconstitution",
            label: "Reconstitutions visuelles",
            score: 3,
          },
          { value: "dates", label: "Dates et périodes", score: 1 },
          { value: "outils", label: "Étude des outils", score: 2 },
        ],
      },
      {
        id: "histoire_primaire_3",
        text: "Quelle approche pour l'Antiquité ?",
        options: [
          {
            value: "civilisations",
            label: "Grandes civilisations",
            score: 2,
          },
          { value: "faits", label: "Faits historiques", score: 1 },
          { value: "vie_quotidienne", label: "Vie quotidienne", score: 3 },
        ],
      },
      {
        id: "histoire_primaire_4",
        text: "Comment abordez-vous le Moyen Âge ?",
        options: [
          { value: "chateaux", label: "Châteaux et chevaliers", score: 3 },
          {
            value: "chronologie",
            label: "Chronologie des événements",
            score: 1,
          },
          { value: "societe", label: "Organisation sociale", score: 2 },
        ],
      },
      {
        id: "histoire_primaire_5",
        text: "Comment travaillez-vous sur les documents ?",
        options: [
          { value: "observation", label: "Observation guidée", score: 3 },
          { value: "lecture", label: "Lecture de documents", score: 1 },
          { value: "questions", label: "Questions sur documents", score: 2 },
        ],
      },
      {
        id: "histoire_primaire_6",
        text: "Quelle place pour les personnages historiques ?",
        options: [
          { value: "recits", label: "Récits de vie", score: 3 },
          { value: "biographies", label: "Biographies factuelles", score: 1 },
          { value: "anecdotes", label: "Anecdotes marquantes", score: 2 },
        ],
      },
      {
        id: "histoire_primaire_7",
        text: "Comment introduisez-vous les guerres ?",
        options: [
          {
            value: "consequences",
            label: "Conséquences sur la vie",
            score: 3,
          },
          { value: "batailles", label: "Batailles et stratégies", score: 1 },
          { value: "temoignages", label: "Témoignages", score: 2 },
        ],
      },
      {
        id: "histoire_primaire_8",
        text: "Comment utilisez-vous les supports visuels ?",
        options: [
          { value: "immersion", label: "Immersion visuelle", score: 3 },
          { value: "illustration", label: "Simple illustration", score: 2 },
          { value: "decoration", label: "Décoration du cours", score: 1 },
        ],
      },
      {
        id: "histoire_primaire_9",
        text: "Quelle approche pour l'histoire locale ?",
        options: [
          {
            value: "decouverte",
            label: "Découverte du patrimoine",
            score: 3,
          },
          { value: "complement", label: "Complément au programme", score: 2 },
          { value: "ignore", label: "Peu abordée", score: 1 },
        ],
      },
      {
        id: "histoire_primaire_10",
        text: "Comment évaluez-vous les connaissances ?",
        options: [
          { value: "recit", label: "Récit d'événements", score: 3 },
          {
            value: "questions",
            label: "Questions de connaissances",
            score: 1,
          },
          {
            value: "chronologie",
            label: "Remise en ordre chronologique",
            score: 2,
          },
        ],
      },
    ],
    "college/lycee": [
      {
        id: "histoire_college_1",
        text: "Comment abordez-vous l'analyse de documents ?",
        options: [
          { value: "methode", label: "Méthode systématique", score: 1 },
          { value: "critique", label: "Esprit critique", score: 3 },
          {
            value: "information",
            label: "Extraction d'informations",
            score: 2,
          },
        ],
      },
      {
        id: "histoire_college_2",
        text: "Comment enseignez-vous les révolutions ?",
        options: [
          { value: "causes", label: "Causes et conséquences", score: 2 },
          { value: "dates", label: "Dates et chronologie", score: 1 },
          { value: "acteurs", label: "Acteurs et témoins", score: 3 },
        ],
      },
      {
        id: "histoire_college_3",
        text: "Quelle approche pour les guerres mondiales ?",
        options: [
          { value: "memoire", label: "Mémoire et témoignages", score: 3 },
          { value: "militaire", label: "Aspect militaire", score: 1 },
          { value: "politique", label: "Enjeux politiques", score: 2 },
        ],
      },
      {
        id: "histoire_college_4",
        text: "Comment travaillez-vous la composition ?",
        options: [
          { value: "plan", label: "Plan détaillé", score: 1 },
          { value: "reflexion", label: "Réflexion historique", score: 3 },
          { value: "modele", label: "Modèles types", score: 2 },
        ],
      },
      {
        id: "histoire_college_5",
        text: "Comment abordez-vous l'histoire contemporaine ?",
        options: [
          { value: "actualite", label: "Lien avec l'actualité", score: 3 },
          { value: "recul", label: "Recul historique", score: 2 },
          { value: "programme", label: "Strictement le programme", score: 1 },
        ],
      },
      {
        id: "histoire_college_6",
        text: "Quelle place pour l'histoire des mentalités ?",
        options: [
          { value: "importante", label: "Aspect central", score: 3 },
          { value: "complement", label: "Complément culturel", score: 2 },
          { value: "negligee", label: "Peu abordée", score: 1 },
        ],
      },
      {
        id: "histoire_college_7",
        text: "Comment utilisez-vous les sources primaires ?",
        options: [
          {
            value: "regulierement",
            label: "Utilisation régulière",
            score: 3,
          },
          {
            value: "occasionnellement",
            label: "Usage occasionnel",
            score: 2,
          },
          { value: "rarement", label: "Rarement utilisées", score: 1 },
        ],
      },
      {
        id: "histoire_college_8",
        text: "Comment gérez-vous les sujets polémiques ?",
        options: [
          { value: "debat", label: "Débat historique", score: 3 },
          { value: "presentation", label: "Présentation neutre", score: 2 },
          { value: "evitement", label: "Évitement", score: 1 },
        ],
      },
      {
        id: "histoire_college_9",
        text: "Quel rôle pour l'interdisciplinarité ?",
        options: [
          { value: "frequent", label: "Liens fréquents", score: 3 },
          { value: "occasionnel", label: "Liens occasionnels", score: 2 },
          { value: "isole", label: "Discipline isolée", score: 1 },
        ],
      },
      {
        id: "histoire_college_10",
        text: "Comment préparez-vous aux examens ?",
        options: [
          {
            value: "competences",
            label: "Développement des compétences",
            score: 3,
          },
          {
            value: "entrainement",
            label: "Entraînement méthodique",
            score: 2,
          },
          { value: "memorisation", label: "Mémorisation", score: 1 },
        ],
      },
    ],
  },
  SVT: {
    primaire: [
      {
        id: "svt_primaire_8",
        text: "Comment abordez-vous les cycles de vie ?",
        options: [
          { value: "elevage", label: "Élevage en classe", score: 3 },
          { value: "schemas", label: "Schémas de cycles", score: 2 },
          { value: "description", label: "Description des étapes", score: 1 },
        ],
      },
      {
        id: "svt_primaire_9",
        text: "Quelle approche pour l'environnement ?",
        options: [
          { value: "terrain", label: "Sorties sur le terrain", score: 3 },
          { value: "projets", label: "Projets environnementaux", score: 2 },
          {
            value: "sensibilisation",
            label: "Sensibilisation théorique",
            score: 1,
          },
        ],
      },
      {
        id: "svt_primaire_10",
        text: "Comment évaluez-vous les connaissances ?",
        options: [
          {
            value: "experience",
            label: "Expériences à reproduire",
            score: 3,
          },
          { value: "observation", label: "Observation guidée", score: 2 },
          { value: "questions", label: "Questions de cours", score: 1 },
        ],
      },
    ],
    "college/lycee": [
      {
        id: "svt_college_1",
        text: "Comment abordez-vous la démarche scientifique ?",
        options: [
          {
            value: "investigation",
            label: "Démarche d'investigation",
            score: 3,
          },
          {
            value: "demonstration",
            label: "Démonstration magistrale",
            score: 1,
          },
          { value: "exercices", label: "Exercices d'application", score: 2 },
        ],
      },
      {
        id: "svt_college_2",
        text: "Comment enseignez-vous la génétique ?",
        options: [
          { value: "concret", label: "Exemples concrets", score: 3 },
          { value: "calculs", label: "Calculs de probabilités", score: 1 },
          { value: "schemas", label: "Schémas explicatifs", score: 2 },
        ],
      },
      {
        id: "svt_college_3",
        text: "Quelle approche pour l'évolution ?",
        options: [
          { value: "preuves", label: "Étude des preuves", score: 3 },
          { value: "theories", label: "Théories évolutives", score: 2 },
          {
            value: "chronologie",
            label: "Chronologie des espèces",
            score: 1,
          },
        ],
      },
      {
        id: "svt_college_4",
        text: "Comment travaillez-vous en laboratoire ?",
        options: [
          { value: "autonomie", label: "Travail en autonomie", score: 3 },
          { value: "guide", label: "Protocoles guidés", score: 2 },
          { value: "demonstration", label: "Démonstrations", score: 1 },
        ],
      },
      {
        id: "svt_college_5",
        text: "Comment abordez-vous l'écologie ?",
        options: [
          { value: "ecosystemes", label: "Étude d'écosystèmes", score: 3 },
          { value: "chaines", label: "Chaînes alimentaires", score: 2 },
          {
            value: "definitions",
            label: "Définitions écologiques",
            score: 1,
          },
        ],
      },
      {
        id: "svt_college_6",
        text: "Quelle place pour les technologies ?",
        options: [
          { value: "integrees", label: "Intégrées aux activités", score: 3 },
          {
            value: "demonstrations",
            label: "Démonstrations ponctuelles",
            score: 2,
          },
          { value: "limitees", label: "Usage limité", score: 1 },
        ],
      },
      {
        id: "svt_college_7",
        text: "Comment gérez-vous les manipulations ?",
        options: [
          {
            value: "securite_active",
            label: "Sécurité avec manipulation",
            score: 3,
          },
          {
            value: "securite_passive",
            label: "Sécurité par évitement",
            score: 1,
          },
          { value: "encadrement", label: "Encadrement strict", score: 2 },
        ],
      },
      {
        id: "svt_college_8",
        text: "Comment abordez-vous la reproduction ?",
        options: [
          { value: "scientifique", label: "Approche scientifique", score: 3 },
          { value: "biologique", label: "Aspects biologiques", score: 2 },
          { value: "minimale", label: "Approche minimale", score: 1 },
        ],
      },
      {
        id: "svt_college_9",
        text: "Quel rôle pour l'interdisciplinarité ?",
        options: [
          {
            value: "projets",
            label: "Projets interdisciplinaires",
            score: 3,
          },
          { value: "liens", label: "Liens ponctuels", score: 2 },
          { value: "isole", label: "Discipline isolée", score: 1 },
        ],
      },
      {
        id: "svt_college_10",
        text: "Comment préparez-vous aux examens ?",
        options: [
          {
            value: "competences",
            label: "Développement des compétences",
            score: 3,
          },
          {
            value: "entrainement",
            label: "Entraînement méthodique",
            score: 2,
          },
          {
            value: "connaissances",
            label: "Acquisition de connaissances",
            score: 1,
          },
        ],
      },
    ],
  },
  Informatique: {
    primaire: [
      {
        id: "info_primaire_1",
        text: "Comment initiez-vous les enfants à l'utilisation de l'ordinateur ?",
        options: [
          { value: "theorie", label: "Explication théorique", score: 1 },
          { value: "pratique", label: "Manipulation directe", score: 3 },
          { value: "videos", label: "Vidéos explicatives", score: 2 },
        ],
      },
      {
        id: "info_primaire_2",
        text: "Comment enseignez-vous les bases du clavier ?",
        options: [
          {
            value: "memorisation",
            label: "Mémorisation des touches",
            score: 1,
          },
          { value: "jeux_frappe", label: "Jeux de frappe", score: 3 },
          { value: "exercices", label: "Exercices répétitifs", score: 2 },
        ],
      },
      {
        id: "info_primaire_3",
        text: "Quelle approche utilisez-vous pour enseigner Paint/dessin ?",
        options: [
          { value: "outils", label: "Présentation des outils", score: 1 },
          { value: "creation", label: "Création libre guidée", score: 3 },
          { value: "copie", label: "Reproduction de modèles", score: 2 },
        ],
      },
      {
        id: "info_primaire_4",
        text: "Comment introduisez-vous Internet aux enfants ?",
        options: [
          { value: "navigation", label: "Navigation libre", score: 1 },
          { value: "securite", label: "Sécurité et sites éducatifs", score: 3 },
          { value: "recherche", label: "Techniques de recherche", score: 2 },
        ],
      },
      {
        id: "info_primaire_5",
        text: "Comment enseignez-vous les logiciels de traitement de texte ?",
        options: [
          { value: "fonctions", label: "Toutes les fonctions", score: 1 },
          { value: "bases", label: "Bases avec projets simples", score: 3 },
          { value: "exercices", label: "Exercices guidés", score: 2 },
        ],
      },
      {
        id: "info_primaire_6",
        text: "Quelle méthode utilisez-vous pour enseigner les dossiers/fichiers ?",
        options: [
          { value: "theorie", label: "Explication théorique", score: 1 },
          { value: "manipulation", label: "Manipulation pratique", score: 3 },
          { value: "schemas", label: "Schémas explicatifs", score: 2 },
        ],
      },
      {
        id: "info_primaire_7",
        text: "Comment abordez-vous les jeux éducatifs informatiques ?",
        options: [
          { value: "libre", label: "Jeu libre", score: 1 },
          { value: "pedagogique", label: "Sélection pédagogique", score: 3 },
          { value: "competition", label: "Compétitions amicales", score: 2 },
        ],
      },
      {
        id: "info_primaire_8",
        text: "Comment enseignez-vous l'impression de documents ?",
        options: [
          { value: "demonstration", label: "Démonstration simple", score: 1 },
          {
            value: "pratique",
            label: "Pratique avec leurs créations",
            score: 3,
          },
          { value: "etapes", label: "Étapes détaillées", score: 2 },
        ],
      },
      {
        id: "info_primaire_9",
        text: "Quelle approche utilisez-vous pour enseigner les emails ?",
        options: [
          { value: "technique", label: "Aspects techniques", score: 1 },
          {
            value: "communication",
            label: "Communication respectueuse",
            score: 3,
          },
          { value: "redaction", label: "Rédaction de messages", score: 2 },
        ],
      },
      {
        id: "info_primaire_10",
        text: "Comment évaluez-vous les compétences informatiques des élèves ?",
        options: [
          { value: "quiz", label: "Quiz théoriques", score: 1 },
          { value: "projets", label: "Projets pratiques", score: 3 },
          { value: "exercices", label: "Exercices d'application", score: 2 },
        ],
      },
    ],
    "college/lycee": [
      {
        id: "info_college_1",
        text: "Comment enseignez-vous les langages de programmation ?",
        options: [
          { value: "syntaxe", label: "Apprentissage de la syntaxe", score: 1 },
          { value: "projets", label: "Projets concrets", score: 3 },
          { value: "exercices", label: "Exercices progressifs", score: 2 },
        ],
      },
      {
        id: "info_college_2",
        text: "Quelle approche utilisez-vous pour enseigner les bases de données ?",
        options: [
          { value: "theorie", label: "Théorie des SGBD", score: 1 },
          { value: "pratique", label: "Création de bases réelles", score: 3 },
          { value: "exemples", label: "Exemples d'utilisation", score: 2 },
        ],
      },
      {
        id: "info_college_3",
        text: "Comment abordez-vous la sécurité informatique ?",
        options: [
          { value: "cours", label: "Cours théorique", score: 1 },
          { value: "scenarios", label: "Scénarios réels", score: 3 },
          { value: "regles", label: "Règles de sécurité", score: 2 },
        ],
      },
      {
        id: "info_college_4",
        text: "Comment enseignez-vous les réseaux informatiques ?",
        options: [
          { value: "protocoles", label: "Protocoles techniques", score: 1 },
          { value: "simulation", label: "Simulation de réseaux", score: 3 },
          { value: "schemas", label: "Schémas explicatifs", score: 2 },
        ],
      },
      {
        id: "info_college_5",
        text: "Quelle méthode utilisez-vous pour enseigner Excel/tableurs ?",
        options: [
          { value: "fonctions", label: "Toutes les fonctions", score: 1 },
          { value: "cas_pratiques", label: "Cas pratiques", score: 3 },
          { value: "exercices", label: "Exercices guidés", score: 2 },
        ],
      },
      {
        id: "info_college_6",
        text: "Comment abordez-vous le développement web ?",
        options: [
          { value: "html_css", label: "HTML/CSS uniquement", score: 1 },
          {
            value: "projet_complet",
            label: "Projet de site complet",
            score: 3,
          },
          { value: "etapes", label: "Étapes progressives", score: 2 },
        ],
      },
      {
        id: "info_college_7",
        text: "Comment enseignez-vous l'algorithmique ?",
        options: [
          { value: "algorithmes", label: "Algorithmes classiques", score: 1 },
          { value: "resolution", label: "Résolution de problèmes", score: 3 },
          { value: "organigrammes", label: "Organigrammes", score: 2 },
        ],
      },
      {
        id: "info_college_8",
        text: "Quelle approche utilisez-vous pour les logiciels de présentation ?",
        options: [
          {
            value: "fonctionnalites",
            label: "Toutes les fonctionnalités",
            score: 1,
          },
          {
            value: "presentations",
            label: "Création de présentations",
            score: 3,
          },
          { value: "modeles", label: "Utilisation de modèles", score: 2 },
        ],
      },
      {
        id: "info_college_9",
        text: "Comment gérez-vous les projets informatiques d'élèves ?",
        options: [
          { value: "individuel", label: "Travail individuel", score: 1 },
          { value: "equipe", label: "Travail en équipe", score: 3 },
          { value: "suivi", label: "Suivi personnalisé", score: 2 },
        ],
      },
      {
        id: "info_college_10",
        text: "Comment évaluez-vous les compétences avancées ?",
        options: [
          { value: "examens", label: "Examens écrits", score: 1 },
          { value: "projets", label: "Projets pratiques", score: 3 },
          { value: "presentations", label: "Présentations orales", score: 2 },
        ],
      },
    ],
  },

  ECM: {
    primaire: [
      {
        id: "ecm_primaire_1",
        text: "Comment enseignez-vous les valeurs civiques aux enfants ?",
        options: [
          { value: "recitation", label: "Récitation de règles", score: 1 },
          { value: "jeux_roles", label: "Jeux de rôles", score: 3 },
          { value: "histoires", label: "Histoires morales", score: 2 },
        ],
      },
      {
        id: "ecm_primaire_2",
        text: "Quelle approche utilisez-vous pour enseigner le respect ?",
        options: [
          { value: "regles", label: "Énumération des règles", score: 1 },
          { value: "situations", label: "Situations concrètes", score: 3 },
          { value: "exemples", label: "Exemples de personnages", score: 2 },
        ],
      },
      {
        id: "ecm_primaire_3",
        text: "Comment abordez-vous les symboles nationaux ?",
        options: [
          { value: "memorisation", label: "Mémorisation simple", score: 1 },
          { value: "activites", label: "Activités créatives", score: 3 },
          { value: "chants", label: "Chants patriotiques", score: 2 },
        ],
      },
      {
        id: "ecm_primaire_4",
        text: "Comment enseignez-vous les droits de l'enfant ?",
        options: [
          { value: "liste", label: "Liste des droits", score: 1 },
          { value: "scenarios", label: "Scénarios de vie", score: 3 },
          { value: "dessins", label: "Dessins explicatifs", score: 2 },
        ],
      },
      {
        id: "ecm_primaire_5",
        text: "Quelle méthode utilisez-vous pour enseigner la propreté ?",
        options: [
          { value: "hygiene", label: "Règles d'hygiène", score: 1 },
          { value: "pratique", label: "Pratique quotidienne", score: 3 },
          { value: "affiches", label: "Affiches éducatives", score: 2 },
        ],
      },
      {
        id: "ecm_primaire_6",
        text: "Comment abordez-vous la vie en société ?",
        options: [
          { value: "regles_sociales", label: "Règles sociales", score: 1 },
          { value: "simulations", label: "Simulations de vie", score: 3 },
          { value: "discussions", label: "Discussions guidées", score: 2 },
        ],
      },
      {
        id: "ecm_primaire_7",
        text: "Comment enseignez-vous l'entraide ?",
        options: [
          { value: "morale", label: "Leçons de morale", score: 1 },
          { value: "projets", label: "Projets de groupe", score: 3 },
          { value: "temoignages", label: "Témoignages", score: 2 },
        ],
      },
      {
        id: "ecm_primaire_8",
        text: "Quelle approche utilisez-vous pour la sécurité routière ?",
        options: [
          { value: "code", label: "Code de la route", score: 1 },
          { value: "simulation", label: "Simulation de circulation", score: 3 },
          { value: "panneaux", label: "Reconnaissance des panneaux", score: 2 },
        ],
      },
      {
        id: "ecm_primaire_9",
        text: "Comment abordez-vous les différences culturelles ?",
        options: [
          { value: "tolerance", label: "Prêche de tolérance", score: 1 },
          { value: "echanges", label: "Échanges interculturels", score: 3 },
          {
            value: "presentations",
            label: "Présentations culturelles",
            score: 2,
          },
        ],
      },
      {
        id: "ecm_primaire_10",
        text: "Comment évaluez-vous les comportements civiques ?",
        options: [
          { value: "interrogations", label: "Interrogations orales", score: 1 },
          {
            value: "observation",
            label: "Observation des comportements",
            score: 3,
          },
          { value: "quizz", label: "Quiz sur les valeurs", score: 2 },
        ],
      },
    ],
    "college/lycee": [
      {
        id: "ecm_college_1",
        text: "Comment enseignez-vous les institutions démocratiques ?",
        options: [
          { value: "cours_magistral", label: "Cours magistral", score: 1 },
          { value: "debats", label: "Débats et simulations", score: 3 },
          { value: "etudes_cas", label: "Études de cas", score: 2 },
        ],
      },
      {
        id: "ecm_college_2",
        text: "Quelle approche utilisez-vous pour enseigner les droits humains ?",
        options: [
          { value: "declaration", label: "Déclaration universelle", score: 1 },
          {
            value: "cas_concrets",
            label: "Cas concrets d'actualité",
            score: 3,
          },
          { value: "histoire", label: "Histoire des droits", score: 2 },
        ],
      },
      {
        id: "ecm_college_3",
        text: "Comment abordez-vous la citoyenneté active ?",
        options: [
          { value: "devoirs", label: "Devoirs du citoyen", score: 1 },
          { value: "projets", label: "Projets communautaires", score: 3 },
          { value: "exemples", label: "Exemples d'engagement", score: 2 },
        ],
      },
      {
        id: "ecm_college_4",
        text: "Comment enseignez-vous la Constitution ?",
        options: [
          { value: "articles", label: "Lecture des articles", score: 1 },
          { value: "applications", label: "Applications pratiques", score: 3 },
          {
            value: "comparaisons",
            label: "Comparaisons historiques",
            score: 2,
          },
        ],
      },
      {
        id: "ecm_college_5",
        text: "Quelle méthode utilisez-vous pour enseigner l'État de droit ?",
        options: [
          { value: "definitions", label: "Définitions juridiques", score: 1 },
          { value: "scenarios", label: "Scénarios de violation", score: 3 },
          { value: "institutions", label: "Rôle des institutions", score: 2 },
        ],
      },
      {
        id: "ecm_college_6",
        text: "Comment abordez-vous les questions de corruption ?",
        options: [
          { value: "condamnation", label: "Condamnation morale", score: 1 },
          { value: "analyses", label: "Analyses de cas", score: 3 },
          { value: "prevention", label: "Mesures de prévention", score: 2 },
        ],
      },
      {
        id: "ecm_college_7",
        text: "Comment enseignez-vous les élections ?",
        options: [
          { value: "processus", label: "Processus électoral", score: 1 },
          { value: "simulation", label: "Simulation d'élections", score: 3 },
          { value: "systemes", label: "Systèmes électoraux", score: 2 },
        ],
      },
      {
        id: "ecm_college_8",
        text: "Quelle approche utilisez-vous pour les conflits sociaux ?",
        options: [
          { value: "theories", label: "Théories du conflit", score: 1 },
          { value: "mediation", label: "Techniques de médiation", score: 3 },
          { value: "etudes", label: "Études de conflits", score: 2 },
        ],
      },
      {
        id: "ecm_college_9",
        text: "Comment abordez-vous l'éducation financière ?",
        options: [
          { value: "notions", label: "Notions théoriques", score: 1 },
          { value: "pratique", label: "Gestion pratique", score: 3 },
          { value: "exemples", label: "Exemples de budget", score: 2 },
        ],
      },
      {
        id: "ecm_college_10",
        text: "Comment évaluez-vous l'engagement civique des élèves ?",
        options: [
          { value: "examens", label: "Examens écrits", score: 1 },
          { value: "projets", label: "Projets d'engagement", score: 3 },
          { value: "presentations", label: "Présentations orales", score: 2 },
        ],
      },
    ],
  },

  Géographie: {
    primaire: [
      {
        id: "geo_primaire_1",
        text: "Comment enseignez-vous l'orientation spatiale aux enfants ?",
        options: [
          {
            value: "points_cardinaux",
            label: "Points cardinaux théoriques",
            score: 1,
          },
          { value: "jeux_orientation", label: "Jeux d'orientation", score: 3 },
          { value: "cartes", label: "Lecture de cartes simples", score: 2 },
        ],
      },
      {
        id: "geo_primaire_2",
        text: "Quelle approche utilisez-vous pour enseigner les paysages ?",
        options: [
          { value: "definitions", label: "Définitions de types", score: 1 },
          { value: "sorties", label: "Sorties d'observation", score: 3 },
          { value: "images", label: "Analyse d'images", score: 2 },
        ],
      },
      {
        id: "geo_primaire_3",
        text: "Comment abordez-vous les continents et océans ?",
        options: [
          { value: "memorisation", label: "Mémorisation par cœur", score: 1 },
          { value: "puzzles", label: "Puzzles et jeux", score: 3 },
          { value: "cartes", label: "Cartes murales", score: 2 },
        ],
      },
      {
        id: "geo_primaire_4",
        text: "Comment enseignez-vous le climat ?",
        options: [
          { value: "definitions", label: "Définitions météo", score: 1 },
          {
            value: "observations",
            label: "Observations quotidiennes",
            score: 3,
          },
          { value: "saisons", label: "Cycle des saisons", score: 2 },
        ],
      },
      {
        id: "geo_primaire_5",
        text: "Quelle méthode utilisez-vous pour enseigner les pays ?",
        options: [
          { value: "capitales", label: "Capitales et drapeaux", score: 1 },
          { value: "cultures", label: "Cultures et traditions", score: 3 },
          {
            value: "localisation",
            label: "Localisation géographique",
            score: 2,
          },
        ],
      },
      {
        id: "geo_primaire_6",
        text: "Comment abordez-vous la cartographie ?",
        options: [
          { value: "lecture", label: "Lecture de cartes", score: 1 },
          { value: "creation", label: "Création de cartes", score: 3 },
          { value: "legende", label: "Utilisation de légendes", score: 2 },
        ],
      },
      {
        id: "geo_primaire_7",
        text: "Comment enseignez-vous les ressources naturelles ?",
        options: [
          {
            value: "enumeration",
            label: "Énumération des ressources",
            score: 1,
          },
          {
            value: "protection",
            label: "Protection de l'environnement",
            score: 3,
          },
          {
            value: "utilisation",
            label: "Utilisation des ressources",
            score: 2,
          },
        ],
      },
      {
        id: "geo_primaire_8",
        text: "Quelle approche utilisez-vous pour les reliefs ?",
        options: [
          { value: "vocabulaire", label: "Vocabulaire technique", score: 1 },
          { value: "maquettes", label: "Maquettes et modélisation", score: 3 },
          { value: "photos", label: "Photos de reliefs", score: 2 },
        ],
      },
      {
        id: "geo_primaire_9",
        text: "Comment abordez-vous les activités humaines ?",
        options: [
          { value: "metiers", label: "Liste des métiers", score: 1 },
          { value: "visites", label: "Visites sur le terrain", score: 3 },
          { value: "documents", label: "Documents audiovisuels", score: 2 },
        ],
      },
      {
        id: "geo_primaire_10",
        text: "Comment évaluez-vous les connaissances géographiques ?",
        options: [
          { value: "cartes_muettes", label: "Cartes muettes", score: 1 },
          { value: "projets", label: "Projets de recherche", score: 3 },
          { value: "quizz", label: "Quiz interactifs", score: 2 },
        ],
      },
    ],
    "college/lycee": [
      {
        id: "geo_college_1",
        text: "Comment enseignez-vous la géographie physique ?",
        options: [
          { value: "cours_theorique", label: "Cours théorique", score: 1 },
          { value: "terrain", label: "Travail de terrain", score: 3 },
          {
            value: "cartes_topographiques",
            label: "Cartes topographiques",
            score: 2,
          },
        ],
      },
      {
        id: "geo_college_2",
        text: "Quelle approche utilisez-vous pour la géographie humaine ?",
        options: [
          { value: "statistiques", label: "Données statistiques", score: 1 },
          { value: "etudes_cas", label: "Études de cas locales", score: 3 },
          { value: "comparaisons", label: "Comparaisons régionales", score: 2 },
        ],
      },
      {
        id: "geo_college_3",
        text: "Comment abordez-vous l'urbanisation ?",
        options: [
          { value: "definitions", label: "Définitions et concepts", score: 1 },
          { value: "sorties_urbaines", label: "Sorties en ville", score: 3 },
          { value: "plans_villes", label: "Plans de villes", score: 2 },
        ],
      },
      {
        id: "geo_college_4",
        text: "Comment enseignez-vous les systèmes de production ?",
        options: [
          { value: "secteurs", label: "Secteurs d'activité", score: 1 },
          {
            value: "visites_entreprises",
            label: "Visites d'entreprises",
            score: 3,
          },
          { value: "schemas", label: "Schémas de production", score: 2 },
        ],
      },
      {
        id: "geo_college_5",
        text: "Quelle méthode utilisez-vous pour enseigner les flux ?",
        options: [
          { value: "cartes_flux", label: "Cartes de flux", score: 1 },
          { value: "simulations", label: "Simulations commerciales", score: 3 },
          { value: "graphiques", label: "Graphiques et données", score: 2 },
        ],
      },
      {
        id: "geo_college_6",
        text: "Comment abordez-vous la mondialisation ?",
        options: [
          { value: "theories", label: "Théories économiques", score: 1 },
          { value: "exemples_concrets", label: "Exemples concrets", score: 3 },
          { value: "debats", label: "Débats sur les enjeux", score: 2 },
        ],
      },
      {
        id: "geo_college_7",
        text: "Comment enseignez-vous les risques naturels ?",
        options: [
          {
            value: "classification",
            label: "Classification des risques",
            score: 1,
          },
          { value: "prevention", label: "Mesures de prévention", score: 3 },
          { value: "catastrophes", label: "Études de catastrophes", score: 2 },
        ],
      },
      {
        id: "geo_college_8",
        text: "Quelle approche utilisez-vous pour les inégalités ?",
        options: [
          { value: "indicateurs", label: "Indicateurs statistiques", score: 1 },
          {
            value: "temoignages",
            label: "Témoignages et reportages",
            score: 3,
          },
          {
            value: "cartes_thematiques",
            label: "Cartes thématiques",
            score: 2,
          },
        ],
      },
      {
        id: "geo_college_9",
        text: "Comment abordez-vous les enjeux environnementaux ?",
        options: [
          { value: "problemes", label: "Problèmes environnementaux", score: 1 },
          { value: "solutions", label: "Solutions durables", score: 3 },
          { value: "impacts", label: "Impacts sur l'environnement", score: 2 },
        ],
      },
      {
        id: "geo_college_10",
        text: "Comment évaluez-vous les compétences géographiques ?",
        options: [
          { value: "controles", label: "Contrôles de connaissances", score: 1 },
          { value: "dossiers", label: "Dossiers de recherche", score: 3 },
          { value: "croquis", label: "Réalisation de croquis", score: 2 },
        ],
      },
    ],
  },
};

// Questions générales sur la pédagogie
const GENERAL_QUESTIONS = [
  {
    id: "pedago_1",
    text: "Comment adaptez-vous votre enseignement à des élèves de niveaux différents ?",
    options: [
      {
        value: "meme_cours",
        label: "Je fais le même cours pour tous",
        score: 1,
      },
      {
        value: "adaptation",
        label: "J'adapte en fonction des besoins",
        score: 3,
      },
      { value: "groupes", label: "Je sépare en groupes de niveau", score: 2 },
    ],
  },
  {
    id: "pedago_2",
    text: "Comment gérez-vous un élève qui ne comprend pas malgré vos explications ?",
    options: [
      { value: "reformuler", label: "Je reformule différemment", score: 3 },
      { value: "exemples", label: "Je donne plus d'exemples", score: 2 },
      { value: "revenir", label: "Je reviens sur le cours", score: 1 },
    ],
  },
  {
    id: "pedago_3",
    text: "Quelle est votre méthode pour maintenir l'attention ?",
    options: [
      { value: "varier", label: "Je varie les activités", score: 3 },
      { value: "interaction", label: "Beaucoup d'interaction", score: 2 },
      { value: "rigueur", label: "Cadre strict", score: 1 },
    ],
  },
  {
    id: "pedago_4",
    text: "Comment motivez-vous les élèves en difficulté ?",
    options: [
      { value: "progress", label: "Je montre leurs progrès", score: 3 },
      {
        value: "encouragement",
        label: "Beaucoup d'encouragements",
        score: 2,
      },
      { value: "objectifs", label: "Je fixe des objectifs", score: 1 },
    ],
  },
  {
    id: "pedago_5",
    text: "Comment organisez-vous une séance type ?",
    options: [
      {
        value: "structure",
        label: "Structure claire avec variété",
        score: 3,
      },
      { value: "flexible", label: "Flexible selon les besoins", score: 2 },
      { value: "traditionnel", label: "Cours traditionnel", score: 1 },
    ],
  },
  {
    id: "pedago_6",
    text: "Quelle importance donnez-vous aux devoirs ?",
    options: [
      {
        value: "cibles",
        label: "Devoirs ciblés sur les difficultés",
        score: 3,
      },
      { value: "reguliers", label: "Devoirs réguliers", score: 2 },
      { value: "peu", label: "Peu de devoirs", score: 1 },
    ],
  },
  {
    id: "pedago_7",
    text: "Comment évaluez-vous les progrès ?",
    options: [
      { value: "diversifie", label: "Évaluations diversifiées", score: 3 },
      { value: "tests", label: "Petits tests réguliers", score: 2 },
      { value: "examens", label: "Examens traditionnels", score: 1 },
    ],
  },
  {
    id: "pedago_8",
    text: "Comment gérez-vous les retards ou absences ?",
    options: [
      { value: "accompagnement", label: "Séances de rattrapage", score: 3 },
      { value: "documents", label: "Je fournis des documents", score: 2 },
      {
        value: "responsabilite",
        label: "Responsabilité de l'élève",
        score: 1,
      },
    ],
  },
  {
    id: "pedago_9",
    text: "Quelle place donnez-vous à la créativité ?",
    options: [
      {
        value: "beaucoup",
        label: "Beaucoup, j'encourage les approches originales",
        score: 3,
      },
      { value: "parfois", label: "Parfois, selon le sujet", score: 2 },
      { value: "peu", label: "Peu, je privilégie la méthode", score: 1 },
    ],
  },
  {
    id: "pedago_10",
    text: "Comment utilisez-vous les technologies ?",
    options: [
      { value: "integrees", label: "Intégrées régulièrement", score: 3 },
      { value: "parfois", label: "Occasionnellement", score: 2 },
      { value: "peu", label: "Peu ou pas", score: 1 },
    ],
  },
  {
    id: "pedago_11",
    text: "Comment gérez-vous le stress des élèves avant les examens ?",
    options: [
      {
        value: "preparation",
        label: "Techniques de préparation mentale",
        score: 3,
      },
      { value: "entrainement", label: "Beaucoup d'entraînement", score: 2 },
      { value: "normal", label: "Je considère que c'est normal", score: 1 },
    ],
  },
  {
    id: "pedago_12",
    text: "Quelle importance donnez-vous au feedback ?",
    options: [
      { value: "detaille", label: "Feedback détaillé et régulier", score: 3 },
      { value: "corrections", label: "Corrections des travaux", score: 2 },
      { value: "notes", label: "Principalement les notes", score: 1 },
    ],
  },
  {
    id: "pedago_13",
    text: "Comment abordez-vous les erreurs des élèves ?",
    options: [
      {
        value: "apprentissage",
        label: "Comme opportunité d'apprentissage",
        score: 3,
      },
      {
        value: "correction",
        label: "Je les corrige systématiquement",
        score: 2,
      },
      { value: "penalisation", label: "Elles affectent la note", score: 1 },
    ],
  },
  {
    id: "pedago_14",
    text: "Comment encouragez-vous l'autonomie ?",
    options: [
      { value: "projets", label: "Par des projets personnels", score: 3 },
      { value: "recherche", label: "Travaux de recherche", score: 2 },
      { value: "exercices", label: "Exercices en autonomie", score: 1 },
    ],
  },
  {
    id: "pedago_15",
    text: "Quelle place donnez-vous au travail en groupe ?",
    options: [
      { value: "regulier", label: "Régulier et structuré", score: 3 },
      { value: "parfois", label: "Occasionnel", score: 2 },
      {
        value: "peu",
        label: "Peu, je privilégie le travail individuel",
        score: 1,
      },
    ],
  },
  {
    id: "pedago_16",
    text: "Comment gérez-vous les élèves turbulents ?",
    options: [
      { value: "dialogue", label: "Dialogue et contrat", score: 3 },
      { value: "cadre", label: "Cadre strict", score: 2 },
      { value: "sanctions", label: "Sanctions", score: 1 },
    ],
  },
  {
    id: "pedago_17",
    text: "Comment intégrez-vous les centres d'intérêt des élèves ?",
    options: [
      { value: "themes", label: "Dans le choix des thèmes", score: 3 },
      { value: "exemples", label: "Dans les exemples", score: 2 },
      { value: "peu", label: "Peu, je suis le programme", score: 1 },
    ],
  },
  {
    id: "pedago_18",
    text: "Quelle importance donnez-vous à la mémorisation ?",
    options: [
      {
        value: "techniques",
        label: "J'enseigne des techniques de mémorisation",
        score: 3,
      },
      { value: "repetition", label: "Par la répétition", score: 2 },
      { value: "naturel", label: "Cela vient naturellement", score: 1 },
    ],
  },
  {
    id: "pedago_19",
    text: "Comment gérez-vous les élèves en avance ?",
    options: [
      {
        value: "approfondissement",
        label: "Activités d'approfondissement",
        score: 3,
      },
      { value: "aider", label: "Ils aident les autres", score: 2 },
      { value: "exercices", label: "Plus d'exercices", score: 1 },
    ],
  },
  {
    id: "pedago_20",
    text: "Quelle est votre philosophie d'enseignement ?",
    options: [
      {
        value: "epanouissement",
        label: "Épanouissement de l'élève",
        score: 3,
      },
      { value: "savoir", label: "Transmission du savoir", score: 2 },
      { value: "resultats", label: "Obtenir des résultats", score: 1 },
    ],
  },
];
const TutorQuestionnaire = ({
  matieres,
  niveauPrincipal,
  currentQuestion,
  answers,
  onAnswer,
  onNavigate,
  onSubmit, // Added this prop
}) => {
  const getRelevantQuestions = () => {
    const selectedMatieres = matieres
      .map((id) => MATIERES.find((m) => m.id === id)?.nom)
      .filter(Boolean);

    let questions = [...GENERAL_QUESTIONS];

    selectedMatieres.forEach((matiere) => {
      if (QUESTIONS_BY_SUBJECT[matiere]?.[niveauPrincipal]) {
        questions = [
          ...questions,
          ...QUESTIONS_BY_SUBJECT[matiere][niveauPrincipal],
        ];
      }
    });

    return questions.sort(() => 0.5 - Math.random()).slice(0, 10);
  };

  const questions = getRelevantQuestions();
  const question = questions[currentQuestion];
  const currentAnswer = answers[question.id];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">
          Question {currentQuestion + 1}/{questions.length}
        </h3>
        <p className="mb-4">{question.text}</p>

        <div className="space-y-2 mb-6">
          {question.options.map((option) => (
            <button
              key={option.value}
              className={`w-full text-left p-3 rounded border ${
                currentAnswer === option.value
                  ? "bg-blue-100 border-blue-500"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
              onClick={() => onAnswer(question.id, option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="flex justify-between">
          {currentQuestion > 0 && (
            <button
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              onClick={() => onNavigate(-1)}
            >
              Précédent
            </button>
          )}
          {currentQuestion < questions.length - 1 ? (
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ml-auto"
              onClick={() => onNavigate(1)}
              disabled={!currentAnswer}
            >
              Suivant
            </button>
          ) : (
            <button
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ml-auto"
              onClick={onSubmit} // Using the passed onSubmit prop
              disabled={!currentAnswer}
            >
              Terminer
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Export des constantes pour utilisation dans Register.js
TutorQuestionnaire.MATIERES = MATIERES;
TutorQuestionnaire.QUESTIONS_BY_SUBJECT = QUESTIONS_BY_SUBJECT;
TutorQuestionnaire.GENERAL_QUESTIONS = GENERAL_QUESTIONS;

export default TutorQuestionnaire;
