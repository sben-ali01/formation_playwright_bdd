# Projet BDD Playwright TypeScript

Ce projet est une implémentation de tests d'acceptation en BDD pour `automationexercise.com`, utilisant Playwright, Cucumber et TypeScript.

## Stack technique

- TypeScript
- Playwright (`@playwright/test`)
- Cucumber (`@cucumber/cucumber`)
- Allure Reports (`allure-cucumberjs`)
- ts-node
- dotenv

## Architecture du projet

- `src/features/` : fichiers `.feature` décrivant les scénarios Gherkin en français.
- `src/steps/` : définitions de steps Cucumber (`*.steps.ts`).
- `src/pages/` : page objects Playwright encapsulant les interactions UI.
- `src/hooks/` : hooks Cucumber (`Before`, `After`, `BeforeAll`, `AfterAll`) pour gérer le navigateur, le contexte, les captures et les vidéos.
- `src/support/` : utilitaires de support, dont `pageFixture.ts` pour partager `pageFixture.page` entre les fichiers.
- `rapports/` : sorties de test générées par Cucumber et Allure.
- `allure-results/` : données brutes Allure.
- `allure-report/` : rapport Allure HTML généré.

## Installation

1. Cloner le dépôt :

```bash
git clone <url-du-projet>
cd formation_play_bdd
```

2. Installer les dépendances :

```bash
npm install
```

3. Ajouter un fichier `.env` à la racine avec au minimum :

```env
BASE_URL=https://www.automationexercise.com
HEADLESS=false
TEST_USER_EMAIL=testautomation@uptotest.com
TEST_USER_PASSWORD=Test@1234
```

> `BASE_URL` définit l'URL de base du site testé.
> `HEADLESS=false` ouvre le navigateur en mode visible pour le debug.

## Lancer les tests

- Exécuter tous les scénarios Cucumber :

```bash
npm test
```

- Vérifier la configuration sans exécuter les steps (`dry run`) :

```bash
npm run test:dry
```

## Générer le rapport Allure

1. Lancer les tests avec Cucumber.
2. Générer le rapport Allure à partir des résultats :

```bash
npm run report
```

3. Ouvrir le rapport HTML :

- Ouvrir `allure-report/index.html` dans un navigateur.

## Nettoyer les rapports

```bash
npm run clean
```

## Notes importantes

- La configuration Cucumber est définie dans `cucumber.config.js`.
- Les fichiers TypeScript sont exécutés via `ts-node/register`.
- Les scenarios sont filtrés par tags dans `cucumber.config.js`.
- `pageFixture.page` est le point d'accès central à la page Playwright dans les steps et les page objects.

## Dossiers clés

- `src/features/` : BDD en français.
- `src/steps/ui/` : implémentation des steps UI.
- `src/pages/` : page objects réutilisables.
- `src/hooks/` : gestion de l'environnement de test.
- `src/support/pageFixture.ts` : partage de la page entre modules.

---

Ce README présente l'architecture, l'installation et les commandes pour exécuter et analyser les tests de ce projet BDD Playwright TypeScript.