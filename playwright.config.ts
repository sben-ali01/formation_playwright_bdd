// =============================================================================
// playwright.config.ts
// =============================================================================
//
// 🎓 GUIDE DE FORMATION — À lire avant de modifier ce fichier
//
// Ce fichier configure le NAVIGATEUR utilisé par Playwright.
// Il ne lance PAS les tests Cucumber directement.
// L'exécution des scénarios BDD se fait via `cucumber-js` (voir package.json).
//
// Analogie : ce fichier = les réglages de ta voiture (vitesse max, ABS, GPS).
//             cucumber.config.ts = la feuille de route du trajet.
// =============================================================================

import { defineConfig, devices } from '@playwright/test';
// ↑ defineConfig : fonction utilitaire qui active l'autocomplétion TypeScript
//   devices      : catalogue de profils navigateur pré-configurés par Playwright
//                  (résolution, user-agent, viewport...). Ex: 'Pixel 5', 'iPhone 14'

import * as dotenv from 'dotenv';
// ↑ dotenv : charge les variables du fichier .env dans process.env
//   Sans cet import, process.env.BASE_URL sera toujours undefined

dotenv.config();
// ↑ Exécute le chargement du .env AVANT que defineConfig() ne soit évalué
//   IMPORTANT : doit être appelé AVANT toute utilisation de process.env

export default defineConfig({

  testDir: './src',
  // ↑ Dossier racine où Playwright cherche les fichiers de test
  //   Playwright scanne récursivement ce dossier


  // ---------------------------------------------------------------------------
  // ⚙️ Options globales appliquées à TOUS les navigateurs
  // ---------------------------------------------------------------------------
  use: {

    baseURL: process.env.BASE_URL ,
    // ↑ URL de base du site testé
    //   Quand tu utilises page.goto('/login'), Playwright concatène :
    //   baseURL + '/login' → 'https://www.automationexercise.com/login'
    //   La valeur vient du .env, avec une valeur par défaut en fallback
    //   Avantage : changer d'environnement (staging, prod) = modifier .env uniquement

    //headless: process.env.HEADLESS !== 'false',
    // ↑ Mode sans interface graphique (plus rapide, pour CI/CD)
    //   Par défaut : headless = true (HEADLESS est undefined → undefined !== 'false' → true)
    //   Pour voir le navigateur en local : ajouter HEADLESS=false dans .env
    //   Attention : !== 'false' et non === 'true' → comportement par défaut sécurisé

    screenshot: 'only-on-failure',
    // ↑ Capture d'écran automatique uniquement en cas d'échec
    //   Autres valeurs possibles :
    //   'off'  → jamais de screenshot
    //   'on'   → screenshot à chaque test (lourd en CI)
    //   'only-on-failure' → meilleur compromis pour le debugging

    video: 'retain-on-failure',
    // ↑ Enregistrement vidéo du test uniquement si échec
    //   La vidéo est sauvegardée dans le dossier test-results/
    //   Très utile pour comprendre un flaky test (test instable)

    trace: 'retain-on-failure',
    // ↑ Trace Playwright : enregistre chaque action (clics, navigations, réseau)
    //   Visualisable avec : npx playwright show-trace trace.zip
    //   Permet de rejouer un test étape par étape après coup

    actionTimeout: 10_000,
    // ↑ Timeout pour CHAQUE ACTION individuelle (clic, remplissage, etc.)
    //   En millisecondes. 10_000 = 10 secondes
    //   Si un élément n'est pas cliquable après 10s → le test échoue
    //   Note : le _ dans 10_000 est un séparateur visuel TypeScript (= 10000)

    navigationTimeout: 30_000,
    // ↑ Timeout pour les NAVIGATIONS (page.goto, page.waitForNavigation)
    //   30s car les pages e-commerce peuvent être lourdes à charger
    //   Différent de actionTimeout : s'applique aux changements de page complets

    //locale: 'fr-FR',
    // ↑ Locale du navigateur simulé
    //   Affecte : format des dates, séparateur décimal, langue du navigateur
    //   Utile pour tester le comportement de l'app selon la locale utilisateur

    //timezoneId: 'Europe/Paris',
    // ↑ Fuseau horaire simulé par le navigateur
    //   Important pour les tests impliquant des dates/heures
    //   Ex: un test de réservation qui vérifie "livraison demain" dépend du fuseau
  },

  // ---------------------------------------------------------------------------
  // 📊 Reporters — comment les résultats sont affichés et stockés
  // ---------------------------------------------------------------------------
  reporter: [

    //['list'],
    // ↑ Affiche chaque test dans le terminal avec son statut (✓ / ✗)
    //   Simple et lisible pour le développement local

    ['allure-playwright', {
      detail: true,
      // ↑ Inclut les détails des étapes dans le rapport Allure
      //   (actions Playwright, screenshots, logs réseau)

      outputFolder: 'allure-results',
      // ↑ Dossier où Allure stocke les données brutes (JSON/XML)
      //   Ce dossier est lu ensuite par : npx allure generate

      suiteTitle: false,
      // ↑ N'utilise pas le nom du fichier comme titre de suite
      //   Les suites seront nommées d'après les tags Cucumber (@smoke, @ui...)
    }],
  ],

  // ---------------------------------------------------------------------------
  // 🌐 Projects — un projet = un navigateur ou un device
  // ---------------------------------------------------------------------------
  // Playwright peut exécuter les mêmes tests sur plusieurs navigateurs en parallèle
  // Chaque project hérite des options `use` définies plus haut

  projects: [

    {
      name: 'chromium',
      // ↑ Nom affiché dans les rapports. Libre à toi de le renommer ('Chrome', 'Desktop'...)
      use: { ...devices['Desktop Chrome'] },
      // ↑ Spread operator : applique TOUTES les options de Desktop Chrome
      //   (viewport 1280x720, user-agent Chrome, etc.)
      //   puis les options `use` globales s'ajoutent par-dessus
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      // ↑ Moteur Gecko (Firefox). Playwright embarque son propre Firefox
      //   Tu n'as pas besoin d'installer Firefox sur ta machine
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      // ↑ Moteur WebKit (Safari). Permet de tester le comportement Safari
      //   sur Linux/Windows sans avoir de Mac
    },

    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
      // ↑ Simule un Google Pixel 5 : viewport 393x851, touch events, user-agent mobile
      //   Utile pour vérifier le responsive design d'Automation Exercise
      //   La liste complète des devices : npx playwright show-devices
    },
  ],
});

// =============================================================================
// 💡 POINTS CLÉS À RETENIR
// =============================================================================
//
// 1. process.env.XXX lit les variables du fichier .env (chargé par dotenv.config())
// 2. || 'valeur par défaut' = fallback si la variable n'est pas définie dans .env
// 3. headless: false → utile en développement pour voir ce que fait le navigateur
// 4. Les timeouts évitent les faux positifs sur des pages lentes
// 5. Les projects permettent le cross-browser testing sans code dupliqué
//
// ❓ EXERCICE : Ajoute un project 'mobile-safari' avec devices['iPhone 14']
// =============================================================================