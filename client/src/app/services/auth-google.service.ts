import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthGoogleService {
  private oAuthService = inject(OAuthService);
  private router = inject(Router);

  constructor() {
    this.initConfiguration();
  }

  initConfiguration() {
    const authConfig: AuthConfig = {
      issuer: environment.googleAuthIssuer,
      strictDiscoveryDocumentValidation: false,
      clientId: environment.googleClientId,
      redirectUri: window.location.origin + '/dashboard',
      scope: 'openid profile email',
    };

    this.oAuthService.configure(authConfig);
    this.oAuthService.setupAutomaticSilentRefresh();
    this.oAuthService.loadDiscoveryDocumentAndTryLogin();
  }

  login() {
    this.oAuthService.initImplicitFlow();
  }

  logout() {
    this.oAuthService.revokeTokenAndLogout();
    this.oAuthService.logOut();
  }

  async getProfile() {
    await this.oAuthService.loadDiscoveryDocumentAndTryLogin();
    const profile = this.oAuthService.getIdentityClaims();
    return profile ? profile : null;
  }

  getToken() {
    return this.oAuthService.getAccessToken();
  }
}
