// =============================================================================
// src/hooks/hooks.ts
// =============================================================================
//
// ROLE : Ouvrir et fermer le navigateur automatiquement avant/après chaque
//        scénario. Partager la page via pageFixture.
//
// DONNÉES LUES DEPUIS .env :
//   BASE_URL  → URL du site testé
//   HEADLESS  → afficher ou non le navigateur
//
// ORDRE D'EXÉCUTION :
//   BeforeAll → [Before → steps → After] × N scénarios → AfterAll
// =============================================================================

import {
  After,
  AfterAll,
  Before,
  BeforeAll,
  Status,
  setDefaultTimeout,
} from '@cucumber/cucumber';
// ↑ BeforeAll  : exécuté UNE FOIS avant tous les scénarios
//   AfterAll   : exécuté UNE FOIS après tous les scénarios
//   Before     : exécuté avant CHAQUE scénario
//   After      : exécuté après CHAQUE scénario (même si échec)
//   Status     : enum Cucumber → Status.FAILED, Status.PASSED...
//   setDefaultTimeout : timeout global pour tous les steps

import { Browser, BrowserContext, Page } from 'playwright/test';
// ↑ Types Playwright pour typer les variables

import { chromium } from '@playwright/test';
// ↑ Launcher Chromium — remplacer par firefox ou webkit si besoin

import { pageFixture } from '../support/pageFixture';
// ↑ L'objet partagé — on y assigne this.page dans Before
//   Les Page Objects et steps y accèdent via import

import 'dotenv/config';
// ↑ Charge le .env dans process.env
//   DOIT être avant toute lecture de process.env


import * as fs from 'fs';
// ↑ Pour lire et supprimer les fichiers vidéo

// =============================================================================
// VARIABLES — Portée du module (partagées entre BeforeAll et AfterAll)
// =============================================================================

let browser: Browser;
// ↑ Instance du navigateur — créée dans BeforeAll, fermée dans AfterAll
//   Partagée entre tous les scénarios → un seul navigateur lancé

let context: BrowserContext;
// ↑ Contexte isolé — créé dans Before, fermé dans After
//   Chaque scénario a son propre contexte → cookies séparés

// =============================================================================
// TIMEOUT GLOBAL
// =============================================================================

setDefaultTimeout(30_000);
// ↑ Timeout global pour TOUS les steps : 60 secondes
//   Si un step dépasse 60s → il échoue automatiquement
//   Surcharge la valeur par défaut de Cucumber (5s — trop court pour Playwright)


// =============================================================================
// BeforeAll — Une seule fois avant tous les scénarios
// =============================================================================

BeforeAll(async function () {
// ↑ Pas de `this` ici — BeforeAll n'a pas accès au World
//   Utilisé pour les initialisations LOURDES et PARTAGÉES

  browser = await chromium.launch();
    // ↑ Lit HEADLESS depuis .env
    //   HEADLESS=false dans .env → false → navigateur VISIBLE
    //   Non défini ou true     → true  → navigateur INVISIBLE (CI/CD)

   // slowMo: process.env.HEADLESS !== 'false' ? 0 : 50,
    // ↑ 50ms entre chaque action en mode visible
    //   Les apprenants voient le navigateur interagir avec la page
    //   0ms en headless → vitesse maximale pour la CI
  

  console.log(' Navigateur lancé');
});


// =============================================================================
// Before — Avant CHAQUE scénario
// =============================================================================


Before(async function () {
// ↑ Exécuté avant chaque scénario — crée un contexte et une page frais

 context = await browser.newContext({
  
  baseURL: process.env.BASE_URL,
  recordVideo: {
    dir: './rapports/videos/',
    // ↑ Dossier où les vidéos sont sauvegardées
    size: { width: 1280, height: 720 }
    // ↑ Résolution de la vidéo
  },
 });
    // ↑ Lit BASE_URL depuis .env
    //   page.goto('/login') → https://www.automationexercise.com/login
    //   Valeur par défaut si BASE_URL absent du .env
  // ↑ Nouveau contexte = nouveaux cookies → isolation entre scénarios
  //   Clé pour les tests parallèles : chaque scénario a sa propre session

   pageFixture.page = await context.newPage();
   pageFixture.page.setDefaultNavigationTimeout(60000);

  // ↑ Ouvre un nouvel onglet et l'assigne à pageFixture.page
  //   Désormais accessible dans TOUS les fichiers qui importent pageFixture :
  //   → login.page.ts  : pageFixture.page.locator(...)
  //   → auth.steps.ts  : pageFixture.page.goto(...)

  console.log('Nouvelle page ouverte');
});

