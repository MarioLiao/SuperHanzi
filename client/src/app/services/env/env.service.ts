import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentService {
  private env: any;

  constructor() {
    // Uses window.__env in prod, fall back to environment.ts in development
    this.env = (window as any).__env || environment;
  }

  public get(key: string): string {
    return this.env[key];
  }

  public isProduction(): boolean {
    return this.env.production === true || this.env.production === 'true';
  }
}
