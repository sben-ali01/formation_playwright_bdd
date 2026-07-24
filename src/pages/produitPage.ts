// =============================================================================
// src/pages/product.page.ts
// =============================================================================
//
// ROLE : Encapsule les interactions avec la page /products
//        Liste des produits, recherche, détail produit
// =============================================================================

import { Page, Locator, expect } from '@playwright/test';
import 'dotenv/config';

export class ProductPage {

  readonly page: Page;

  // -- Locators --
  readonly productsList: Locator;
  // ↑ Conteneur de tous les produits affichés sur la page

  readonly productItems: Locator;
  // ↑ Chaque carte produit individuelle


  // *************************************************



  readonly searchInput: Locator;
  // ↑ Champ de recherche

  readonly searchButton: Locator;
  // ↑ Bouton de soumission de la recherche

  readonly searchResults: Locator;
  // ↑ Résultats après une recherche

  readonly firstProduct: Locator;
  // ↑ Premier produit de la liste

  readonly productName: Locator;
  // ↑ Nom du produit sur la page détail

  readonly productPrice: Locator;
  // ↑ Prix du produit sur la page détail

  readonly productDescription: Locator;
  // ↑ Description du produit sur la page détail


  constructor(page: Page) {
    this.page = page;

    this.productsList   = page.locator('.features_items');
    // ↑ Conteneur principal de la liste des produits

    this.productItems   = page.locator('.features_items .col-sm-4');
    // ↑ Chaque carte produit — sélecteur CSS descendant

    // *************************************************

    this.searchResults  = page.locator('.features_items .col-sm-4');
    // ↑ Résultats de recherche — même structure que la liste

    
    
    // *************************************************


    this.searchInput    = page.locator('#search_product');
    // ↑ Champ de recherche — identifié par son id

    this.searchButton   = page.locator('#submit_search');
    // ↑ Bouton de recherche — identifié par son id


    // *************************************************

    this.firstProduct   = page.locator('.features_items .col-sm-4').first();
    // ↑ first() : premier élément de la liste de locators

    this.productName    = page.locator('.product-information h2');
    // ↑ Nom du produit sur la page de détail

    this.productPrice   = page.locator('.product-information span span');
    // ↑ Prix du produit sur la page de détail

    this.productDescription = page.locator('.product-information p').first();
    // ↑ Description du produit sur la page de détail
  }


  // -- Navigation --
  async navigate(): Promise<void> {
    await this.page.goto(process.env.BASE_URL);

    //await this.page.goto('/products');
    // ↑ BASE_URL + '/products'
    //   → https://www.automationexercise.com/products
  }

    // -- Getters --
  async getProductCount(): Promise<number> {
    return await this.productItems.count();
    // ↑ count() : retourne le nombre d'éléments correspondant au locator
    //   Pas besoin d'await sur count() lui-même mais la méthode est async
    //   pour cohérence avec le reste du POM
  }


  // ************************ TEST 2*************************


  // -- Actions --
  async searchProduct(keyword: string): Promise<void> {
    await this.searchInput.fill(keyword);
    // ↑ Saisit le mot-clé dans le champ de recherche

    await this.searchButton.click();
    // ↑ Soumet la recherche
  }


async getSearchResultsText(): Promise<string[]> {
  const count = await this.searchResults.count();
  const texts: string[] = [];

  for (let i = 0; i < count; i++) {
    const text = await this.searchResults.nth(i).locator('.productinfo p').textContent() ?? '';
    texts.push(text.toLowerCase().trim());
      // ↑ nth(i) : accède au i-ème élément de la liste
      //   On récupère le nom de chaque produit en minuscules
  }
  return texts;
      // ↑ Retourne un tableau de noms de produits
    //   Utilisé dans le step pour vérifier que chaque résultat
    //   contient le mot-clé recherché
}

  // ************************ TEST 3 *************************


  async clickFirstProduct(): Promise<void> {
    await this.firstProduct.locator('a[href*="product_details"]').click();
    // ↑ Clique sur le lien "View Product" du premier produit
    //   href*="product_details" → contient "product_details" dans l'URL
  }


  async getProductName(): Promise<string> {
    return await this.productName.textContent() ?? '';
  }

  async getProductPrice(): Promise<string> {
    return await this.productPrice.textContent() ?? '';
  }
  

  async acceptCookiePopup(): Promise<void> {
  try {
    const consentBtn = this.page.locator('button[aria-label="Consent"]');
    await consentBtn.waitFor({ state: 'visible', timeout: 500 });
    // ↑ Attend max 1 seconde que le bouton soit visible
    //   Si pas visible après 1s → exception → catch → on continue
    await consentBtn.click();
  } catch {
    // Popup absent → on passe immédiatement
  }
}
}