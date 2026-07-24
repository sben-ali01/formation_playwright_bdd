import { Page } from '@playwright/test';

// =============================================================================
// src/pages/base.page.ts
// =============================================================================
// Classe de base pour les Page Objects : centralise les méthodes communes
// Toute page spécifique doit étendre `BasePage` pour réutiliser ces helpers
// =============================================================================

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Accepte le popup de consentement aux cookies s'il est présent
  async acceptCookiePopup(): Promise<void> {
    try {
      const consentBtn = this.page.locator('button[aria-label="Consent"]');
      await consentBtn.waitFor({ state: 'visible', timeout: 500 });
      // Si le bouton apparaît, on clique dessus puis on continue
      await consentBtn.click();
    } catch {
      // Popup absent → on continue sans erreur
    }
  }
}
