# ⚙️ tsconfig.json — Explication ligne par ligne

---

## Le fichier complet

```json
{
  "compilerOptions": {
    "module": "CommonJS",
    "target": "ES2022",
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "ts-node": {
    "transpileOnly": true
  }
}
```

---

## Pourquoi ce fichier existe ?

TypeScript est un langage qui se compile en JavaScript avant d'être exécuté.
`tsconfig.json` dit au compilateur TypeScript **comment** faire cette compilation.

Sans ce fichier : TypeScript utilise ses valeurs par défaut
— qui ne sont pas toujours compatibles avec Node.js et Cucumber.

---

## compilerOptions — Options de compilation

### `"module": "CommonJS"`

```json
"module": "CommonJS"
```

Définit le **format des modules** généré par TypeScript.

`CommonJS` = le format natif de Node.js :
```javascript
// Ce que TypeScript génère
const { chromium } = require('@playwright/test');
module.exports = { LoginPage };
```

Pourquoi pas `ESNext` ou `NodeNext` ?
→ Cucumber et ts-node fonctionnent nativement avec CommonJS.
→ `NodeNext` ou `ESNext` causent des conflits avec ts-node 10.x.

---

### `"target": "ES2022"`

```json
"target": "ES2022"
```

Définit la **version JavaScript** vers laquelle TypeScript compile.

`ES2022` = JavaScript moderne — donne accès à :
- `async/await` → pour les actions Playwright
- `?.` (optional chaining) → `scenario.result?.status`
- `??` (nullish coalescing) → `process.env.BASE_URL ?? 'https://...'`
- Classes avec propriétés privées

Pourquoi pas `ES5` ?
→ ES5 est la valeur par défaut de TypeScript — très ancien (2009).
→ Pas de `async/await` natif → Playwright ne fonctionnerait pas correctement.

---

### `"esModuleInterop": true`

```json
"esModuleInterop": true
```

Permet d'utiliser la syntaxe `import` moderne avec les packages CommonJS.

Sans cette option :
```typescript
// ❌ Erreur TypeScript
import dotenv from 'dotenv';
```

Avec cette option :
```typescript
// ✅ Fonctionne
import 'dotenv/config';
import { chromium } from '@playwright/test';
```

La plupart des packages npm utilisent CommonJS.
`esModuleInterop` fait le pont entre la syntaxe `import` et CommonJS.

---

### `"skipLibCheck": true`

```json
"skipLibCheck": true
```

Ignore les erreurs TypeScript dans les fichiers de `node_modules`.

Sans cette option : TypeScript vérifie AUSSI les types des packages installés
→ des centaines d'erreurs dans `node_modules` que tu ne contrôles pas.

Avec cette option : TypeScript ne vérifie que TON code.
→ Moins de bruit, moins de confusion pour les apprenants.

---

## ts-node — Configuration de ts-node

Cette section est lue par `ts-node`, pas par TypeScript directement.
`ts-node` est l'outil qui exécute les fichiers `.ts` sans les compiler d'abord.

### `"transpileOnly": true`

```json
"ts-node": {
  "transpileOnly": true
}
```

`transpileOnly: true` = ts-node **compile** le TypeScript en JavaScript
**SANS vérifier les types**.

Sans cette option :
→ ts-node vérifie les types avant chaque exécution
→ La moindre erreur TypeScript bloque les tests
→ Des erreurs dans les librairies externes bloquent aussi

Avec cette option :
→ ts-node compile et exécute immédiatement
→ Les erreurs de type n'empêchent pas les tests de tourner
→ Beaucoup plus rapide (pas de vérification des types)

Analogie :
→ Sans transpileOnly = un correcteur qui refuse de lire ton texte s'il y a une faute
→ Avec transpileOnly = un correcteur qui lit et comprend ton texte malgré les fautes

---

## Pourquoi ce tsconfig.json est minimal ?

On a supprimé toutes les options non essentielles :

| Option supprimée | Pourquoi supprimée |
|---|---|
| `moduleResolution` | Déduit automatiquement de `module: CommonJS` |
| `rootDir` / `outDir` | On ne compile pas en .js — ts-node s'en charge |
| `strict` | Utile mais peut bloquer les débutants avec trop d'erreurs |
| `declaration` / `sourceMap` | Utiles en production, pas en formation |
| `lib` | ES2022 inclut déjà les bonnes librairies par défaut |
| `include` / `exclude` | ts-node trouve les fichiers tout seul |

---

## Résumé visuel

```
tsconfig.json
│
├── compilerOptions
│   ├── module: CommonJS      → format Node.js natif
│   ├── target: ES2022        → JavaScript moderne (async/await)
│   ├── esModuleInterop: true → import fonctionne avec tous les packages
│   └── skipLibCheck: true    → ignore les erreurs dans node_modules
│
└── ts-node
    └── transpileOnly: true   → compile sans vérifier les types
```
