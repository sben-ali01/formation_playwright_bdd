@deconnexion
Feature: Déconnexion utilisateur
  En tant qu'utilisateur connecté sur Automation Exercise
  Je veux pouvoir me déconnecter de mon compte
  Afin de sécuriser ma session et revenir à l'état non authentifié

  Background:
    Given je suis sur la page de connexion
    When je saisis l'email ""
    And je saisis le mot de passe ""
    And je clique sur le bouton de connexion
    Then je devrais être connecté avec succès

  @deconnexion
  Scenario: Déconnexion réussie
    When je clique sur le lien Logout
    Then je devrais être déconnecté
    And je devrais voir le lien Login dans la barre de navigation
