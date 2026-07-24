// =============================================================================
// src/steps/ui/panier-detail.steps.ts
// =============================================================================
//
// ROLE : Step Definitions pour l'ajout au panier depuis la page de détail
//
// DIFFÉRENCE AVEC panier.steps.ts :
//   panier.steps.ts       → ajout depuis la LISTE (hover + overlay)
//   panier-detail.steps.ts → ajout depuis le DÉTAIL (page produit complète)
//
// AVANTAGE du détail vs la liste :
//   → Permet de choisir la quantité avant d'ajouter
//   → Affiche plus d'informations (description, disponibilité...)
//   → Bouton Add to cart toujours visible (pas besoin de hover)
// =============================================================================
/*
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { pageFixture } from '../../support/pageFixture';
import { PanierDetailPage } from '../../pages/panier-detail.page';

let panierDetailPage: PanierDetailPage;
// ↑ Instance du Page Object — initialisée dans le Given
//   Nom différent de panierPage → pas de conflit avec panier.steps.ts

let prixUnitaire: string;
// ↑ Stocke le prix unitaire lu sur la page de détail
//   Utilisé dans le Then pour vérifier que le total = prix × quantité


// =============================================================================
// GIVEN — Contexte initial
// =============================================================================

Given('je suis connecté et sur la page de détail du premier produit', async function () {

  panierDetailPage = new PanierDetailPage(pageFixture.page);
  // ↑ Initialisation du Page Object EN PREMIER
  //   pageFixture.page est disponible car hooks.ts Before a déjà tourné

  //await panierDetailPage.loginAndNavigate();
  // ↑ Fait deux choses :
  //   1. Se connecte avec les credentials du .env
  //   2. Navigue vers /products puis clique sur "View Product" du premier produit
  //   → On arrive sur /product_details/1 connecté
});


// =============================================================================
// WHEN — Actions utilisateur
// =============================================================================

When('j\'ajoute le produit au panier depuis le détail', async function () {

  prixUnitaire = await panierDetailPage.getProductPrice();
  // ↑ Sauvegarde le prix AVANT d'ajouter au panier
  //   Utilisé plus tard dans le Then de vérification du total
  //   Ex: "Rs. 500"

  await panierDetailPage.clickAddToCart();
  // ↑ Clique sur le bouton "Add to cart" de la page de détail
  //   Déclenche l'affichage de la modale #cartModal
  //   Pas besoin de hover() ici — le bouton est toujours visible
});


When('je change la quantité à {int}', async function (quantity: number) {
// ↑ {int} : Cucumber Expression — capture le nombre "3" du .feature
//   quantity = 3

  await panierDetailPage.setQuantity(quantity);
  // ↑ Vide le champ et saisit la nouvelle quantité
  //   setQuantity(3) → clear() + fill("3")
});


When('je clique sur "View Cart"', async function () {

  await panierDetailPage.clickViewCart();
  // ↑ Clique sur "View Cart" dans la modale
  //   Redirige vers /view_cart
  //   waitForURL(/.*view_cart/) attend la navigation
});


// =============================================================================
// THEN — Assertions
// =============================================================================

Then('je devrais voir le nom du produit sur la page de détail', async function () {

  const name = await panierDetailPage.getProductName();
  // ↑ Lit le nom du produit — balise h2 dans .product-information

  expect(name.length).toBeGreaterThan(0);
  // ↑ Le nom n'est pas vide → la page de détail est bien chargée

  console.log(`Produit : ${name}`);
  // ↑ Log dans le rapport Allure pour voir quel produit est testé
});


Then('je devrais voir le prix du produit sur la page de détail', async function () {

  const price = await panierDetailPage.getProductPrice();
  // ↑ Lit le prix — format "Rs. XXX"

  expect(price).toContain('Rs.');
  // ↑ Le prix contient "Rs." → format Automation Exercise respecté

  console.log(`Prix : ${price}`);
});


Then('une confirmation d\'ajout devrait s\'afficher', async function () {

  await expect(panierDetailPage.modalConfirmation).toBeVisible();
  // ↑ La modale #cartModal est visible après l'ajout
  //   toBeVisible() : retry automatique jusqu'au timeout

  const modalText = await panierDetailPage.modalConfirmation.textContent() ?? '';
  expect(modalText).toContain('Added');
  // ↑ La modale contient "Added" → confirmation d'ajout réussie
});


Then('je devrais voir le produit dans le panier', async function () {

  const productName = await panierDetailPage.getCartProductName();
  // ↑ Lit le nom du produit dans le tableau du panier

  expect(productName.length).toBeGreaterThan(0);
  // ↑ Un produit est bien présent dans le panier

  console.log(`Produit dans le panier : ${productName}`);
});


Then('le panier devrait afficher un prix valide', async function () {

  const price = await panierDetailPage.getCartProductPrice();
  // ↑ Lit le prix unitaire dans le panier

  expect(price).toContain('Rs.');
  // ↑ Le prix est au format Automation Exercise
});


Then('la quantité dans le panier devrait être {int}', async function (expectedQty: number) {
// ↑ {int} capture "3" du .feature → expectedQty = 3

  const actualQty = await panierDetailPage.getCartQuantity();
  // ↑ Lit la quantité affichée dans le panier
  //   parseInt() dans le POM convertit "3" → 3

  expect(actualQty).toBe(expectedQty);
  // ↑ La quantité dans le panier correspond à ce qu'on a saisi
  //   expect(3).toBe(3) → ✅
});


Then('le total devrait correspondre au prix unitaire multiplié par {int}', async function (qty: number) {
// ↑ Vérifie que le total = prix unitaire × quantité
//   qty = 3

  const totalText = await panierDetailPage.getCartTotal();
  // ↑ Prix total de la ligne — format "Rs. XXX"
  //   Ex: si prix = "Rs. 500" et qty = 3 → total = "Rs. 1500"

  const priceText = await panierDetailPage.getCartProductPrice();
  // ↑ Prix unitaire dans le panier

  const extractPrice = (text: string): number => {
    return parseInt(text.replace('Rs.', '').trim());
    // ↑ "Rs. 500" → "500" → 500
    //   replace() supprime "Rs. "
    //   parseInt() convertit en nombre
  };

  const unitPrice = extractPrice(priceText);
  const total     = extractPrice(totalText);
  // ↑ Extraction des valeurs numériques

  expect(total).toBe(unitPrice * qty);
  // ↑ Vérifie : total === prix × quantité
  //   expect(1500).toBe(500 * 3) → ✅
});

*/
// =============================================================================
// NOTES POUR LES APPRENANTS
// =============================================================================
//
// 1. DIFFÉRENCE LISTE vs DÉTAIL :
//    Liste  → hover() nécessaire, bouton dans l'overlay
//    Détail → bouton toujours visible, quantité modifiable
//
// 2. STOCKER DES DONNÉES ENTRE STEPS :
//    let prixUnitaire : string — variable de fichier
//    Initialisée dans un When → utilisée dans un Then
//    Pas besoin du Custom World pour des cas simples
//
// 3. CALCUL DU TOTAL :
//    extractPrice() : fonction helper locale pour parser "Rs. 500" → 500
//    parseInt() : convertit string → number pour le calcul
//    Toujours vérifier les arrondis si les prix ont des décimales
//
// 4. waitForURL() après clickViewCart() :
//    La navigation /view_cart peut prendre du temps
//    Sans attente → les assertions sur le panier peuvent échouer
// =============================================================================
