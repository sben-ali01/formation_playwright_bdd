// =============================================================================
// src/steps/api/compte.steps.ts
// =============================================================================
//
// ROLE : Step Definitions pour le flux CRUD API
//        Relie le Gherkin (compte.feature) au client API (compte.api.ts)
//
// DIFFÉRENCE AVEC LES STEPS UI :
//   Steps UI  → this.loginPage.fillEmail() → Playwright → navigateur
//   Steps API → compteApi.createAccount()  → Playwright → requête HTTP
//
// PAS DE NAVIGATEUR ICI :
//   Pas de pageFixture.page
//   Pas de locators, hover, click...
//   Uniquement des requêtes HTTP et des assertions sur les réponses
// =============================================================================

import { Given, When, Then, Before } from '@cucumber/cucumber';
import { expect, request } from '@playwright/test';
// ↑ request : factory Playwright pour créer un APIRequestContext
//   Différent de pageFixture.page — pas de navigateur

import { APIRequestContext, APIResponse } from '@playwright/test';
import { CompteApi } from '../../api/compte.api';
import 'dotenv/config';


// =============================================================================
// VARIABLES — Partagées entre les steps du scénario
// =============================================================================

let apiContext: APIRequestContext;
// ↑ Client HTTP Playwright — initialisé dans Before
//   Partagé entre tous les steps du scénario

let compteApi: CompteApi;
// ↑ Instance du client API — initialisée dans Before
//   Équivalent de loginPage dans les steps UI

let testEmail: string;
// ↑ Email unique généré pour chaque exécution
//   Format : test_1717123456789@uptotest.com

let testPassword: string;
// ↑ Mot de passe du compte de test

let lastResponse: APIResponse;
// ↑ Dernière réponse API reçue
//   Partagée entre When (envoie la requête) et Then (vérifie la réponse)


// ↑ Données complètes du compte de test
//   Réutilisées dans CREATE, UPDATE et DELETE
let testData: {
  name: string;
  email: string;
  password: string;
  title: string;
  birth_date: string;
  birth_month: string;
  birth_year: string;
  firstname: string;
  lastname: string;
  company: string;
  address1: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
  mobile_number: string;
};



// =============================================================================
// BEFORE — Initialisation avant chaque scénario API
// =============================================================================

Before({ tags: '@apii' }, async function () {
// ↑ Hook conditionnel — exécuté uniquement pour les scénarios @api
//   Crée le client HTTP SANS navigateur

  // ↑ request.newContext() : crée un client HTTP indépendant
  //   Pas lié au navigateur — pas de cookies partagés

  apiContext = await request.newContext({
    baseURL: process.env.API_BASE_URL,
    // ↑ URL de base de l'API
    //   Toutes les requêtes seront relatives à cette URL
 });
   // ↑ Initialisation du client API avec le contexte HTTP
   compteApi = new CompteApi(apiContext);

   // extraHTTPHeaders: {
     // 'Accept': 'application/json',
      // ↑ On accepte du JSON en réponse
    //},
 
  // ↑ request.newContext() : crée un client HTTP indépendant
  //   Pas lié au navigateur — pas de cookies partagés


});


// =============================================================================
// GIVEN — Contexte initial
// =============================================================================

Given('l\'API Automation Exercise est disponible', async function () {

  const response = await apiContext.get(
    `${process.env.API_BASE_URL || 'https://automationexercise.com/api'}/productsList`
  );
  // ↑ Ping de l'API avec un endpoint simple (GET /productsList)
  //   Vérifie que le serveur répond avant de lancer les tests CRUD
  //   Si le serveur est down → fail fast avec un message clair

  expect(response.status()).toBe(200);
  // ↑ HTTP 200 → l'API est disponible
  //   Si ce Given échoue → tous les scénarios sont skippés

  console.log('✅ API disponible');
});


Given('un email unique est généré pour ce test', async function () {

  testPassword = process.env.TEST_USER_PASSWORD || 'Test@1234';
  // ↑ Mot de passe fixe depuis le .env

  testEmail = `test_${Date.now()}@gmail.com`;
  // ↑ Date.now() : timestamp en millisecondes depuis le 1er janvier 1970
  //   Garantit l'unicité : impossible d'avoir deux timestamps identiques
  //   Exemple : test_1717123456789@uptotest.com

  testData = {
    name: 'Test Automation',
    email: testEmail,
    password: testPassword,
    title: 'Mr',
    birth_date: '15',
    birth_month: 'June',
    birth_year: '1990',
    firstname: 'Test',
    lastname: 'Automation',
    company: 'UpToTest',
    address1: '123 Rue de la Formation',
    city: 'Lyon',
    state: 'Auvergne-Rhône-Alpes',
    zipcode: '69005',
    country: 'France',
    mobile_number: '+33743502599',
  };
  // ↑ Données complètes requises par l'API Automation Exercise
  //   Tous ces champs sont obligatoires pour createAccount et updateAccount

  console.log(`📧 Email généré : ${testEmail}`);
  // ↑ Log dans le rapport Allure — utile pour le débogage
});


