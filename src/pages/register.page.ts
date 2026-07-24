// =============================================================================
// src/pages/register.page.ts
// =============================================================================
// Page Object pour le parcours d'inscription complet d'Automation Exercise.
// Cette page gère les deux étapes du signup et la confirmation finale.
// =============================================================================

import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import 'dotenv/config';

export class RegisterPage extends BasePage {
  readonly signupNameInput: Locator;
  readonly signupEmailInput: Locator;
  readonly signupButton: Locator;
  readonly titleMrRadio: Locator;
  readonly titleMrsRadio: Locator;
  readonly passwordInput: Locator;
  readonly daySelect: Locator;
  readonly monthSelect: Locator;
  readonly yearSelect: Locator;
  readonly newsletterCheckbox: Locator;
  readonly offersCheckbox: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly companyInput: Locator;
  readonly addressInput: Locator;
  readonly countrySelect: Locator;
  readonly stateInput: Locator;
  readonly cityInput: Locator;
  readonly zipcodeInput: Locator;
  readonly mobileNumberInput: Locator;
  readonly createAccountButton: Locator;
  readonly accountCreatedMessage: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);

    this.signupNameInput = this.page.locator('[data-qa="signup-name"]');
    this.signupEmailInput = this.page.locator('[data-qa="signup-email"]');
    this.signupButton = this.page.locator('[data-qa="signup-button"]');
    this.titleMrRadio = this.page.locator('#id_gender1');
    this.titleMrsRadio = this.page.locator('#id_gender2');
    this.passwordInput = this.page.locator('[data-qa="password"]');
    this.daySelect = this.page.locator('[data-qa="days"]');
    this.monthSelect = this.page.locator('[data-qa="months"]');
    this.yearSelect = this.page.locator('[data-qa="years"]');
    this.newsletterCheckbox = this.page.locator('#newsletter');
    this.offersCheckbox = this.page.locator('#optin');
    this.firstNameInput = this.page.locator('[data-qa="first_name"]');
    this.lastNameInput = this.page.locator('[data-qa="last_name"]');
    this.companyInput = this.page.locator('[data-qa="company"]');
    this.addressInput = this.page.locator('[data-qa="address"]');
    this.countrySelect = this.page.locator('[data-qa="country"]');
    this.stateInput = this.page.locator('[data-qa="state"]');
    this.cityInput = this.page.locator('[data-qa="city"]');
    this.zipcodeInput = this.page.locator('[data-qa="zipcode"]');
    this.mobileNumberInput = this.page.locator('[data-qa="mobile_number"]');
    this.createAccountButton = this.page.locator('[data-qa="create-account"]');
    this.accountCreatedMessage = this.page.locator('[data-qa="account-created"]');
    this.continueButton = this.page.locator('[data-qa="continue-button"]');
  }

  async navigate(): Promise<void> {
    const base = (process.env.BASE_URL || 'https://www.automationexercise.com').replace(/\/$/, '');
    await this.page.goto(`${base}/login`);
    await this.acceptCookiePopup();
    await this.signupButton.waitFor({ state: 'visible', timeout: 5000 });
  }

  async fillSignupName(name: string): Promise<void> {
    await this.signupNameInput.fill(name);
  }

  async fillSignupEmail(email: string): Promise<void> {
    await this.signupEmailInput.fill(email);
  }

  async clickSignup(): Promise<void> {
    await this.signupButton.click();
  }

  async waitForAccountInformationPage(): Promise<void> {
    await this.passwordInput.waitFor({ state: 'visible', timeout: 5000 });
  }

  async chooseTitle(title: string): Promise<void> {
    if (title.toLowerCase() === 'mr') {
      await this.titleMrRadio.check();
    } else if (title.toLowerCase() === 'mrs') {
      await this.titleMrsRadio.check();
    } else {
      throw new Error(`Titre inconnu : ${title}`);
    }
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async selectBirthDate(day: string, month: string, year: string): Promise<void> {
    await this.daySelect.selectOption({ label: day });
    await this.monthSelect.selectOption({ label: month });
    await this.yearSelect.selectOption({ label: year });
  }

  async checkNewsletter(): Promise<void> {
    if (!(await this.newsletterCheckbox.isChecked())) {
      await this.newsletterCheckbox.check();
    }
  }

  async checkSpecialOffers(): Promise<void> {
    if (!(await this.offersCheckbox.isChecked())) {
      await this.offersCheckbox.check();
    }
  }

  async fillFirstName(firstName: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
  }

  async fillLastName(lastName: string): Promise<void> {
    await this.lastNameInput.fill(lastName);
  }

  async fillCompany(company: string): Promise<void> {
    await this.companyInput.fill(company);
  }

  async fillAddress(address: string): Promise<void> {
    await this.addressInput.fill(address);
  }

  async selectCountry(country: string): Promise<void> {
    await this.countrySelect.selectOption({ label: country });
  }

  async fillState(state: string): Promise<void> {
    await this.stateInput.fill(state);
  }

  async fillCity(city: string): Promise<void> {
    await this.cityInput.fill(city);
  }

  async fillZipcode(zipcode: string): Promise<void> {
    await this.zipcodeInput.fill(zipcode);
  }

  async fillMobileNumber(mobileNumber: string): Promise<void> {
    await this.mobileNumberInput.fill(mobileNumber);
  }

  async clickCreateAccount(): Promise<void> {
    await this.createAccountButton.click();
  }

  async waitForAccountCreated(): Promise<void> {
    await this.accountCreatedMessage.waitFor({ state: 'visible', timeout: 10000 });
  }

  async getAccountCreatedMessage(): Promise<string> {
    return (await this.accountCreatedMessage.textContent())?.trim() ?? '';
  }

  async clickContinue(): Promise<void> {
    await this.continueButton.click();
  }
}
