// =============================================================================
// config/config-loader.ts
// =============================================================================
//
// ROLE : Lire config.yaml et exposer les données de paiement
//        sous forme d'objet TypeScript typé
//
// UTILISATION :
//   import { config } from '../../config/config-loader';
//   config.payment.cardNumber
//   config.payment.cvc
// =============================================================================

import * as fs from 'fs';
// ↑ fs = File System — module Node.js natif
//   Permet de lire des fichiers depuis le disque
//   import * as fs → importe tout le module sous le nom "fs"

import * as path from 'path';
// ↑ path = module Node.js natif pour manipuler les chemins de fichiers
//   Permet de construire des chemins absolus compatibles Windows/Mac/Linux

import * as yaml from 'js-yaml';
// ↑ js-yaml = librairie externe — npm install js-yaml
//   Transforme le contenu YAML (string) en objet JavaScript

import 'dotenv/config';
// ↑ Charge le fichier .env dans process.env
//   Doit être importé en premier si on lit des variables d'environnement


// =============================================================================
// INTERFACE TYPESCRIPT — Décrit la structure des données de paiement
// =============================================================================

interface PaymentConfig {
// ↑ interface : contrat TypeScript — décrit la forme d'un objet
//   Permet l'autocomplétion dans VS Code
//   Si on écrit config.payment.cardNumbr → TypeScript signale l'erreur

  cardName: string;
  // ↑ string : type TypeScript — attend une chaîne de caractères
  //   Correspondance YAML : cardName: "Test Automation"

  cardNumber: string;
  // ↑ On garde string et non number car le numéro de carte
  //   peut commencer par des zéros → number les supprimerait

  cvc: string;
  // ↑ Idem — "123" reste "123" et non 123

  expiryMonth: string;
  expiryYear: string;
}


// =============================================================================
// INTERFACE PRINCIPALE — Structure complète exportée
// =============================================================================

export interface AppConfig {
// ↑ export : rend cette interface accessible depuis les autres fichiers
//   Les fichiers qui importent config peuvent voir le type AppConfig

  payment: PaymentConfig;
  // ↑ Un seul champ pour l'instant — uniquement les données de paiement
}


// =============================================================================
// FONCTION DE CHARGEMENT
// =============================================================================

function loadConfig(): AppConfig {
// ↑ Fonction qui lit le YAML et retourne un objet AppConfig
//   Appelée une seule fois → résultat mis en cache par Node.js

  // -- Étape 1 : Construire le chemin vers config.yaml --
  const configPath = path.resolve(__dirname, 'config.yaml');
  // ↑ __dirname : variable Node.js = chemin absolu du DOSSIER du fichier actuel
  //   Si config-loader.ts est dans /projet/config/
  //   alors __dirname = '/projet/config'
  //
  //   path.resolve(__dirname, 'config.yaml')
  //   → '/projet/config/config.yaml'
  //
  //   Pourquoi path.resolve et pas juste 'config.yaml' ?
  //   → 'config.yaml' est relatif au dossier d'exécution (variable)
  //   → path.resolve(__dirname, ...) est toujours absolu (stable)


  // -- Étape 2 : Lire le fichier YAML --
  const fileContent = fs.readFileSync(configPath, 'utf-8');
  // ↑ fs.readFileSync() : lecture SYNCHRONE du fichier
  //   Retourne le contenu du fichier en string
  //
  //   'utf-8' : encodage du fichier — nécessaire pour lire du texte
  //   Sans 'utf-8' : retourne un Buffer (données binaires) → illisible
  //
  //   Synchrone vs Asynchrone :
  //   readFileSync() → bloque jusqu'à la fin de la lecture → simple
  //   readFile()     → non bloquant → nécessite async/await → plus complexe
  //   Pour lire un fichier de config au démarrage → readFileSync est correct


  // -- Étape 3 : Parser le YAML en objet JavaScript --
  const yamlData = yaml.load(fileContent) as any;
  // ↑ yaml.load() : transforme la string YAML en objet JavaScript
  //
  //   fileContent (string YAML) :
  //   "payment:\n  cardNumber: '4111...'\n  cvc: '123'"
  //
  //   yamlData (objet JavaScript après parsing) :
  //   { payment: { cardNumber: '4111...', cvc: '123' } }
  //
  //   as any : cast TypeScript
  //   yaml.load() retourne 'unknown' → on cast en 'any' pour accéder
  //   aux propriétés sans erreur TypeScript
  //   On récupère le typage correct via l'interface AppConfig au retour


  // -- Étape 4 : Retourner l'objet typé --
  return {
    payment: yamlData.payment,
    // ↑ Accède à la clé 'payment' de l'objet parsé
    //   yamlData.payment = { cardName, cardNumber, cvc, expiryMonth, expiryYear }
    //   TypeScript vérifie que cela correspond à PaymentConfig
  };
}


// =============================================================================
// EXPORT SINGLETON
// =============================================================================

export const config = loadConfig();
// ↑ SINGLETON : loadConfig() est appelé UNE SEULE FOIS
//   Node.js met les modules en cache → même objet partagé partout
//
//   Quand un fichier écrit :
//   import { config } from '../../config/config-loader';
//   → Node.js retourne l'objet déjà créé (depuis le cache)
//   → loadConfig() n'est PAS rappelé
//
//   Résultat : config.payment est le MÊME objet dans tous les fichiers
//              performances optimales — le fichier YAML n'est lu qu'une fois


// =============================================================================
// UTILISATION DANS LES AUTRES FICHIERS
// =============================================================================
//
// checkout.page.ts :
//   import { config } from '../../config/config-loader';
//   await this.cardNumberInput.fill(config.payment.cardNumber);
//   await this.cardCvcInput.fill(config.payment.cvc);
//   await this.cardExpiryMonthInput.fill(config.payment.expiryMonth);
//   await this.cardExpiryYearInput.fill(config.payment.expiryYear);
//
// =============================================================================
