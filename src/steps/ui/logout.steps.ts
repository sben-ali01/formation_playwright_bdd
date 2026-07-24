import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { pageFixture } from '../../support/pageFixture';
import { LogoutPage } from '../../pages/logout.page';

let logoutPage: LogoutPage;

When('je clique sur le lien Logout', async function () {
  logoutPage = new LogoutPage(pageFixture.page);
  await logoutPage.acceptCookiePopup();
  await logoutPage.clickLogoutLink();
});

Then('je devrais être déconnecté', async function () {
  logoutPage = new LogoutPage(pageFixture.page);
  await logoutPage.acceptCookiePopup();
  await expect(logoutPage.logoutLink).not.toBeVisible();
});

Then('je devrais voir le lien Login dans la barre de navigation', async function () {
  logoutPage = new LogoutPage(pageFixture.page);
  await logoutPage.acceptCookiePopup();
  await expect(logoutPage.loginNavLink).toBeVisible();
});
