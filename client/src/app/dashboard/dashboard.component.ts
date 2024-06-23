import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGoogleService } from '../services/auth-google.service';
import { CommonModule } from '@angular/common';

const MODULES = [CommonModule];

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MODULES],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthGoogleService);
  private router = inject(Router);

  profile: any;
  name: string | undefined;
  profileIcon: string | undefined;

  ngOnInit(): void {
    this.showData();
  }

  async showData() {
    try {
      this.profile = await this.authService.getProfile();
      if (this.profile) {
        this.name = this.profile.name;
        this.profileIcon = this.profile.picture;
      }
      console.log(this.profile);
    } catch (error) {
      console.error('Error fetching profile data', error);
    }
  }

  logOut() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
