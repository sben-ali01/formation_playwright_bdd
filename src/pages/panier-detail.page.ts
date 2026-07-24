// =============================================================================
// src/pages/panier-detail.page.ts
// =============================================================================
//
// ROLE : Encapsule les interactions avec la page de détail d'un produit
//        et le panier depuis cette page.
//
// PAGES COUVERTES :
//   /product_details/1  → détail d'un produit
//   /view_cart          → contenu du panier après ajout
//   Modal               → confirmation d'ajout au panier
// =============================================================================

import { Page, Locator, expect } from '@playwright/test';
import 'dotenv/config';

export class PanierDetailPage {

  private readonly page: Page;

  // ── Locators — Page liste produits ────────────────────────────────────────

  readonly firstProductViewLink: Locator;
  // ↑ Lien "View Product" du premier produit dans la liste
  //   Mène vers la page de détail : /product_details/1

  // ── Locators — Page détail produit ────────────────────────────────────────

  readonly productName: Locator;
  // ↑ Nom du produit sur la page de détail
  //   Sélecteur : .product-information h2

  readonly productPrice: Locator;
  // ↑ Prix du produit sur la page de détail
  //   Format : "Rs. XXX"

  readonly productCategory: Locator;
  // ↑ Catégorie du produit (Women > Tops, Men > Jeans...)

  readonly quantityInput: Locator;
  // ↑ Champ de saisie de la quantité
  //   Valeur par défaut : 1

  readonly addToCartButton: Locator;
  // ↑ Bouton "Add to cart" sur la page de détail
  //   Différent du bouton dans l'overlay de la liste

  // ── Locators — Modal de confirmation ──────────────────────────────────────

  readonly modalConfirmation: Locator;
  // ↑ Modale #cartModal — même que dans panier.page.ts

  readonly viewCartButton: Locator;
  // ↑ Lien "View Cart" dans la modale

  readonly continueShoppingButton: Locator;
  // ↑ Bouton "Continue Shopping" dans la modale

  // ── Locators — Page panier (/view_cart) ───────────────────────────────────

  readonly cartItems: Locator;
  // ↑ Lignes du tableau du panier

  readonly cartProductName: Locator;
  // ↑ Nom du produit dans le panier

  readonly cartProductPrice: Locator;
  // ↑ Prix unitaire dans le panier

  readonly cartQuantity: Locator;
  // ↑ Quantité du produit dans le panier
  //   Important pour vérifier le scénario avec quantité modifiée

  readonly cartTotal: Locator;
  // ↑ Prix total de la ligne (quantité × prix unitaire)


  constructor(page: Page) {
    this.page = page;

    // -- Page liste --
    this.firstProductViewLink = page.locator(
      '.features_items .col-sm-4:first-child a[href*="product_details"]'
    );
    // ↑ Lien "View Product" du premier produit
    //   href*="product_details" → contient "product_details" dans l'URL
    //   :first-child → uniquement le premier produit

    // -- Page détail --
    this.productName = page.locator('.product-information h2');
    // ↑ Titre du produit — balise h2 dans .product-information

    this.productPrice = page.locator('.product-information span span');
    // ↑ Prix — deux span imbriqués dans .product-information

    this.productCategory = page.locator('.product-information p').nth(1);
    // ↑ Deuxième paragraphe dans .product-information
    //   nth(1) : index 0 = premier, index 1 = deuxième
    //   Contient : "Category: Women > Tops"

    this.quantityInput = page.locator('#quantity');
    // ↑ Champ quantité — identifié par son id #quantity
    //   Valeur par défaut : "1"

    this.addToCartButton = page.locator('button.cart');
    // ↑ Bouton "Add to cart" sur la page de détail
    //   Classe CSS .cart — différent de l'overlay de la liste

    // -- Modal --
    this.modalConfirmation = page.locator('#cartModal');
    this.viewCartButton = page.locator('#cartModal a[href="/view_cart"]');
    this.continueShoppingButton = page.locator('#cartModal button.close-modal');

    // -- Page panier --
    this.cartItems = page.locator('#cart_info_table tbody tr');
    this.cartProductName = page.locator(
      '#cart_info_table tbody tr td.cart_description h4 a'
    );
    this.cartProductPrice = page.locator(
      '#cart_info_table tbody tr td.cart_price p'
    );
    this.cartQuantity = page.locator(
      '#cart_info_table tbody tr td.cart_quantity button'
    );
    // ↑ Bouton qui affiche la quantité dans le panier
    //   Contient le chiffre : "1", "3", etc.

    this.cartTotal = page.locator(
      '#cart_info_table tbody tr td.cart_total p'
    );
    // ↑ Prix total de la ligne
  }


