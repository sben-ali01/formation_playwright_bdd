import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { pageFixture } from '../../support/pageFixture';
import { ProductPage } from '../../pages/produitPage';


// =============================================================================
// GIVEN
// =============================================================================

/*************** TEST 1 ******************/

Given('je suis sur la page des produits', async function () {
  pageFixture.productPage = new ProductPage(pageFixture.page);
  await  pageFixture.productPage.navigate();
  await  pageFixture.productPage.acceptCookiePopup();
});

Then('je devrais voir une liste de produits', async function () {
  await expect( pageFixture.productPage.productsList).toBeVisible();
});

Then('le nombre de produits affichés devrait être supérieur à {int}', async function (count: number) {
  const productCount = await  pageFixture.productPage.getProductCount();
  expect(productCount).toBeGreaterThan(count);
});

// =============================================================================
// WHEN
// =============================================================================

/*************** TEST 2 ******************/

When('je recherche le produit {string}', async function (keyword: string) {
  await  pageFixture.productPage.searchProduct(keyword);
    await pageFixture.page.waitForTimeout(3000);

});


Then('je devrais voir des résultats de recherche', async function () {
  await expect(pageFixture.productPage.searchResults.first()).toBeVisible();
});

Then('chaque résultat devrait contenir le mot {string}', async function (keyword: string) {
  const texts = await  pageFixture.productPage.getSearchResultsText();
  for (const text of texts) {
    console.log(text);
    expect(text).toContain(keyword.toLowerCase());
  }
});

/*************** TEST 3 ******************/



When('je clique sur le premier produit', async function () {
  await  pageFixture.productPage.clickFirstProduct();
});

// =============================================================================
// THEN
// =============================================================================


Then('je devrais voir le nom du produit', async function () {
  const name = await  pageFixture.productPage.getProductName();
  expect(name.length).toBeGreaterThan(0);
});

Then('je devrais voir le prix du produit', async function () {
  const price = await  pageFixture.productPage.getProductPrice();
  expect(price).toContain('Rs.');
});

Then('je devrais voir la description du produit', async function () {
  await expect( pageFixture.productPage.productDescription).toBeVisible();
});
