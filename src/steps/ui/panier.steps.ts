// =============================================================================
// src/steps/ui/panier.steps.ts
// =============================================================================
//
// ROLE : Step Definitions pour les scénarios du panier
//        Relie le Gherkin (panier.feature) au Page Object (panier.page.ts)
//
// PATTERN : pageFixture.page → PanierPage → actions sur le navigateur
// =============================================================================

import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { pageFixture } from '../../support/pageFixture';
import { PanierPage } from '../../pages/panier.page';
import { ProductPage } from '../../pages/produitPage';

let panierPage: PanierPage;
// ↑ Instance du Page Object — partagée entre tous les steps du scénario
//   Initialisée dans le Given → accessible dans When et Then


// =============================================================================
// GIVEN — Contexte initial
// =============================================================================


// =============================================================================
// WHEN — Actions utilisateur
// =============================================================================

When('je clique sur le bouton produit', async function () {
  panierPage = new PanierPage(pageFixture.page);
  pageFixture.productPage = new ProductPage(pageFixture.page);

  await panierPage.cliquerProducts();
});


When('je survole le premier produit', async function () {
  await panierPage.hoverFirstProduct();
  // ↑ Simule le survol de la souris sur le premier produit
  //   Sans hover : l'overlay avec "Add to cart" n'est pas visible
  //   Playwright gère automatiquement le défilement si l'élément
  //   n'est pas dans le viewport
});


When('je clique sur "Add to cart" du premier produit', async function () {

  await panierPage.clickAddToCartFirstProduct();
  // ↑ Clique sur le bouton Add to cart dans l'overlay
  //   Déclenche l'affichage de la modale #cartModal
  //   La modale contient : "Added!" + boutons Continue/View Cart
});


When('je clique sur "Continue Shopping"', async function () {

  await panierPage.clickContinueShopping();
  // ↑ Ferme la modale de confirmation
  //   L'utilisateur reste sur la page /products
  //   Le produit est bien dans le panier (compteur mis à jour)
});


When('je clique sur "View Cart"', async function () {

  await panierPage.clickViewCart();
  // ↑ Redirige vers /view_cart
  //   Affiche le contenu détaillé du panier
  //   (nom produit, prix, quantité, total)

  await pageFixture.page.waitForURL(/.*view_cart/);
  // ↑ Attend que la navigation vers /view_cart soit complète
  //   waitForURL() : plus fiable que waitForNavigation()
  //   /.*view_cart/ : expression régulière → l'URL contient "view_cart"
});


// =============================================================================
// THEN — Assertions
// =============================================================================

Then('une confirmation d\'ajout devrait s\'afficher', async function () {

  await expect(panierPage.modalConfirmation).toBeVisible();
  // ↑ Vérifie que la modale #cartModal est visible
  //   toBeVisible() : retry automatique jusqu'au timeout
  //   La modale peut prendre quelques ms à apparaître après le clic

  const modalText = await panierPage.modalConfirmation.textContent() ?? '';
  expect(modalText).toContain('Added');
  // ↑ Vérifie que la modale contient le mot "Added"
  //   Le texte exact est "Your product has been added to cart!"
  //   On vérifie "Added" pour être moins fragile au changement de texte
});


Then('le panier devrait contenir {int} produit', async function (expectedCount: number) {
  // ↑ {int} : Cucumber Expression — capture le nombre "1" du .feature
  //   expectedCount = 1

  await panierPage.navigateToCart();
  // ↑ Navigue vers /view_cart pour vérifier le contenu

  const count = await panierPage.getCartItemCount();
  // ↑ Compte le nombre de lignes dans le tableau du panier

  expect(count).toBe(expectedCount);
  // ↑ toBe() : égalité stricte
  //   expect(1).toBe(1) → ✅
});


Then('je devrais voir le produit dans le panier', async function () {

  const productName = await panierPage.getCartProductName();
  // ↑ Lit le nom du premier produit dans le panier

  expect(productName.length).toBeGreaterThan(0);
  // ↑ Le nom n'est pas vide → un produit est bien présent
  //   On ne vérifie pas le nom exact car il dépend de l'ordre d'affichage
  //   des produits sur le site (peut changer)

  console.log(`Produit dans le panier : ${productName}`);
  // ↑ Log utile pour voir quel produit a été ajouté dans le rapport Allure
});


Then('le panier devrait afficher un prix valide', async function () {

  const price = await panierPage.getCartProductPrice();
  // ↑ Lit le prix du premier produit dans le panier

  expect(price).toContain('Rs.');
  // ↑ Sur Automation Exercise, tous les prix sont au format "Rs. XXX"
  //   Si le prix ne contient pas "Rs." → quelque chose ne va pas

  console.log(`Prix dans le panier : ${price}`);
});


// ajout depuis les details.      

 When('j\'ajoute le produit au panier depuis le détail', async function () {
          await panierPage.clickAddToCartFromDetail();

         });


// ******************** qte 3

When('je change la quantité à {int}', async function (quantity: number) {
  await panierPage.setQuantity(quantity);
  // ↑ Vide le champ et saisit la nouvelle quantité
});

Then('la quantité dans le panier devrait être {int}', async function (expectedQty: number) {
  const actualQty = await panierPage.getCartQuantity();
  expect(actualQty).toBe(expectedQty);
  // ↑ expect(3).toBe(3) → ✅
});

Then('le total devrait correspondre au prix unitaire multiplié par {int}', async function (qty: number) {

  const priceText = await panierPage.getCartProductPrice();
  const totalText = await panierPage.getCartTotal();

  const extractPrice = (text: string): number => {
    return parseInt(text.replace('Rs.', '').trim());
    // ↑ "Rs. 500" → "500" → 500
  };

  const unitPrice = extractPrice(priceText);
  const total     = extractPrice(totalText);

  expect(total).toBe(unitPrice * qty);
  // ↑ expect(1500).toBe(500 * 3) → ✅
});


// =============================================================================
// NOTES IMPORTANTES POUR LES APPRENANTS
// =============================================================================
//
// 1. CONFLIT POSSIBLE avec produits.steps.ts :
//    Le Given 'je suis sur la page des produits' existe dans les deux fichiers.
//    Pour éviter "ambiguous" → utiliser un tag différent dans le Background
//    ou créer un Given spécifique au panier :
//    'je suis sur la page des produits pour le panier'
//
// 2. hover() est indispensable sur Automation Exercise :
//    Le bouton "Add to cart" n'est visible qu'au survol (CSS :hover)
//    Sans hover() → le bouton est invisible → click() échoue
//
// 3. waitForURL() après clickViewCart() :
//    La navigation peut prendre du temps
//    Sans attente → les assertions sur /view_cart peuvent échouer
//
// 4. La modale #cartModal a une animation CSS :
//    waitFor({ state: 'visible' }) dans le POM gère ce délai
//    Ne jamais utiliser waitForTimeout() ici
// =============================================================================