  // ── Navigation ─────────────────────────────────────────────────────────────

  async navigateToProducts(): Promise<void> {
    await this.page.goto('/products');
  }

  async navigateToFirstProductDetail(): Promise<void> {
    await this.navigateToProducts();
    await this.acceptCookiePopup();

    await this.firstProductViewLink.click();
    // ↑ Clique sur "View Product" du premier produit
    //   Redirige vers /product_details/1

    await this.page.waitForURL(/.*product_details/);
    // ↑ Attend que la navigation vers la page de détail soit complète
    //   /.*product_details/ → l'URL contient "product_details"
  }

  async navigateToCart(): Promise<void> {
    await this.page.goto('/view_cart');
  }


  // ── Actions ────────────────────────────────────────────────────────────────

  async setQuantity(quantity: number): Promise<void> {
    await this.quantityInput.clear();
    // ↑ Vide le champ avant de saisir la nouvelle valeur
    //   Sans clear() : "1" + "3" → "13" au lieu de "3"

    await this.quantityInput.fill(String(quantity));
    // ↑ fill() attend une string — on convertit le number en string
    //   String(3) → "3"
  }

  async clickAddToCart(): Promise<void> {
    await this.addToCartButton.click();
    // ↑ Clique sur "Add to cart" sur la page de détail
    //   Déclenche l'affichage de la modale #cartModal
  }

  async clickViewCart(): Promise<void> {
    await this.viewCartButton.waitFor({ state: 'visible' });
    await this.viewCartButton.click();
    await this.page.waitForURL(/.*view_cart/);
  }

  async clickContinueShopping(): Promise<void> {
    await this.continueShoppingButton.waitFor({ state: 'visible' });
    await this.continueShoppingButton.click();
  }

  async loginAndNavigate(): Promise<void> {
    // -- Connexion --
    await this.page.goto('/login');
    await this.page.locator('[data-qa="login-email"]')
      .fill(process.env.TEST_USER_EMAIL || '');
    await this.page.locator('[data-qa="login-password"]')
      .fill(process.env.TEST_USER_PASSWORD || '');
    await this.page.locator('[data-qa="login-button"]').click();
    await this.page.waitForURL('https://www.automationexercise.com/');
    // ↑ Attend la redirection après connexion

    // -- Navigation vers le détail du premier produit --
    await this.navigateToFirstProductDetail();
  }

  async acceptCookiePopup(): Promise<void> {
    try {
      const consentBtn = this.page.locator('button[aria-label="Consent"]');
      await consentBtn.waitFor({ state: 'visible', timeout: 500 });
      await consentBtn.click();
    } catch {
      // Popup absent → on continue
    }
  }


  // ── Getters ────────────────────────────────────────────────────────────────

  async getProductName(): Promise<string> {
    return await this.productName.textContent() ?? '';
  }

  async getProductPrice(): Promise<string> {
    return await this.productPrice.textContent() ?? '';
  }

  async getCartProductName(): Promise<string> {
    return await this.cartProductName.first().textContent() ?? '';
  }

  async getCartProductPrice(): Promise<string> {
    return await this.cartProductPrice.first().textContent() ?? '';
  }

  async getCartQuantity(): Promise<number> {
    const qty = await this.cartQuantity.first().textContent() ?? '0';
    return parseInt(qty.trim());
    // ↑ parseInt() : convertit la string "3" en number 3
    //   .trim() : supprime les espaces autour du texte
  }

  async getCartTotal(): Promise<string> {
    return await this.cartTotal.first().textContent() ?? '';
  }

  async isModalVisible(): Promise<boolean> {
    return await this.modalConfirmation.isVisible();
  }
}
