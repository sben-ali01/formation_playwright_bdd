// =============================================================================
// src/steps/ui/register.steps.ts
// =============================================================================
// Définitions de steps pour l'inscription utilisateur sur Automation Exercise.
// Chaque étape du parcours utilise pageFixture.page et des méthodes async/await.
// =============================================================================

import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { pageFixture } from '../../support/pageFixture';
import { RegisterPage } from '../../pages/register.page';

let registerPage: RegisterPage;

Given('je vois le formulaire New User Signup', async function () {
  registerPage = new RegisterPage(pageFixture.page);
  await registerPage.navigate();
});

When('je remplis le nom {string}', async function (name: string) {
  await registerPage.fillSignupName(name);
});

When('je remplis l\'email {string}', async function (email: string) {
  await registerPage.fillSignupEmail(email);
});

When('je clique sur le bouton Signup', async function () {
  await registerPage.clickSignup();
});

Then('je devrais être sur la page Enter Account Information', async function () {
  await registerPage.waitForAccountInformationPage();
  await expect(pageFixture.page).toHaveURL(/.*\/signup/);
});

When('je choisis le titre {string}', async function (title: string) {
  await registerPage.chooseTitle(title);
});

When('je saisis le mot de passe register {string}', async function (password: string) {
  await registerPage.fillPassword(password);
});

When('je choisis la date de naissance {string} {string} {string}', async function (day: string, month: string, year: string) {
  await registerPage.selectBirthDate(day, month, year);
});

When('je coche la newsletter', async function () {
  await registerPage.checkNewsletter();
});

When('je coche les offres spéciales', async function () {
  await registerPage.checkSpecialOffers();
});

When('je saisis le prénom {string}', async function (firstName: string) {
  await registerPage.fillFirstName(firstName);
});

When('je saisis le nom de famille {string}', async function (lastName: string) {
  await registerPage.fillLastName(lastName);
});

When('je saisis la société {string}', async function (company: string) {
  await registerPage.fillCompany(company);
});

When('je saisis l\'adresse {string}', async function (address: string) {
  await registerPage.fillAddress(address);
});

When('je saisis le pays {string}', async function (country: string) {
  await registerPage.selectCountry(country);
});

When('je saisis l\'état {string}', async function (state: string) {
  await registerPage.fillState(state);
});

When('je saisis la ville {string}', async function (city: string) {
  await registerPage.fillCity(city);
});

When('je saisis le code postal {string}', async function (zipcode: string) {
  await registerPage.fillZipcode(zipcode);
});

When('je saisis le mobile {string}', async function (mobileNumber: string) {
  await registerPage.fillMobileNumber(mobileNumber);
});

When('je clique sur le bouton Create Account', async function () {
  await registerPage.clickCreateAccount();
});

Then('je devrais voir le message de confirmation {string}', async function (expectedMessage: string) {
  await registerPage.waitForAccountCreated();
  const actualMessage = await registerPage.getAccountCreatedMessage();
  expect(actualMessage).toContain(expectedMessage);
});

When('je clique sur le bouton Continue', async function () {
  await registerPage.clickContinue();
});

Then('je devrais voir le bouton Continue', async function () {
  await expect(registerPage.continueButton).toBeVisible();
});

Then('je devrais voir le message d\'erreur {string}', async function (expectedMessage: string) {
  const errorLocator = pageFixture.page.locator('p, .alert, .text-danger, .error').filter({ hasText: expectedMessage });
  await expect(errorLocator).toBeVisible();
});

Then('je devrais voir un message de validation des champs obligatoires', async function () {
  const validationMessage = await registerPage.signupNameInput.evaluate((el) => (el as HTMLInputElement).validationMessage);
  expect(validationMessage.length).toBeGreaterThan(0);
});
