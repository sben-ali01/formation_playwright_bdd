# 📦 package.json — Explication ligne par ligne

---

## Le fichier complet

```json
{
  "name": "formation_play_bdd",
  "version": "1.0.0",
  "description": "Formation BDD Playwright TypeScript Cucumber",
  "main": "index.js",
  "type": "commonjs",
  "scripts": {
    "test": "cucumber-js --config cucumber.config.js",
    "test:dry": "cucumber-js --config cucumber.config.js --dry-run",
    "test:smoke": "cross-env TAGS=@smoke cucumber-js --config cucumber.config.js",
    "test:headed": "cross-env HEADLESS=false cucumber-js --config cucumber.config.js",
    "test:smoke:headed": "cross-env TS_NODE_TRANSPILE_ONLY=true TAGS=@smoke HEADLESS=false cucumber-js --config cucumber.config.js"
  },
  "devDependencies": {
    "@cucumber/cucumber": "^12.9.0",
    "@playwright/test": "^1.60.0",
    "@types/js-yaml": "^4.0.9",
    "@types/node": "^25.9.1",
    "allure-cucumberjs": "^3.9.0",
    "allure-playwright": "^3.9.0",
    "cross-env": "^10.1.0",
    "rimraf": "^6.1.3",
    "ts-node": "^10.9.2",
    "typescript": "^5.8.3"
  },
  "dependencies": {
    "dotenv": "^17.4.2",
    "js-yaml": "^4.1.1"
  }
}
```

---

## Informations du projet

```json
"name": "formation_play_bdd"
```
Nom du projet — doit être en minuscules sans espaces.
Utilisé quand on publie un package sur npm (pas notre cas ici).

```json
"version": "1.0.0"
```
Version du projet au format MAJEUR.MINEUR.PATCH.
1.0.0 = première version stable.

```json
"type": "commonjs"
```
Format des modules Node.js utilisé dans ce projet.
`commonjs` → syntaxe `require()` / `module.exports`.
Sans cette ligne : Node.js peut se tromper de format et refuser de lancer les fichiers.

---

## Scripts — les commandes npm

```json
"test": "cucumber-js --config cucumber.config.js"
```
Lance : `npm test`
Exécute TOUS les scénarios définis dans `cucumber.config.js`.
Aucun filtre — tous les tags s'exécutent.

---

```json
"test:dry": "cucumber-js --config cucumber.config.js --dry-run"
```
Lance : `npm run test:dry`
`--dry-run` → Cucumber lit les .feature et liste les steps SANS les exécuter.
Utile pour vérifier que tous les steps sont bien implémentés.
Aucun navigateur n'est ouvert.

---

```json
"test:smoke": "cross-env TAGS=@smoke cucumber-js --config cucumber.config.js"
```
Lance : `npm run test:smoke`
Exécute uniquement les scénarios avec le tag `@smoke`.
`cross-env` → définit la variable d'environnement `TAGS=@smoke`
de manière compatible Windows, Mac et Linux.
Sans `cross-env` : la syntaxe `TAGS=@smoke` ne fonctionne pas sur Windows.

---

```json
"test:headed": "cross-env HEADLESS=false cucumber-js --config cucumber.config.js"
```
Lance : `npm run test:headed`
`HEADLESS=false` → le navigateur s'ouvre visuellement.
Par défaut (sans cette variable) : navigateur invisible.
Utile pour déboguer ou faire des démonstrations aux apprenants.

---

```json
"test:smoke:headed": "cross-env TS_NODE_TRANSPILE_ONLY=true TAGS=@smoke HEADLESS=false cucumber-js --config cucumber.config.js"
```
Lance : `npm run test:smoke:headed`
Combine trois variables d'environnement :
- `TS_NODE_TRANSPILE_ONLY=true` → ts-node compile TypeScript SANS vérifier les types. Évite les erreurs de configuration TypeScript qui bloquent l'exécution.
- `TAGS=@smoke` → filtre sur les tests critiques
- `HEADLESS=false` → navigateur visible

---

## devDependencies — outils de développement

