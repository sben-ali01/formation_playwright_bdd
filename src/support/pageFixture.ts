// =============================================================================
// src/support/pageFixture.ts
// =============================================================================
//
// ROLE : Objet global qui partage l'instance `page` entre tous les fichiers.
//        Alternative au Custom World pour les projets simples.
//
// POURQUOI CE FICHIER ?
//   Sans pageFixture : chaque fichier (steps, pages) doit recevoir `page`
//                      en paramètre → couplage fort et code répétitif.
//   Avec pageFixture : on importe cet objet partout et on accède à
//                      pageFixture.page directement.
//
// DIFFÉRENCE AVEC LE CUSTOM WORLD :
//   Custom World  → lié au cycle de vie Cucumber (this dans les steps)
//   pageFixture   → objet JavaScript simple importé partout
//                   Plus simple à comprendre pour les débutants
//
// UTILISATION :
//   import { pageFixture } from '../support/pageFixture';
//   await pageFixture.page.goto('/login');
// =============================================================================

import { Page } from '@playwright/test';
// ↑ Import du type Page de Playwright
//   Donne l'autocomplétion TypeScript sur pageFixture.page


export const pageFixture = {
  // @ts-ignore
  page: undefined as Page,
  // @ts-ignore
  productPage: undefined as ProductPage,

  

  // ↑ undefined au démarrage — initialisé dans hooks.ts Before
  //   @ts-ignore : supprime l'erreur TypeScript sur undefined as Page
  //   En pratique : hooks.ts Before assigne la vraie instance avant
  //   que les steps s'exécutent → jamais undefined pendant les tests
};

// =============================================================================
// ERREUR FRÉQUENTE :
//   Utiliser pageFixture.page AVANT que Before() soit exécuté
//   → pageFixture.page est undefined → TypeError
//   Solution : toujours lire pageFixture.page DANS les steps/pages,
//              jamais au niveau du module (hors d'une fonction)
// =============================================================================
