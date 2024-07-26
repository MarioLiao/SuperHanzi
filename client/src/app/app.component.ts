import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { Router, ChildrenOutletContexts } from '@angular/router';
import { animation1 } from './animation';

const MODULES = [CommonModule, RouterOutlet, LoginComponent, HomeComponent];
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MODULES],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [animation1],
})
export class AppComponent {
  constructor(
    private router: Router,
    private contexts: ChildrenOutletContexts,
  ) {}

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }
  prepareRoute(outlet: RouterOutlet) {
    return (
      outlet &&
      outlet.activatedRouteData &&
      outlet.activatedRouteData['animation']
    );
  }
}
