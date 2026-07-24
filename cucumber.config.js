// =============================================================================
// cucumber.config.js
// =============================================================================
//
// RÔLE : Configurer le runner de tests Cucumber.
//        C'est le CHEF D'ORCHESTRE — il dit à Cucumber :
//          - Où chercher les fichiers .feature
//          - Quels fichiers TypeScript charger
//          - Comment afficher les résultats
//          - Quels scénarios exécuter (via les tags)
//
// IMPORTANT : Ce fichier est en .js (pas .ts) car Cucumber le lit
//             AVANT que ts-node soit chargé.
//             → Pas de TypeScript ici, uniquement du JavaScript.
//
// DIFFÉRENCE AVEC playwright.config.ts :
//   cucumber.config.js  → configure CUCUMBER  (quels tests, dans quel ordre)
//   playwright.config.ts → configure PLAYWRIGHT (le navigateur, les timeouts)
// =============================================================================

module.exports = {
// ↑ Syntaxe CommonJS obligatoire — pas d'export default ici
//   Node.js lit ce fichier directement, ts-node n'est pas encore actif

  default: {
  // ↑ La clé "default" est OBLIGATOIRE
  //   Sans elle → Cucumber ne trouve pas la configuration → 0 scenarios
  //   On peut créer d'autres profils (ex: "ci", "staging") à côté de "default"


    // -------------------------------------------------------------------------
    // PATHS — Où sont les fichiers .feature ?
    // -------------------------------------------------------------------------
    paths: ['src/features/**/*.feature'],
    // ↑ Liste des fichiers .feature à exécuter
    //   On pointe uniquement vers auth.feature pour ce premier scénario
    //   En version complète : ['src/features/**/*.feature']
    //   → ** = n'importe quel sous-dossier
    //   → *.feature = tous les fichiers .feature
    //
    //   Pour cibler un seul scénario par son nom :
    //   Utiliser --name "Connexion réussie" en ligne de commande


    // -------------------------------------------------------------------------
    // REQUIRE — Quels fichiers TypeScript charger au démarrage ?
    // -------------------------------------------------------------------------
    require: [
      'src/hooks/hooks.ts',
      // ↑ TOUJOURS EN PREMIER
      //   Contient BeforeAll (lance le navigateur) et After (ferme tout)
      //   Doit être chargé AVANT les steps pour que le navigateur
      //   soit prêt quand les steps s'exécutent

      'src/steps/**/*.steps.ts',
      // ↑ Les step definitions — implémentent les Given/When/Then du .feature
      //   Cucumber lit ce fichier pour associer chaque step à sa fonction

      'src/support/pageFixture.ts',
      // ↑ L'objet qui partage pageFixture.page entre tous les fichiers
      //   Doit être chargé pour que les steps et les pages y accèdent
    ],
    // ↑ L'ordre dans require COMPTE :
    //   hooks.ts d'abord → navigateur prêt
    //   steps ensuite → peuvent utiliser pageFixture.page
    //   pageFixture en dernier → déjà utilisé par les steps via import


    // -------------------------------------------------------------------------
    // REQUIREMODULE — Comment TypeScript est-il exécuté ?
    // -------------------------------------------------------------------------
    requireModule: ['ts-node/register'],
    // ↑ ts-node permet d'exécuter les fichiers .ts directement
    //   sans les compiler en .js au préalable
    //
    //   Sans ts-node/register → Cucumber ne sait pas lire le TypeScript :
    //   "SyntaxError: Cannot use import statement in a module"
    //
    //   ts-node/register s'enregistre comme handler pour les fichiers .ts
    //   → Cucumber peut ensuite require('fichier.ts') sans erreur


    // -------------------------------------------------------------------------
    // FORMAT — Comment afficher les résultats ?
    // -------------------------------------------------------------------------
   format: [
  'progress-bar',
  '@cucumber/pretty-formatter',
  'allure-cucumberjs/reporter',
      ["json", "rapports/cucumber-report.json"],
        ["html", "rapports/cucumber-report.html"]

  // ↑ Génère les données brutes dans allure-results/
  //   Lecture par Allure pour construire le rapport HTML
],
 tags: '@registration',
    // ↑ Affiche une barre de progression dans le terminal pendant l'exécution
    //   Plus lisible que le format par défaut
    //
    //   Autres formats disponibles :
    //   'summary'      → résumé court en fin d'exécution
    //   'json:rapport.json' → export JSON pour Allure ou CI/CD
    //   'html:rapport.html' → rapport HTML natif Cucumber
    //   Plusieurs formats peuvent coexister dans le tableau :
    //   format: ['progress-bar', 'json:allure-results/cucumber-report.json']


    // -------------------------------------------------------------------------
    // FORMATOPTIONS — Options de format
    // -------------------------------------------------------------------------
    formatOptions: {
      snippetInterface: 'async-await',
      // ↑ Quand un step n'est pas implémenté, Cucumber génère un snippet
      //   Cette option force le style async/await (plus moderne)
      //
      //   Sans cette option → style callback (moins lisible) :
      //   Given('...', function(callback) { callback(); });
      //
      //   Avec cette option → style async/await :
      //   Given('...', async function() { await this.page.goto(...); });
      //
      //   Utiliser npm run test:dry pour voir les snippets générés
    },


    // -------------------------------------------------------------------------
    // WORLDPARAMETERS — Paramètres injectés dans le World Cucumber
    // -------------------------------------------------------------------------
   


    // -------------------------------------------------------------------------
    // TAGS — Filtrer les scénarios à exécuter
    // -------------------------------------------------------------------------
    //tags: process.env.TAGS || '@smoke',
    // ↑ Lit TAGS depuis le .env (TAGS=@smoke dans notre .env)
    //   Si TAGS n'est pas défini → '@smoke' par défaut
    //
    //   Notre scénario "Connexion réussie" a le tag @smoke → il sera exécuté
    //
    //   Syntaxe des tags :
    //   '@smoke'              → seulement les @smoke
    //   '@smoke and @ui'      → les deux tags obligatoires
    //   '@smoke or @api'      → l'un ou l'autre
    //   'not @wip'            → tout sauf les @wip
    //   '@smoke and not @wip' → smoke mais pas wip
    //
    //   En ligne de commande (sans modifier .env) :
    //   TAGS="@smoke" npm test


    // -------------------------------------------------------------------------
    // PARALLEL — Nombre de scénarios exécutés en parallèle
    // -------------------------------------------------------------------------
   // parallel: 1,
    // ↑ 1 = exécution séquentielle (un scénario à la fois)
    //   Recommandé pour la formation : les logs sont lisibles dans l'ordre
    //
    //   Pour activer le parallélisme en CI/CD :
    //   parallel: 4 → 4 scénarios en même temps (4 navigateurs ouverts)
    //
    //   ⚠️ Attention avec parallel > 1 :
    //   Chaque worker a son propre navigateur (isolation via BrowserContext)
    //   Les données de test ne doivent pas entrer en conflit
    //   (ex: 2 tests qui créent le même utilisateur → erreur)
  }
};

// =============================================================================
// COMMANDES DISPONIBLES (définies dans package.json) :
//
//   npm run test:dry          → vérifie les steps sans exécuter
//   npm run test:smoke        → lance les @smoke en headless
//   npm run test:smoke:headed → lance les @smoke avec navigateur visible
//   npm test                  → tous les scénarios
// =============================================================================