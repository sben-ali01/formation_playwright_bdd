// =============================================================================
// src/api/compte.api.ts
// =============================================================================
//
// ROLE : Client API — équivalent du Page Object Model pour les tests API
//        Encapsule toutes les requêtes HTTP liées au compte utilisateur
//
// POURQUOI CE FICHIER ?
//   Sans compte.api.ts : les URLs et paramètres sont éparpillés dans les steps
//   Avec compte.api.ts : centralisé → un seul endroit à modifier si l'API change
//
// DIFFÉRENCE AVEC LES PAGE OBJECTS :
//   Page Object  → page.locator(), page.click(), page.fill()
//   API Client   → request.get(), request.post(), request.delete()
//
// FORMAT DES REQUÊTES Automation Exercise :
//   Content-Type : application/x-www-form-urlencoded (pas JSON !)
//   Paramètres   : envoyés via { form: { key: value } }
// =============================================================================

import { APIRequestContext, APIResponse } from '@playwright/test';
// ↑ APIRequestContext : client HTTP Playwright — envoie les requêtes
//   APIResponse       : réponse HTTP — status(), json(), text()

import 'dotenv/config';

// URL de base de l'API
const API_BASE_URL = process.env.API_BASE_URL || 'https://automationexercise.com/api';
// ↑ Lue depuis le .env
//   Sans www — différent de BASE_URL (interface UI)


export class CompteApi {
// ↑ Classe qui encapsule toutes les opérations API sur les comptes
//   Même principe que LoginPage mais pour les requêtes HTTP

  private readonly request: APIRequestContext;
  // ↑ Client HTTP Playwright — injecté depuis le step via le constructeur
  //   Permet d'envoyer des requêtes GET, POST, PUT, DELETE

  constructor(request: APIRequestContext) {
    this.request = request;
    // ↑ On reçoit le client HTTP depuis les steps
    //   Les steps ont accès à request via pageFixture ou APIRequestContext
  }


  // ── CREATE — POST /api/createAccount ───────────────────────────────────────

  async createAccount(data: {
    name: string;
    email: string;
    password: string;
    title: string;
    birth_date: string;
    birth_month: string;
    birth_year: string;
    firstname: string;
    lastname: string;
    company: string;
    address1: string;
    city: string;
    state: string;
    zipcode: string;
    country: string;
    mobile_number: string;
  }): Promise<APIResponse> {
  // ↑ TypeScript interface inline — décrit les données requises par l'API
  //   Tous ces champs sont OBLIGATOIRES pour createAccount
  //   Retourne APIResponse pour que le step puisse vérifier status() et json()

    return await this.request.post(`${API_BASE_URL}/createAccount`, {
      form: data,
      // ↑ form: {} → application/x-www-form-urlencoded
      //   REQUIS par Automation Exercise — pas application/json
      //   Playwright encode automatiquement les données
    });
  }


  // ── READ — GET /api/getUserDetailByEmail ───────────────────────────────────

  async getUserByEmail(email: string, password: string): Promise<APIResponse> {
  // ↑ Récupère les détails d'un utilisateur par son email
  //   Nécessite l'email ET le password pour l'authentification

    return await this.request.get(`${API_BASE_URL}/getUserDetailByEmail`, {
      params: {
        email,
        password,
        // ↑ params: {} → paramètres de query string pour GET
        //   URL finale : /api/getUserDetailByEmail?email=...&password=...
      },
    });
  }


  // ── UPDATE — PUT /api/updateAccount ───────────────────────────────────────

  async updateAccount(data: {
    name: string;
    email: string;
    password: string;
    title: string;
    birth_date: string;
    birth_month: string;
    birth_year: string;
    firstname: string;
    lastname: string;
    company: string;
    address1: string;
    city: string;
    state: string;
    zipcode: string;
    country: string;
    mobile_number: string;
  }): Promise<APIResponse> {
  // ↑ Mêmes champs que createAccount
  //   PUT remplace TOUTES les données → tous les champs obligatoires

    return await this.request.put(`${API_BASE_URL}/updateAccount`, {
      form: data,
      // ↑ PUT avec form-data — même format que POST
    });
  }


  // ── DELETE — DELETE /api/deleteAccount ────────────────────────────────────

  async deleteAccount(email: string, password: string): Promise<APIResponse> {
  // ↑ Supprime un compte via email + password
  //   Méthode HTTP DELETE

    return await this.request.delete(`${API_BASE_URL}/deleteAccount`, {
      form: { email, password },
      // ↑ DELETE avec form-data sur Automation Exercise
      //   Certaines APIs utilisent des query params pour DELETE
      //   Automation Exercise utilise form-data
    });
  }


  // ── VERIFY LOGIN — POST /api/verifyLogin ──────────────────────────────────

  async verifyLogin(email: string, password: string): Promise<APIResponse> {
  // ↑ Vérifie que les credentials sont valides
  //   Utilisé pour confirmer qu'un compte existe après création

    return await this.request.post(`${API_BASE_URL}/verifyLogin`, {
      form: { email, password },
    });
  }


  // ── HELPERS ───────────────────────────────────────────────────────────────

  async parseResponse(response: APIResponse): Promise<{
    responseCode: number;
    message?: string;
    user?: Record<string, unknown>;
  }> {
  // ↑ Parse le body JSON de la réponse
  //   Automation Exercise encapsule toujours les données dans :
  //   { responseCode: 200, message: "...", user: {...} }

    const body = await response.json();
    // ↑ json() : parse le body en objet JavaScript

    return {
      responseCode: body.responseCode,
      // ↑ Code métier — différent du code HTTP
      //   HTTP 200 mais responseCode 404 = compte non trouvé

      message: body.message,
      // ↑ Message textuel — "User created!", "Account deleted!"...

      user: body.user,
      // ↑ Détails utilisateur — présent uniquement pour getUserDetailByEmail
    };
  }
}