// =============================================================================
// WHEN — Envoi des requêtes HTTP
// =============================================================================

When('je crée un compte avec les données générées', async function () {

  lastResponse = await compteApi.createAccount(testData);
  // ↑ Envoie POST /api/createAccount avec les données de test
  //   Stocke la réponse dans lastResponse pour les Then
  //
  //   Structure de la réponse attendue :
  //   { responseCode: 201, message: "User created!" }

  console.log(`→ POST /createAccount → ${lastResponse.status()}`);
});

Then('le code de réponse devrait être {int}', async function (expectedCode: number) {
// ↑ {int} : capture le code attendu — 200, 201, 404...

  const body = await compteApi.parseResponse(lastResponse);
  // ↑ Parse le body JSON de lastResponse

  console.log(body);
  expect(body.responseCode).toBe(expectedCode);
  // ↑ Vérifie le responseCode DANS le body JSON
  //   Automation Exercise met le code dans le body — pas seulement dans le HTTP status
  //
  //   IMPORTANT : HTTP status et responseCode peuvent être différents
  //   HTTP 200 mais responseCode 404 → endpoint trouvé mais ressource absente

  console.log(`  responseCode: ${body.responseCode} (attendu: ${expectedCode})`);
});


Then('le message de réponse devrait contenir {string}', async function (expectedMessage: string) {

  const body = await compteApi.parseResponse(lastResponse);
  // ↑ Re-parse le body — json() peut être appelé plusieurs fois sur APIResponse

  expect(body.message).toContain(expectedMessage);
  // ↑ toContain() : le message CONTIENT la valeur attendue
  //   Plus flexible que toBe() — résistant aux petites variations de texte
  //   "User created!" contient "User created" → ✅

  console.log(`  message: "${body.message}"`);
});

Given('un compte a été créé avec les données générées', async function () {
// ↑ Précondition pour READ, UPDATE et DELETE
//   Crée le compte AVANT d'exécuter le scénario principal
//   Évite de répéter les steps de création dans chaque scénario

  // ↑ Création du compte via l'API

  const response = await compteApi.createAccount(testData);

  // ↑ Parse le body JSON de la réponse
  const body = await compteApi.parseResponse(response);

  expect(body.responseCode).toBe(201);
  // ↑ 201 Created → le compte a bien été créé
  //   Si ce Given échoue → le scénario est skippé

  console.log(`✅ Compte créé : ${testEmail}`);
});


When('je récupère les détails du compte par email', async function () {

  lastResponse = await compteApi.getUserByEmail(testEmail, testPassword);
  // ↑ Envoie GET /api/getUserDetailByEmail?email=...&password=...
  //
  //   Structure de la réponse attendue :
  //   { responseCode: 200, user: { name: "...", email: "...", ... } }

  console.log(`→ GET /getUserDetailByEmail → ${lastResponse.status()}`);
});


Then('les détails devraient contenir le nom de l\'utilisateur', async function () {

  const body = await compteApi.parseResponse(lastResponse);
  // ↑ Parse le body de la réponse getUserDetailByEmail

  expect(body.user).toBeDefined();
  // ↑ L'objet user existe dans la réponse

  expect((body.user).name).toBeDefined();
  // ↑ Le champ name existe dans l'objet user
  //   as any : cast TypeScript pour accéder aux propriétés dynamiques

  expect((body.user).email).toBe(testEmail);

  // ↑ L'email retourné correspond à l'email de test
  //   Vérifie qu'on a bien récupéré le bon utilisateur

  console.log(`  user.name: ${(body.user).name}`);
  console.log(`  user.email: ${(body.user as any).email}`);
});



When('je mets à jour le nom du compte avec {string}', async function (newName: string) {
// ↑ {string} : Cucumber Expression — capture "UpdatedName" du .feature

  const updatedData = {
    ...testData,
    name: newName,
    // ↑ Spread operator : copie testData et remplace uniquement le name
    //   Les autres champs restent identiques
    firstname: newName,
    // ↑ On met à jour firstname aussi pour cohérence
  };

  lastResponse = await compteApi.updateAccount(updatedData);
  // ↑ Envoie PUT /api/updateAccount avec les données mises à jour
  //
  //   Structure de la réponse attendue :
  //   { responseCode: 200, message: "User updated!" }

  console.log(`→ PUT /updateAccount [name: ${newName}] → ${lastResponse.status()}`);
});


When('je supprime le compte', async function () {

  lastResponse = await compteApi.deleteAccount(testEmail, testPassword);
  // ↑ Envoie DELETE /api/deleteAccount avec email + password
  //
  //   Structure de la réponse attendue :
  //   { responseCode: 200, message: "Account deleted!" }

  console.log(`→ DELETE /deleteAccount → ${lastResponse.status()}`);
});


// =============================================================================
// THEN — Assertions sur les réponses
// =============================================================================





