import { db, documentsTable } from "@workspace/db";

const INITIAL_DOCS = [
  // Fiches
  { category: "fiches", name: "Fiche_Algo_Boucles.pdf", description: "Séance sur les structures de contrôle — boucles et itérations", date: "Oct. 2024", type: "pdf", path: "docs/fiches/Fiche_Algo_Boucles.pdf" },
  { category: "fiches", name: "Fiche_Python_Variables.pdf", description: "Introduction aux variables et types de données en Python", date: "Nov. 2024", type: "pdf", path: "docs/fiches/Fiche_Python_Variables.pdf" },
  { category: "fiches", name: "Fiche_Reseaux_Modele_OSI.pdf", description: "Présentation du modèle OSI et des couches réseau", date: "Jan. 2025", type: "pdf", path: "docs/fiches/Fiche_Reseaux_Modele_OSI.pdf" },
  { category: "fiches", name: "Fiche_BDD_Introduction.pdf", description: "Introduction aux bases de données relationnelles et SQL", date: "Mars 2025", type: "pdf", path: "docs/fiches/Fiche_BDD_Introduction.pdf" },
  // Grilles
  { category: "grilles", name: "Grille_Obs_Seance1.jpg", description: "Grille d'observation de la première séance encadrée", date: "Oct. 2024", type: "img", path: "docs/grilles/Grille_Obs_Seance1.jpg" },
  { category: "grilles", name: "Grille_Evaluation_Competences.pdf", description: "Grille d'évaluation par compétences pour les élèves", date: "Déc. 2024", type: "pdf", path: "docs/grilles/Grille_Evaluation_Competences.pdf" },
  { category: "grilles", name: "Grille_Autoeval_Formateur.pdf", description: "Grille d'autoévaluation remplie avec le formateur", date: "Fév. 2025", type: "pdf", path: "docs/grilles/Grille_Autoeval_Formateur.pdf" },
  // Supports
  { category: "supports", name: "Cours_Python_Intro.pptx", description: "Présentation d'introduction à Python avec exemples interactifs", date: "Nov. 2024", type: "ppt", path: "docs/supports/Cours_Python_Intro.pptx" },
  { category: "supports", name: "Support_Reseaux_TCP_IP.pdf", description: "Document de cours complet sur le protocole TCP/IP", date: "Jan. 2025", type: "pdf", path: "docs/supports/Support_Reseaux_TCP_IP.pdf" },
  { category: "supports", name: "Support_BDD_SQL.pdf", description: "Guide pratique SQL avec exercices corrigés", date: "Mars 2025", type: "pdf", path: "docs/supports/Support_BDD_SQL.pdf" },
  // PFF
  { category: "pff", name: "PFF_Salma_TICE_Enseignement.pdf", description: "Mémoire complet — L'apport des TICE dans l'enseignement de l'informatique au secondaire qualifiant", date: "Mai 2025", type: "pdf", path: "docs/pff/PFF_Salma_TICE_Enseignement.pdf" },
  // Productions
  { category: "productions", name: "Quiz_Kahoot_Algorithmique.pdf", description: "Export du quiz Kahoot utilisé pour la révision en classe", date: "Déc. 2024", type: "pdf", path: "docs/productions/Quiz_Kahoot_Algorithmique.pdf" },
  { category: "productions", name: "Enonce_Projet_Calculatrice.pdf", description: "Énoncé du mini-projet collaboratif sur Replit", date: "Fév. 2025", type: "pdf", path: "docs/productions/Enonce_Projet_Calculatrice.pdf" },
];

async function seed() {
  const existing = await db.select().from(documentsTable);
  if (existing.length > 0) {
    console.log(`DB already has ${existing.length} documents — skipping seed.`);
    process.exit(0);
  }
  await db.insert(documentsTable).values(INITIAL_DOCS);
  console.log(`Seeded ${INITIAL_DOCS.length} documents.`);
  process.exit(0);
}

seed().catch((e) => { console.error(e); process.exit(1); });
