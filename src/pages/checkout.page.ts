// =============================================================================
// src/pages/checkout.page.ts
// =============================================================================
//
// ROLE : Encapsule les interactions des pages checkout et paiement
//        À partir de /view_cart jusqu'à /payment_done
//
// PAGES COUVERTES :
//   /view_cart    → bouton "Proceed To Checkout"
//   /checkout     → récapitulatif + adresse + commentaire + Place Order
//   /payment      → saisie carte bancaire + Pay and Confirm
//   /payment_done → confirmation de commande
//
// NOTE : La connexion et l'ajout au panier sont gérés par
//        auth.steps.ts et panier.steps.ts — pas ici
// =============================================================================

import { Page, Locator, expect } from '@playwright/test';
import 'dotenv/config';

import { config } from "../../config/config-loader";


export class CheckoutPage {

  private readonly page: Page;

  // ── Locators — Page panier (/view_cart) ────────────────────────────────────

  readonly proceedToCheckoutButton: Locator;
  // ↑ Bouton "Proceed To Checkout" en bas du panier
  //   Mène vers /checkout

  readonly cartProductName: Locator;
  readonly cartProductPrice: Locator;


  // ── Locators — Page checkout (/checkout) ───────────────────────────────────

  readonly deliveryAddress: Locator;
  // ↑ Bloc adresse de livraison — id #address_delivery

  readonly orderSummaryItems: Locator;
  // ↑ Lignes du récapitulatif de commande

  readonly orderTotal: Locator;
  // ↑ Montant total en bas du récapitulatif

  readonly commentInput: Locator;
  // ↑ Zone de texte pour le commentaire

  readonly placeOrderButton: Locator;
  // ↑ Bouton "Place Order" → mène vers /payment


  // ── Locators — Page paiement (/payment) ────────────────────────────────────

  readonly cardNameInput: Locator;
  readonly cardNumberInput: Locator;
  readonly cardCvcInput: Locator;
  readonly cardExpiryMonthInput: Locator;
  readonly cardExpiryYearInput: Locator;
  readonly payAndConfirmButton: Locator;


  // ── Locators — Page confirmation (/payment_done) ───────────────────────────

  readonly confirmationMessage: Locator;
  // ↑ Message "Congratulations! Your order has been confirmed!"

  readonly confirmationMessage2: Locator;
  // ↑ Message "Congratulations! Your order has been confirmed!"


  constructor(page: Page) {
    this.page = page;

    // -- Page panier --
    this.proceedToCheckoutButton = page.locator('.col-sm-6 a.btn.btn-default.check_out');
    this.cartProductName = page.locator('#cart_info_table tbody tr td.cart_description h4 a');
    this.cartProductPrice = page.locator('#cart_info_table tbody tr td.cart_price p');

    // -- Page checkout --
    this.deliveryAddress = page.locator('#address_delivery');
    this.orderSummaryItems = page.locator('#cart_info tbody tr');
    this.orderTotal = page.locator('.cart_total_price').last();
    this.commentInput = page.locator('textarea[name="message"]');
    this.placeOrderButton = page.locator('a.btn.btn-default.check_out');

    // Option 1 — sélecteur plus large
//this.orderTotal = page.locator('#cart_info tfoot td p').last();

// Option 2 — chercher par texte
//this.orderTotal = page.locator('tfoot').locator('p').last();

// Option 3 — chercher le prix total directement
//this.orderTotal = page.locator('.cart_total_price').last();

    // -- Page paiement --
    this.cardNameInput = page.locator('[data-qa="name-on-card"]');
    this.cardNumberInput = page.locator('[data-qa="card-number"]');
    this.cardCvcInput = page.locator('[data-qa="cvc"]');
    this.cardExpiryMonthInput = page.locator('[data-qa="expiry-month"]');
    this.cardExpiryYearInput = page.locator('[data-qa="expiry-year"]');
    this.payAndConfirmButton = page.locator('[data-qa="pay-button"]');

    // -- Page confirmation --
    this.confirmationMessage = page.locator('[data-qa="order-placed"] b');

     this.confirmationMessage2 = page.locator('.col-sm-9.col-sm-offset-1 p');
  }


  // ── Actions — Page panier ──────────────────────────────────────────────────

  async clickProceedToCheckout(): Promise<void> {
    await this.proceedToCheckoutButton.click();
    await this.page.waitForURL(/.*checkout/);
  }


  // ── Actions — Page checkout ────────────────────────────────────────────────

  async fillComment(comment: string): Promise<void> {
    await this.commentInput.fill(comment);
  }

  async clickPlaceOrder(): Promise<void> {
    await this.placeOrderButton.click();
    await this.page.waitForURL(/.*payment/);
  }


  // ── Actions — Page paiement ────────────────────────────────────────────────

  async fillPaymentDetails(): Promise<void> {
  /*
    await this.cardNameInput.fill(
      process.env.CARD_NAME
    );
    await this.cardNumberInput.fill(
      process.env.CARD_NUMBER
    );
    await this.cardCvcInput.fill(
      process.env.CARD_CVC
    );
    await this.cardExpiryMonthInput.fill(
      process.env.CARD_EXPIRY_MONTH
    );
    await this.cardExpiryYearInput.fill(
      process.env.CARD_EXPIRY_YEAR
    );
    */

    // ✅ Après — config centralisé

await this.cardNameInput.fill(config.payment.cardName);
await this.cardNumberInput.fill(config.payment.cardNumber);
await this.cardCvcInput.fill(config.payment.cvc);
await this.cardExpiryMonthInput.fill(config.payment.expiryMonth);
await this.cardExpiryYearInput.fill(config.payment.expiryYear);

  }

  

  async clickPayAndConfirm(): Promise<void> {
    await this.payAndConfirmButton.click();
    await this.page.waitForURL(/.*payment_done/);
  }


  // ── Getters ────────────────────────────────────────────────────────────────

  async getCartProductName(): Promise<string> {
    return await this.cartProductName.first().textContent() ?? '';
  }

  async getCartProductPrice(): Promise<string> {
    return await this.cartProductPrice.first().textContent() ?? '';
  }

  async getDeliveryAddressText(): Promise<string> {
    return await this.deliveryAddress.textContent() ?? '';
  }

  async getOrderTotal(): Promise<string> {
    return await this.orderTotal.textContent() ?? '';
  }

  async getOrderItemCount(): Promise<number> {
    return await this.orderSummaryItems.count();
  }

  async getConfirmationMessage(): Promise<string> {
    return await this.confirmationMessage.textContent() ?? '';
  }


  async getConfirmationMessage2(): Promise<string> {
    return await this.confirmationMessage2.textContent() ?? '';
  }
}
