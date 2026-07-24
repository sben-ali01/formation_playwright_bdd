@registration
Feature: Inscription utilisateur
  En tant que nouvel utilisateur d'Automation Exercise
  Je veux pouvoir créer un compte depuis la page de connexion
  Afin d'accéder aux fonctionnalités réservées et gérer mon profil

  Background:
    Given je suis sur la page de connexion
    And je vois le formulaire New User Signup

  @smoke
  Scenario: Inscription complète en trois étapes
    When je remplis le nom "Test User"
    And je remplis l'email "test.user+bdd@example.com"
    And je clique sur le bouton Signup
    Then je devrais être sur la page Enter Account Information
    When je choisis le titre "Mr"
    And je saisis le mot de passe register "Password123!"
    And je choisis la date de naissance "1" "January" "1990"
    And je coche la newsletter
    And je coche les offres spéciales
    And je saisis le prénom "Test"
    And je saisis le nom de famille "User"
    And je saisis la société "TestCorp"
    And je saisis l'adresse "123 Test Street"
    And je saisis le pays "Canada"
    And je saisis l'état "Quebec"
    And je saisis la ville "Montreal"
    And je saisis le code postal "H1A1A1"
    And je saisis le mobile "0723456789"
    And je clique sur le bouton Create Account
    Then je devrais voir le message de confirmation "ACCOUNT CREATED!"
    And je devrais voir le bouton Continue
    When je clique sur le bouton Continue

  @regression
  Scenario: Email déjà existant
    When je remplis le nom "Salma"
    And je remplis l'email "salmabenali108@gmail.com"
    And je clique sur le bouton Signup
    Then je devrais voir le message d'erreur "Email Address already exist!"

  @regression
  Scenario: Champs obligatoires vides
    When je clique sur le bouton Signup
    Then je devrais voir un message de validation des champs obligatoires
