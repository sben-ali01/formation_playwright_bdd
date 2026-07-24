// =============================================================================
// src/pages/panier.page.ts
// =============================================================================
//
// ROLE : Encapsule les interactions avec le panier
//        Ajout depuis la liste, vérification du contenu, navigation
//
// PAGES COUVERTES :
//   /products      → liste des produits (hover + Add to cart)
//   /view_cart     → contenu du panier
//   Modal          → confirmation d'ajout au panier
// =============================================================================

import { Page, Locator, expect } from '@playwright/test';
import 'dotenv/config';

export class PanierPage {

  private readonly page: Page;

  // ── Locators — Page produits ───────────────────────────────────────────────
  readonly btnProduct: Locator;  

  readonly firstProduct: Locator;
  // ↑ Premier produit de la liste

  readonly firstProductOverlay: Locator;
  // ↑ Overlay qui apparaît au survol du produit
  //   Contient les boutons "Add to cart" et "View Product"

  readonly addToCartButton: Locator;
  // ↑ Bouton "Add to cart" dans l'overlay du premier produit

  // ── Locators — Modal de confirmation ──────────────────────────────────────

  readonly modalConfirmation: Locator;
  // ↑ Modale qui s'affiche après ajout au panier
  //   Contient : "Your product has been added to cart!"

  readonly continueShoppingButton: Locator;
  // ↑ Bouton "Continue Shopping" dans la modale
  //   Ferme la modale et reste sur la page produits

  readonly viewCartButton: Locator;
  // ↑ Bouton "View Cart" dans la modale
  //   Redirige vers /view_cart

  // ── Locators — Icône panier (navbar) ──────────────────────────────────────

  readonly cartIcon: Locator;
  // ↑ Icône du panier dans la navigation
  //   Affiche le nombre d'articles

  readonly cartCount: Locator;
  // ↑ Badge avec le nombre d'articles dans le panier

  // ── Locators — Page panier (/view_cart) ───────────────────────────────────

  readonly cartItems: Locator;
  // ↑ Lignes du tableau du panier (chaque produit = une ligne)

  readonly cartProductName: Locator;
  // ↑ Nom du produit dans le panier

  readonly cartProductPrice: Locator;
  // ↑ Prix unitaire du produit dans le panier

  readonly cartProductTotal: Locator;
  // ↑ Prix total de la ligne (quantité × prix unitaire)

  //*************************  ajout depuis details 
  readonly addToCartDetailButton: Locator;


  //************************** qte3 

readonly quantityInput: Locator;
readonly cartQuantity: Locator;
readonly cartTotal: Locator;

  constructor(page: Page) {
    this.page = page;

    // -- Page produits --
    this.btnProduct = page.locator('xpath=//*[@id="header"]/div/div/div/div[2]/div/ul/li[2]/a');

    this.firstProduct = page.locator('.features_items .col-sm-4').first();
    // ↑ Premier produit de la liste — .first() retourne le premier élément

    this.firstProductOverlay = page.locator(
      '.features_items .col-sm-4:first-child .product-overlay'
    );
    // ↑ Overlay du premier produit — visible uniquement au survol (CSS :hover)

    this.addToCartButton = page.locator(
      'xpath=/html/body/section[2]/div/div/div[2]/div/div[2]/div/div[1]/div[1]/a'
    ).first();
    // ↑ Bouton Add to cart dans l'overlay
    //   .first() car il peut y avoir plusieurs boutons sur la page

    // -- Modal de confirmation --
    this.modalConfirmation = page.locator('#cartModal');
    // ↑ La modale est identifiée par son id #cartModal
    //   Apparaît automatiquement après un clic sur "Add to cart"

    this.continueShoppingButton = page.locator('#cartModal button.close-modal');
    // ↑ Bouton "Continue Shopping" dans la modale

    this.viewCartButton = page.locator('#cartModal a[href="/view_cart"]');
    // ↑ Lien "View Cart" dans la modale
    //   href="/view_cart" → sélecteur stable basé sur la destination

    // -- Icône panier navbar --
    this.cartIcon = page.locator('a[href="/view_cart"]').first();
    // ↑ Premier lien vers le panier dans la navbar

    this.cartCount = page.locator('#header .shop-menu .nav li a[href="/view_cart"]');

    // -- Page panier --
    this.cartItems = page.locator('#cart_info_table tbody tr');
    // ↑ Chaque ligne du tableau = un produit dans le panier

    this.cartProductName = page.locator('#cart_info_table tbody tr td.cart_description h4 a');
    // ↑ Nom du produit — dans la colonne description

    this.cartProductPrice = page.locator('#cart_info_table tbody tr td.cart_price p');
    // ↑ Prix unitaire du produit

    this.cartProductTotal = page.locator('#cart_info_table tbody tr td.cart_total p');
    // ↑ Prix total de la ligne

    this.addToCartDetailButton = page.locator('button.cart');


// *********************** qte3
this.quantityInput = page.locator('#quantity');
// ↑ Champ quantité sur la page de détail — id #quantity

this.cartQuantity = page.locator('#cart_info_table tbody tr td.cart_quantity button');
// ↑ Bouton qui affiche la quantité dans le panier

this.cartTotal = page.locator('#cart_info_table tbody tr td.cart_total p');


  }


