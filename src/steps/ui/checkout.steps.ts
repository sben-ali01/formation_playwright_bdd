// =============================================================================
// src/steps/ui/checkout.steps.ts
// =============================================================================
//
// ROLE : Step Definitions UNIQUEMENT pour les nouveaux steps du checkout
//
// STEPS RÉUTILISÉS DEPUIS D'AUTRES FICHIERS (pas redéfinis ici) :
//   auth.steps.ts   → Given je suis sur la page de connexion
//                  → When je saisis l'email / le mot de passe
//                  → When je clique sur le bouton de connexion
//                  → Then je devrais être connecté avec succès
//                  → Then je devrais voir mon nom ... dans la navigation
//
//   panier.steps.ts → When je clique sur le bouton produit
//                  → When je survole le premier produit
//                  → When je clique sur "Add to cart" du premier produit
//                  → Then une confirmation d'ajout devrait s'afficher
//                  → When je clique sur "View Cart"
//
// NOUVEAUX STEPS DÉFINIS ICI :
//   Then je devrais voir le produit dans le panier de checkout
//   Then le panier de checkout devrait afficher un prix valide
//   When je clique sur "Proceed To Checkout"
//   Then je devrais voir le récapitulatif de ma commande
//   Then je devrais voir mon adresse de livraison
//   Then je devrais voir le total de la commande
//   When je saisis le commentaire {string}
//   When je clique sur "Place Order"
//   Then je devrais être sur la page de paiement
//   When je saisis les informations de carte bancaire
//   When je confirme le paiement
//   Then je devrais voir la confirmation de commande
//   Then le message de confirmation devrait contenir {string}
// =============================================================================

import { When, Then } from '@cucumber/cucumber';
// ↑ Pas de Given ici — le Given vient de auth.steps.ts
//   qui est chargé via requireModule dans cucumber.config.js

import { expect } from '@playwright/test';
import { pageFixture } from '../../support/pageFixture';
import { CheckoutPage } from '../../pages/checkout.page';

let checkoutPage: CheckoutPage;
// ↑ Initialisé dans le premier step checkout
//   "je clique sur Proceed To Checkout" est le premier step
//   spécifique au checkout — on initialise ici


// =============================================================================
// THEN — Vérification du panier avant checkout
// =============================================================================
// Ces steps ont un nom différent de ceux de panier.steps.ts
// pour éviter les conflits "ambiguous"

Then('je devrais voir le produit dans le panier de checkout', async function () {
// ↑ Nom différent de "je devrais voir le produit dans le panier"
//   → pas de conflit avec panier.steps.ts

  checkoutPage = new CheckoutPage(pageFixture.page);
  // ↑ Initialisation ici — on est sur /view_cart
  //   pageFixture.page est disponible car hooks.ts Before a tourné

  const productName = await checkoutPage.getCartProductName();
  expect(productName.length).toBeGreaterThan(0);
  console.log(`Produit dans le panier : ${productName}`);
});


Then('le panier de checkout devrait afficher un prix valide', async function () {
// ↑ Nom différent de "le panier devrait afficher un prix valide"

  const price = await checkoutPage.getCartProductPrice();
  expect(price).toContain('Rs.');
  console.log(`Prix : ${price}`);
});


// =============================================================================
// WHEN / THEN — Page panier → Checkout
// =============================================================================

When('je clique sur "Proceed To Checkout"', async function () {

  await checkoutPage.clickProceedToCheckout();
  // ↑ Clique sur le bouton en bas du panier
  //   waitForURL(/.*checkout/) dans le POM attend la navigation
});


Then('je devrais voir le récapitulatif de ma commande', async function () {

  const itemCount = await checkoutPage.getOrderItemCount();
  expect(itemCount).toBeGreaterThan(0);
  console.log(`Produits dans le récapitulatif : ${itemCount}`);
});


Then('je devrais voir mon adresse de livraison', async function () {

  await expect(checkoutPage.deliveryAddress).toBeVisible();
  // ↑ Le bloc #address_delivery est visible

  const addressText = await checkoutPage.getDeliveryAddressText();
  expect(addressText.length).toBeGreaterThan(0);
  console.log(`Adresse : ${addressText.trim()}`);
});


Then('je devrais voir le total de la commande', async function () {

  const total = await checkoutPage.getOrderTotal();
  expect(total).toContain('Rs.');
  console.log(`Total : ${total}`);
});


// =============================================================================
// WHEN — Commentaire + Place Order
// =============================================================================

When('je saisis le commentaire {string}', async function (comment: string) {
  await checkoutPage.fillComment(comment);
});


When('je clique sur "Place Order"', async function () {

  await checkoutPage.clickPlaceOrder();
  // ↑ waitForURL(/.*payment/) dans le POM attend la navigation
});


// =============================================================================
// THEN / WHEN — Page paiement
// =============================================================================

Then('je devrais être sur la page de paiement', async function () {

  await expect(pageFixture.page).toHaveURL(/.*payment/);
  await expect(checkoutPage.cardNameInput).toBeVisible();
  // ↑ Champ "Name on Card" visible → page paiement chargée
});


When('je saisis les informations de carte bancaire', async function () {

  await checkoutPage.fillPaymentDetails();
  // ↑ Remplit tous les champs depuis le .env :
  //   CARD_NAME, CARD_NUMBER, CARD_CVC, CARD_EXPIRY_MONTH, CARD_EXPIRY_YEAR
});


When('je confirme le paiement', async function () {

  await checkoutPage.clickPayAndConfirm();
  // ↑ waitForURL(/.*payment_done/) dans le POM attend la confirmation
});


// =============================================================================
// THEN — Page confirmation
// =============================================================================

Then('je devrais voir la confirmation de commande', async function () {

  await expect(pageFixture.page).toHaveURL(/.*payment_done/);
  await expect(checkoutPage.confirmationMessage).toBeVisible();
});


Then('le message de confirmation devrait contenir {string}', async function (expectedText: string) {

  const message = await checkoutPage.getConfirmationMessage2();
  expect(message).toContain(expectedText);
  console.log(`Confirmation : ${message}`);
});

 Then('Test BDD', async function () {
         
         });
