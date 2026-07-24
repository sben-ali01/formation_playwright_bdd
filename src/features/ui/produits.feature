@products
Feature: Gestion des produits
  En tant qu'utilisateur sur Automation Exercise
  Je veux pouvoir consulter la liste des produits
  Afin de trouver un article qui m'intéresse

  Background:
    Given je suis sur la page des produits

  @afficherListe
  Scenario: Affichage de la liste des produits
    Then je devrais voir une liste de produits
    And le nombre de produits affichés devrait être supérieur à 0

  @rechercheProduit
  Scenario: Recherche d'un produit par mot-clé
    When je recherche le produit "Sleeveless"
    Then je devrais voir des résultats de recherche
    And chaque résultat devrait contenir le mot "Sleeveless"

  @afficherProduit
  Scenario: Affichage du détail d'un produit
    When je clique sur le premier produit
    Then je devrais voir le nom du produit
    And je devrais voir le prix du produit
    And je devrais voir la description du produit