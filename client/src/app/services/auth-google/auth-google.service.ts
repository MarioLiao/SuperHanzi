import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { EnvironmentService } from '../env/env.service';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthGoogleService {
  private router = inject(Router);
  private http = inject(HttpClient);
  private envService = inject(EnvironmentService);

  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor() {
    this.currentUserSubject = new BehaviorSubject<User | null>(
      this.getUserFromStorage(),
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public getUserFromStorage(): User | null {
    const token = localStorage.getItem('token');
    if (token) {
      const user = this.parseJwt(token);
      return user;
    }
    return null;
  }

  private parseJwt(token: string): User | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join(''),
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  }

  login() {
    const apiUrl = this.envService.get('API_URL');
    window.location.href = `${apiUrl}/auth/google`;
  }

  handleCallback(token: string) {
    localStorage.setItem('token', token);
    const user = this.parseJwt(token);
    this.currentUserSubject.next(user);
    this.router.navigate(['/home']);
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
