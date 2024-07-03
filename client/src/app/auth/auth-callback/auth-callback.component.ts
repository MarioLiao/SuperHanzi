import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthGoogleService } from '../auth-google.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-oauth-callback',
  template: '<p>Processing authentication...</p>',
  standalone: true,
})
export class AuthCallbackComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthGoogleService);
  private router = inject(Router);

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      if (token) {
        this.authService.handleCallback(token);
      } else {
        console.error('No token received');
        this.router.navigate(['/login']);
      }
    });
  }
}
