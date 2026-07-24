import { Page, Locator } from '@playwright/test';

export class LogoutPage {
  readonly page: Page;
  readonly logoutLink: Locator;
  readonly loginNavLink: Locator;

  constructor(page: Page) {
    this.page = page;

    this.logoutLink = page.getByRole('link', { name: 'Logout' });
    this.loginNavLink = page.getByRole('link', { name: 'Login' });
  }

  async clickLogoutLink(): Promise<void> {
    await this.logoutLink.click();
  }

  async isLoginLinkVisible(): Promise<boolean> {
    return await this.loginNavLink.isVisible();
  }

  async acceptCookiePopup(): Promise<void> {
    try {
      const consentBtn = this.page.locator('button[aria-label="Consent"]');
      await consentBtn.waitFor({ state: 'visible', timeout: 500 });
      await consentBtn.click();
    } catch {
      // Popup absent → continue
    }
  }
}
