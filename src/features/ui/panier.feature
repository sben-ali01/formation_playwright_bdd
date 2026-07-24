@panier
Feature: Gestion du panier
  En tant qu'utilisateur sur Automation Exercise
  Je veux pouvoir ajouter des produits à mon panier depuis la liste
  Afin de préparer mes achats

  Background:
    Given je suis sur la page de connexion
    When je saisis l'email ""
    And je saisis le mot de passe ""
    And je clique sur le bouton de connexion
    Then je devrais être connecté avec succès
    And je devrais voir mon nom "Salma" dans la navigation


@ajouterPanier
  Scenario: Ajouter un produit au panier depuis la liste
    When je clique sur le bouton produit
    When je survole le premier produit
    And je clique sur "Add to cart" du premier produit
    Then une confirmation d'ajout devrait s'afficher
    And je clique sur "Continue Shopping"
    Then le panier devrait contenir 1 produit
    Then je devrais voir le produit dans le panier
    And le panier devrait afficher un prix valide

@ajouterDepuisDetail
  Scenario: Ajouter un produit depuis sa page de détail avec quantité par défaut
    When je clique sur le bouton produit
    And je clique sur le premier produit
    Then je devrais voir le nom du produit
    And je devrais voir le prix du produit

    When j'ajoute le produit au panier depuis le détail
    Then une confirmation d'ajout devrait s'afficher
    And je clique sur "View Cart"
    Then je devrais voir le produit dans le panier
    And le panier devrait afficher un prix valide
    

@ajouterAvecQuantite
  Scenario: Ajouter plusieurs unités d'un produit depuis le détail
    When je clique sur le bouton produit
    And je clique sur le premier produit
    Then je devrais voir le nom du produit

    When je change la quantité à 3
    And j'ajoute le produit au panier depuis le détail
    Then une confirmation d'ajout devrait s'afficher
    And je clique sur "View Cart"
    Then la quantité dans le panier devrait être 3
    And le total devrait correspondre au prix unitaire multiplié par 3

   
