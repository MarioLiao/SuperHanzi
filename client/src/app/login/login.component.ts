import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthGoogleService } from '../services/auth-google.service';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';

const MODULES: any[] = [CommonModule, MatInputModule, MatFormFieldModule, FormsModule, ReactiveFormsModule];

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

  loginForm: FormGroup;
  registerForm: FormGroup;

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
      console.log('Login with', email, password);
      // Implement login logic
    }
  }

  onRegister() {
    if (this.registerForm.valid) {
      const { email, password, confirmPassword } = this.registerForm.value;
      if (password === confirmPassword) {
        console.log('Register with', email, password);
        // Implement registration logic
      } else {
        console.error('Passwords do not match');
      }
    }
  }
}
