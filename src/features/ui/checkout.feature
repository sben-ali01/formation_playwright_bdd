@ui @checkout
Feature: Processus de commande (Checkout)
  En tant qu'utilisateur connecté sur Automation Exercise
  Je veux pouvoir finaliser ma commande
  Afin de recevoir mes produits

  Background:
    # ── Authentification ─────────────────────────────────────────────────────
    Given je suis sur la page de connexion
    When je saisis l'email ""
    And je saisis le mot de passe ""
    And je clique sur le bouton de connexion
    Then je devrais être connecté avec succès
    And je devrais voir mon nom "Salma" dans la navigation

    # ── Ajout produit au panier ───────────────────────────────────────────────
    When je clique sur le bouton produit
    When je survole le premier produit
    And je clique sur "Add to cart" du premier produit
    Then une confirmation d'ajout devrait s'afficher
    And je clique sur "View Cart"

  @parcourComplet
  Scenario: Parcours complet de checkout
    # ── Vérifier le panier ───────────────────────────────────────────────────
    Then je devrais voir le produit dans le panier de checkout
    And le panier de checkout devrait afficher un prix valide

    # ── Proceed To Checkout ───────────────────────────────────────────────────
    When je clique sur "Proceed To Checkout"
    Then je devrais voir le récapitulatif de ma commande
    And je devrais voir mon adresse de livraison
    And je devrais voir le total de la commande

    # ── Place Order ───────────────────────────────────────────────────────────
    When je saisis le commentaire "Commande de test UpToTest"
    And je clique sur "Place Order"

    # ── Paiement ──────────────────────────────────────────────────────────────
    Then je devrais être sur la page de paiement
    When je saisis les informations de carte bancaire
    And je confirme le paiement

    # ── Confirmation ──────────────────────────────────────────────────────────
    Then je devrais voir la confirmation de commande
    And le message de confirmation devrait contenir "Congratulations"
    And Test BDD