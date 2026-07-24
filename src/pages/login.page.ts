// =============================================================================
// src/pages/login.page.ts
// =============================================================================
//
// DONNÉES LUES DEPUIS .env (via process.env) :
//   TEST_USER_EMAIL    → utilisé dans loginWithEnvCredentials()
//   TEST_USER_PASSWORD → utilisé dans loginWithEnvCredentials()
// =============================================================================

import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import 'dotenv/config';


export class LoginPage extends BasePage {

  // -- Locators --
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly logoutLink: Locator;
  readonly loginNavLink: Locator;
  readonly loggedInText: Locator;

  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);

    this.emailInput   = this.page.locator('[data-qa="login-email"]');
    this.passwordInput = this.page.locator('[data-qa="login-password"]');
    this.loginButton  = this.page.locator('[data-qa="login-button"]');
    this.logoutLink   = this.page.getByRole('link', { name: 'Logout' });
    this.loginNavLink = this.page.getByRole('link', { name: 'Login' });
    this.loggedInText = this.page.locator('li').filter({ hasText: 'Logged in as' });

    this.errorMessage = this.page.locator('xpath=//*[@id="form"]/div/div/div[1]/div/form/p');

  }

  // -- Navigation --
  async navigate(): Promise<void> {
    //await this.page.goto('/login');
    await this.page.goto(process.env.BASE_URL);
  }
  // -- Actions --
  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickLoginButton(): Promise<void> {
    await this.loginButton.click();
  }

  async clickLogoutLink(): Promise<void> {
    await this.logoutLink.click();
  }

  // -- Méthode pratique : login avec les credentials du .env --
  async fillEmailWithEnv(): Promise<void> {
      await this.fillEmail(
      process.env.TEST_USER_EMAIL || 'testautomation@uptotest.com'
      // ↑ Lit TEST_USER_EMAIL depuis .env
      //   Valeur par défaut si non défini
      )};

  async fillPwdWithEnv(): Promise<void> {
      await this.fillPassword(
      process.env.TEST_USER_PASSWORD || 'Test@1234'
      // ↑ Lit TEST_USER_PASSWORD depuis .env
        )};

  // -- Getters --
  async getLoggedInUsername(): Promise<string> {
    const fullText = await this.loggedInText.textContent() ?? '';
    return fullText.replace('Logged in as', '').trim();
  }

  async isLoggedIn(): Promise<boolean> {
    return await this.logoutLink.isVisible();
  }

  async isLoginLinkVisible(): Promise<boolean> {
    return await this.loginNavLink.isVisible();
  }

async getValidationMessage(): Promise<string> {
  return await this.emailInput.evaluate((el) => {
    return (el as HTMLInputElement).validationMessage;
    // ↑ evaluate() exécute du JavaScript dans le navigateur
    //   validationMessage : propriété native HTML5 qui retourne
    //   le message de validation du champ
    //   Ex: "Please fill in this field."
  });
}

}
