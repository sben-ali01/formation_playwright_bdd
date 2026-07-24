@authentication
Feature: Authentification utilisateur
  En tant qu'utilisateur enregistré sur Automation Exercise
  Je veux pouvoir me connecter et me déconnecter de mon compte
  Afin d'accéder à mes commandes, mon profil et mes fonctionnalités personnalisées
  #Background:
    #Given je suis sur la page d'accueil d'Automation Exercise

  @smoke @login
  Scenario: Connexion réussie avec des identifiants valides
    Given je suis sur la page de connexion
    When je saisis l'email ""
    And je saisis le mot de passe ""
    And je clique sur le bouton de connexion
    Then je devrais être connecté avec succès
    And je devrais voir mon nom "dddd" dans la navigation
# ── Scénario 2 : Cas négatifs en Outline ─────────────────────────────────

  @loginInvalid
  Scenario Outline: Connexion échouée avec des identifiants invalides
    Given je suis sur la page de connexion
    When je saisis l'email "<email>"
    And je saisis le mot de passe "<password>"
    And je clique sur le bouton de connexion
    Then je devrais voir le mesg d'erreur "<message>"

    Examples:
      | email                     | password    | message                              |
      | test@uptotest.com         | mauvais_mdp | Your email or password is incorrect! |
      | email_inexistant@test.com | Test@1234   | Your email or password is incorrect! |
      |                           |             | Please fill in this field.           |
