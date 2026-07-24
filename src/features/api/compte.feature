# =============================================================================
# src/features/api/compte.feature
# =============================================================================
# US : CRUD Compte via API REST
# API : https://automationexercise.com/api
# =============================================================================
#
# DIFFÉRENCE AVEC LES TESTS UI :
#   Tests UI  → Playwright pilote le navigateur
#   Tests API → Playwright envoie des requêtes HTTP directement
#               Pas de navigateur — beaucoup plus rapide
#
# FLUX CRUD :
#   CREATE → POST   /api/createAccount
#   READ   → GET    /api/getUserDetailByEmail
#   UPDATE → PUT    /api/updateAccount
#   DELETE → DELETE /api/deleteAccount
# =============================================================================

@apii
Feature: Gestion d'un compte utilisateur via API
  En tant que testeur sur Automation Exercise
  Je veux valider les opérations CRUD sur un compte utilisateur via l'API
  Afin de m'assurer que les endpoints fonctionnent correctement

  Background:
    Given l'API Automation Exercise est disponible
    And un email unique est généré pour ce test

  # ── CREATE ──────────────────────────────────────────────────────────────────
   @create
  Scenario: Créer un nouveau compte utilisateur
    When je crée un compte avec les données générées
    Then le code de réponse devrait être 201
    And le message de réponse devrait contenir "User created!"

  # ── READ ────────────────────────────────────────────────────────────────────
  @read
  Scenario: Récupérer les détails d'un compte existant
    Given un compte a été créé avec les données générées
    When je récupère les détails du compte par email
    Then le code de réponse devrait être 200
    And les détails devraient contenir le nom de l'utilisateur

  # ── UPDATE ──────────────────────────────────────────────────────────────────
 @update
  Scenario: Mettre à jour les informations d'un compte
    Given un compte a été créé avec les données générées
    When je mets à jour le nom du compte avec "UpdatedName"
    Then le code de réponse devrait être 200
    And le message de réponse devrait contenir "User updated!"

  # ── DELETE ──────────────────────────────────────────────────────────────────
  @delete
  Scenario: Supprimer un compte existant
    Given un compte a été créé avec les données générées
    When je supprime le compte
    Then le code de réponse devrait être 200
    And le message de réponse devrait contenir "Account deleted!"

  # ── FLUX COMPLET CRUD ───────────────────────────────────────────────────────
  @fluxComplet
  Scenario: Flux complet CRUD — créer, lire, mettre à jour et supprimer
    When je crée un compte avec les données générées
    Then le code de réponse devrait être 201

    When je récupère les détails du compte par email
    Then le code de réponse devrait être 200
    And les détails devraient contenir le nom de l'utilisateur

    When je mets à jour le nom du compte avec "NomMisAJour"
    Then le code de réponse devrait être 200

    When je supprime le compte
    Then le code de réponse devrait être 200
    And le message de réponse devrait contenir "Account deleted!"
