import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentService {
  private env: any;

  constructor() {
    this.initializeEnv();
  }

  private initializeEnv(): void {
    try {
      const windowEnv = (window as any).__env;
      const hasWindowEnv =
        windowEnv && Object.values(windowEnv).some((value) => value !== null);

      this.env = hasWindowEnv ? windowEnv : environment;

      if (this.isProduction()) {
        this.env = (window as any).__env || {};
        console.log('Production mode detected. Using config.js');
      } else {
        this.env = environment;
        console.log('Development mode detected. Using environment.ts');
      }
    } catch (error) {
      console.error('Error initializing environment:', error);
      this.env = environment;
    }
  }

  public get(key: string): any {
    return this.env?.[key];
  }

  public isProduction(): boolean {
    return this.env.production === true || this.env.production === 'true';
  }
}