/*BeforeStep(async function () {
 try {
      const consentBtn = pageFixture.page.locator('button[aria-label="Consent"]');
      await consentBtn.click();
      await consentBtn.waitFor({ state: 'hidden', timeout: 5000 });
    } catch {
      // 🛡️ Popup absente, on continue.
    }
});*/

// =============================================================================
// After — Après CHAQUE scénario
// =============================================================================

After(async function ({ pickle, result }) {
// ↑ Destructuring du paramètre : pickle = infos scénario, result = statut
//   pickle.name = nom du scénario
//   result.status = 'PASSED' | 'FAILED' | 'PENDING'...

  console.log(`${result?.status === Status.FAILED ? '✅' : '❌'} ${pickle.name}`);

  // -- Screenshot si le scénario a échoué --
  if (result?.status === Status.FAILED) {

    const img = await pageFixture.page.screenshot({
      path: `./rapports/screenshots/${pickle.name}.png`,
      // ↑ Sauvegarde le screenshot dans le dossier rapports/screenshots/
      //   Nom du fichier = nom du scénario
      //   Créer le dossier si besoin : mkdir -p rapports/screenshots

      type: 'png',
      // ↑ Format PNG — meilleure qualité pour les captures d'écran UI
    });

    await this.attach(img, 'image/png');
    // ↑ Attache aussi le screenshot au rapport Allure
    //   Visible dans l'onglet Attachments du rapport
  }

  // -- Fermeture de la page --
  await pageFixture.page.close();
  // ↑ Ferme l'onglet — libère la mémoire de la page

  await context.close();
  // ↑ Ferme le contexte — libère les cookies et le localStorage
  //   IMPORTANT : fermer le context avant le browser


  // ↑ IMPORTANT : la vidéo n'est finalisée qu'après page.close()

  // -- Gérer la vidéo selon le statut --
  const videoPath = await pageFixture.page.video()?.path();
  // ↑ Récupère le chemin de la vidéo générée

  if (result?.status === Status.PASSED && videoPath) {
    // Garder la vidéo et l'attacher au rapport Allure
    const videoBuffer = fs.readFileSync(videoPath);
    await this.attach(videoBuffer, 'video/webm');
    // ↑ Attache la vidéo au rapport Allure
    console.log(`🎥 Vidéo sauvegardée : ${videoPath}`);

  } /*else if (videoPath) {
    // Supprimer la vidéo si le test a réussi
    fs.unlinkSync(videoPath);
    // ↑ Supprime la vidéo — pas besoin de la garder
  }*/
});


// =============================================================================
// AfterAll — Une seule fois après tous les scénarios
// =============================================================================

AfterAll(async function () {
// ↑ Exécuté une seule fois à la toute fin
//   Ferme le navigateur qui était partagé entre tous les scénarios

  await browser.close();
  // ↑ Ferme le navigateur et libère toute la mémoire
  //   OBLIGATOIRE — sans ça : processus Chrome reste en mémoire

  console.log('Navigateur fermé');
});


// =============================================================================
// DIFFÉRENCE BeforeAll/AfterAll vs Before/After :
//
//   BeforeAll  → 1 fois  → lancer le navigateur (lourd)
//   Before     → N fois  → créer un contexte + page (léger)
//   After      → N fois  → fermer page + contexte + screenshot si échec
//   AfterAll   → 1 fois  → fermer le navigateur
//
// POURQUOI séparer BeforeAll et Before ?
//   Lancer un navigateur prend ~500ms.
//   Si on le relançait à chaque scénario → tests beaucoup plus lents.
//   Le contexte isole suffisamment les scénarios (cookies séparés).
// =============================================================================