Ces packages sont installés uniquement en développement.
Ils ne sont PAS inclus si on déploie l'application en production.
Installation : `npm install` (lit automatiquement devDependencies).

```json
"@cucumber/cucumber": "^12.9.0"
```
Le runner BDD — lit les fichiers .feature, exécute les step definitions.
`^12.9.0` → accepte les versions 12.9.x et supérieures mais pas 13.x.
Le `^` = compatible avec la version mineure et les patches.

---

```json
"@playwright/test": "^1.60.0"
```
Le framework de test qui pilote le navigateur.
Fournit : `Page`, `Browser`, `expect()`, `chromium.launch()`...
Playwright embarque ses propres navigateurs (installés avec `npx playwright install`).

---

```json
"@types/js-yaml": "^4.0.9"
```
Types TypeScript pour la librairie `js-yaml`.
Sans ça : TypeScript ne sait pas ce que retourne `yaml.load()` → erreur.
Les packages `@types/xxx` donnent l'autocomplétion dans VS Code.

---

```json
"@types/node": "^25.9.1"
```
Types TypeScript pour Node.js.
Donne accès à : `process.env`, `__dirname`, `fs`, `path`...
Sans ça : TypeScript ne reconnaît pas `process.env.BASE_URL` → erreur.

---

```json
"allure-cucumberjs": "^3.9.0"
```
Intégration Allure pour Cucumber.
Génère les données brutes du rapport dans `allure-results/`.
Utilisé dans `cucumber.config.js` dans la section `format`.

---

```json
"allure-playwright": "^3.9.0"
```
Intégration Allure pour Playwright.
Enrichit le rapport avec les screenshots, vidéos et traces Playwright.

---

```json
"cross-env": "^10.1.0"
```
Permet de définir des variables d'environnement dans les scripts npm
de manière compatible avec tous les systèmes d'exploitation.
Sans `cross-env` : `TAGS=@smoke npm test` fonctionne sur Mac/Linux
mais PAS sur Windows.

---

```json
"rimraf": "^6.1.3"
```
Équivalent de `rm -rf` compatible Windows/Mac/Linux.
Utilisé pour nettoyer les dossiers `allure-results`, `dist`...
Exemple dans les scripts : `"clean": "rimraf allure-results allure-report"`

---

```json
"ts-node": "^10.9.2"
```
Permet d'exécuter les fichiers `.ts` directement sans les compiler en `.js`.
Utilisé par Cucumber via `requireModule: ['ts-node/register']`.
Sans ts-node : il faudrait compiler tout le TypeScript avant de lancer les tests.

---

```json
"typescript": "^5.8.3"
```
Le compilateur TypeScript.
Version 5.8 = dernière version stable compatible avec ts-node.
⚠️ TypeScript 6.x a des breaking changes — rester sur la branche 5.x.

---

## dependencies — dépendances de production

Ces packages sont utilisés dans le code qui s'exécute (pas juste en dev).

```json
"dotenv": "^17.4.2"
```
Charge le fichier `.env` dans `process.env`.
Utilisé avec : `import 'dotenv/config'` dans hooks.ts et playwright.config.ts.
Sans dotenv : `process.env.BASE_URL` est toujours `undefined`.

---

```json
"js-yaml": "^4.1.1"
```
Parse les fichiers YAML en objets JavaScript.
Utilisé dans `config-loader.ts` : `yaml.load(fileContent)`.
Permet de lire `config.yaml` pour récupérer les données de test.

---

## Symboles de version

| Symbole | Signification | Exemple |
|---|---|---|
| `^1.2.3` | Accepte 1.x.x mais pas 2.x.x | `^12.9.0` → 12.9.x à 12.99.x |
| `~1.2.3` | Accepte 1.2.x uniquement | `~5.8.3` → 5.8.3 à 5.8.99 |
| `1.2.3` | Version exacte uniquement | Aucune mise à jour auto |

---

## Commandes essentielles

```bash
npm install              # Installe toutes les dépendances
npm run test:dry         # Vérifie les steps sans exécuter
npm run test:smoke       # Lance les tests @smoke (headless)
npm run test:smoke:headed # Lance les tests @smoke avec navigateur visible
```