  // ── Navigation ─────────────────────────────────────────────────────────────

    
  async cliquerProducts(): Promise<void> {
    await this.btnProduct.click();
    // ↑ BASE_URL + '/products'
  }

  async navigateToCart(): Promise<void> {
    await this.page.goto('/view_cart');
    // ↑ Naviguer directement vers le panier
  }


  // ── Actions ────────────────────────────────────────────────────────────────

  async hoverFirstProduct(): Promise<void> {
    await this.firstProduct.hover();
    // ↑ hover() : simule le survol de la souris sur l'élément
    //   Déclenche le CSS :hover → affiche l'overlay avec les boutons
    //   Sans hover : les boutons Add to cart ne sont pas visibles
  }

  async clickAddToCartFirstProduct(): Promise<void> {
    await this.addToCartButton.click();
    // ↑ Clique sur "Add to cart" du premier produit
    //   Déclenche l'affichage de la modale de confirmation
  }

  async clickContinueShopping(): Promise<void> {
    await this.continueShoppingButton.waitFor({ state: 'visible' });
    // ↑ Attend que le bouton soit visible avant de cliquer
    //   La modale a une animation CSS — peut prendre quelques ms

    await this.continueShoppingButton.click();
    // ↑ Ferme la modale → reste sur la page produits
  }

  async clickViewCart(): Promise<void> {
    await this.viewCartButton.waitFor({ state: 'visible' });
    await this.viewCartButton.click();
    // ↑ Redirige vers /view_cart
    //   Attend la navigation après le clic
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

  async getCartItemCount(): Promise<number> {
    return await this.cartItems.count();
    // ↑ Nombre de lignes dans le tableau du panier
    //   Chaque ligne = un produit distinct
  }

  async getCartProductName(): Promise<string> {
    return await this.cartProductName.first().textContent() ?? '';
    // ↑ Nom du premier produit dans le panier
  }

  async getCartProductPrice(): Promise<string> {
    return await this.cartProductPrice.first().textContent() ?? '';
    // ↑ Prix du premier produit — format "Rs. XXX"
  }

  async isModalVisible(): Promise<boolean> {
    return await this.modalConfirmation.isVisible();
    // ↑ Vérifie si la modale de confirmation est affichée
  }


 // ajout depuis details 

 async clickAddToCartFromDetail(): Promise<void> {
  await this.addToCartDetailButton.click();
  }



// Méthodes qte3
async setQuantity(quantity: number): Promise<void> {
  //await this.quantityInput.clear();
  // ↑ Vide le champ — sans clear() : "1" + "3" → "13"
  await this.quantityInput.fill(String(quantity));
  // ↑ String(3) → "3" — fill() attend une string
}

async getCartQuantity(): Promise<number> {
  const qty = await this.cartQuantity.first().textContent() ?? '';
  return parseInt(qty.trim());
  // ↑ "3" → 3
}

async getCartTotal(): Promise<string> {
  return await this.cartTotal.first().textContent() ?? '';
}



}
