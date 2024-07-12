import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthGoogleService } from '../services/auth-google/auth-google.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { environment } from '../../environments/environment';

const MODULES: any[] = [
  CommonModule,
  MatInputModule,
  MatFormFieldModule,
  FormsModule,
  ReactiveFormsModule,
];

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MODULES],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private authService = inject(AuthGoogleService);
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);

  loginForm: FormGroup;
  registerForm: FormGroup;
  isLogin = true;
  loginError: string | null = null;
  registerError: string | null = null;
  isLoading = false;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  signInWithGoogle() {
    this.authService.login();
  }

  onLogin() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.isLoading = true;
      this.loginError = null;
      this.http
        .post(`${environment.API_URL}/login`, { email, password })
        .subscribe({
          next: (response: any) => {
            console.log('Login successful', response);
            localStorage.setItem('token', response.token);
            this.router.navigate(['/home']);
          },
          error: (error) => {
            console.error('Login failed', error);
            this.loginError =
              'Login failed. Please check your credentials and try again.';
          },
          complete: () => {
            this.isLoading = false;
          },
        });
    }
  }

  onRegister() {
    if (this.registerForm.valid) {
      const { email, password, confirmPassword } = this.registerForm.value;
      if (password === confirmPassword) {
        this.isLoading = true;
        this.registerError = null;
        this.http
          .post(`${environment.API_URL}/signup`, { email, password })
          .subscribe({
            next: (response: any) => {
              console.log('Registration successful', response);
              localStorage.setItem('token', response.token);
              this.router.navigate(['/home']);
            },
            error: (error) => {
              // TODO: Handle errors
              console.error('Registration failed', error);
              this.registerError = 'Registration failed. Please try again.';
            },
            complete: () => {
              this.isLoading = false;
            },
          });
      } else {
        this.registerError = 'Passwords do not match';
      }
    }
  }

  // TODO: signout

  toggleForm() {
    this.isLogin = !this.isLogin;
    this.loginError = null;
    this.registerError = null;
  }
}
