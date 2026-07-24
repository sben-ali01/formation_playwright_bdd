/**
 * runner.js — Orchestrateur de pipeline de tests BDD
 * Rôle : nettoyer, exécuter les tests, générer et ouvrir le rapport Allure
 * Auteur : UpToTest
 */

// ─────────────────────────────────────────────
// IMPORTS
// ─────────────────────────────────────────────

// execSync  → exécute une commande et BLOQUE jusqu'à la fin (synchrone)
// spawn     → lance un processus en parallèle sans bloquer (asynchrone)
const { execSync, spawn } = require('child_process');

// fs → module natif Node.js pour lire/écrire/supprimer des fichiers et dossiers
const fs = require('fs');


// ─────────────────────────────────────────────
// ÉTAPE 1 — NETTOYAGE
// ─────────────────────────────────────────────

console.log('🧹 Nettoyage de allure-results...');

// Vérifie si le dossier allure-results existe déjà
// (évite une erreur si on tente de supprimer un dossier inexistant)
if (fs.existsSync('allure-results')) {

  // Supprime le dossier et tout son contenu (recursive: true = sous-dossiers inclus)
  // Sans ce nettoyage, les anciens résultats se mélangent aux nouveaux
  fs.rmSync('allure-results', { recursive: true });
}

// Recrée le dossier vide pour accueillir les nouveaux résultats
fs.mkdirSync('allure-results');


// ─────────────────────────────────────────────
// ÉTAPE 2 — LANCEMENT DES TESTS
// ─────────────────────────────────────────────

console.log('🧪 Lancement des tests...');

try {
  // Lance Cucumber avec la configuration définie dans cucumber.config.js
  // stdio: 'inherit' → affiche les logs directement dans le terminal (pas de capture)
  // execSync bloque ici jusqu'à ce que tous les tests soient terminés
  execSync('cucumber-js --config cucumber.config.js', {
    stdio: 'inherit'
  });

} catch (e) {
  // Si des tests échouent, Cucumber retourne un code d'erreur → execSync lève une exception
  // On attrape l'erreur MAIS on ne quitte pas le script (pas de process.exit)
  // Objectif : toujours générer le rapport, même en cas d'échec
  console.log('⚠️ Certains tests ont échoué — génération du rapport quand même');
}


// ─────────────────────────────────────────────
// ÉTAPE 3 — VÉRIFICATION DES RÉSULTATS
// ─────────────────────────────────────────────

// Lit la liste des fichiers présents dans allure-results
// Allure génère un fichier JSON par scénario exécuté
const files = fs.readdirSync('allure-results');
console.log(`📁 allure-results contient ${files.length} fichiers`);

// Si le dossier est vide, Cucumber n'a pas produit de données Allure
// Cause probable : le reporter allure n'est pas configuré dans cucumber.config.js
if (files.length === 0) {
  console.error('❌ allure-results est vide — vérifier cucumber.config.js');

  // On arrête le script avec un code d'erreur (1 = erreur)
  // Un code 0 signifierait "succès" — ici on signale un problème à l'OS
  process.exit(1);
}


// ─────────────────────────────────────────────
// ÉTAPE 4 — GÉNÉRATION DU RAPPORT HORODATÉ
// ─────────────────────────────────────────────

// Récupère la date et l'heure actuelles
const now = new Date();

// Utilitaire pour ajouter un zéro devant les nombres < 10 (ex: 9 → "09")
const pad = (n) => String(n).padStart(2, '0');

// Construit un timestamp lisible au format : 2025-06-14_10-30-00
// Les tirets remplacent les deux-points (interdits dans les noms de dossiers Windows)
const timestamp =
  `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}` +
  `_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;

// Chemin du dossier de sortie — chaque exécution génère son propre sous-dossier
// Avantage : on conserve l'historique de tous les rapports sans écraser le précédent
const outputDir = `allure-report/${timestamp}`;
console.log(`📊 Génération du rapport : ${outputDir}`);

// Génère le rapport HTML Allure dans outputDir
// --clean : supprime le contenu du dossier de destination avant de regénérer
// -o      : spécifie le dossier de sortie
execSync(`allure generate allure-results --clean -o ${outputDir}`, {
  stdio: 'inherit'
});


// ─────────────────────────────────────────────
// ÉTAPE 5 — OUVERTURE DU RAPPORT
// ─────────────────────────────────────────────

console.log('🌐 Ouverture du rapport...');

// spawn est utilisé ici à la place de execSync car le serveur web tourne en continu
// → execSync bloquerait le script indéfiniment
// spawn lance le processus en parallèle et rend la main immédiatement
//
// detached: false → le serveur s'arrête quand on ferme le terminal (comportement souhaité)
// stdio: 'inherit' → les logs du serveur s'affichent dans notre terminal
const server = spawn('allure', ['open', outputDir], {
  stdio: 'inherit',
  detached: false,
});

// Gestion d'erreur si la commande 'allure' n'est pas trouvée (ex: pas installé globalement)
server.on('error', (err) => {
  console.error('Erreur:', err.message);

  // On affiche la commande manuelle à exécuter pour ne pas bloquer l'apprenant
  console.log(`Lance manuellement : allure open ${outputDir}`);
});