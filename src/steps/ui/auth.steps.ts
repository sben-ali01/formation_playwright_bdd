// =============================================================================
// src/steps/ui/auth.steps.ts
// =============================================================================
//
// DONNÉES LUES DEPUIS .env :
//   TEST_USER_EMAIL    → email du compte de test
//   TEST_USER_PASSWORD → mot de passe du compte de test
// =============================================================================

import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { pageFixture } from '../../support/pageFixture';
// ↑ On importe pageFixture pour accéder à la page
//   Plus besoin du Custom World — pageFixture.page est disponible partout

import { LoginPage } from '../../pages/login.page';
import 'dotenv/config';
// ↑ Charge le .env → donne accès à process.env.TEST_USER_EMAIL etc.


// Instance du Page Object — partagée entre les steps de ce scénario
let loginPage: LoginPage;
// ↑ Variable locale au fichier (module scope)
//   Initialisée dans le premier Given
//   Accessible dans tous les steps du fichier


// =============================================================================
// GIVEN
// =============================================================================
/*Given('je suis sur la page d\'accueil d\'Automation Exercise', async function () {

  //await pageFixture.page.goto('/');
  // ↑ pageFixture.page au lieu de this.page
  //   goto('/') → BASE_URL + '/' (défini dans hooks.ts newContext)
  await expect(pageFixture.page).toHaveTitle(/Automation Exercise/);
});*/


Given('je suis sur la page de connexion', async function () {


  // ↑ On crée le Page Object avec pageFixture.page
  //   On le stocke dans la variable locale loginPage du fichier

  loginPage = new LoginPage(pageFixture.page);

  await loginPage.navigate();
  await loginPage.acceptCookiePopup();
});


// =============================================================================
// WHEN
// =============================================================================

When('je saisis l\'email {string}', async function (email: string) {
  await loginPage.acceptCookiePopup();
  //await loginPage.fillEmail(email);
  await loginPage.fillEmailWithEnv();
});


When('je saisis le mot de passe {string}', async function (password: string) {
  await loginPage.acceptCookiePopup();
  //await loginPage.fillPassword(password);
  await loginPage.fillPwdWithEnv();
});


When('je clique sur le bouton de connexion', async function () {
  await loginPage.acceptCookiePopup();
  await loginPage.clickLoginButton();
});


// =============================================================================
// THEN
// =============================================================================

Then('je devrais être connecté avec succès', async function () {
  await expect(loginPage.logoutLink).toBeVisible();
});


Then('je devrais voir mon nom {string} dans la navigation', async function (expectedName: string) {
  const username = await loginPage.getLoggedInUsername();
  await loginPage.acceptCookiePopup();
  expect(username).toContain(expectedName);
});


Then('je devrais voir le mesg d\'erreur {string}', async function (expectedMessage) {
  //await expect(pageFixture.page).toHaveURL(/.*login/);
  if (expectedMessage === 'Please fill in this field.') {
    // Cas champs vides → validation HTML5 native
    const validationMsg = await loginPage.getValidationMessage();
    expect(validationMsg).toContain(expectedMessage);

  } else {
    // Cas message Automation Exercise
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(expectedMessage);
  }
});

/*
When('je clique sur le lien de déconnexion', async function () {
  await loginPage.acceptCookiePopup();
  await loginPage.clickLogoutLink();
});

When('je clique sur le lien Logout', async function () {
  await loginPage.acceptCookiePopup();
  await loginPage.clickLogoutLink();
});

Then('je devrais être déconnecté', async function () {
  await loginPage.acceptCookiePopup();
  await expect(loginPage.logoutLink).not.toBeVisible();
});

Then('je devrais voir le lien Login dans la barre de navigation', async function () {
  await loginPage.acceptCookiePopup();
  await expect(loginPage.loginNavLink).toBeVisible();
}); 
*/