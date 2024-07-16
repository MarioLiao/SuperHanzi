import { Component, inject, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { EnvironmentService } from '../../services/env/env.service';

declare let Stripe: any;

@Component({
  selector: 'app-checkout',
  standalone: true,
  template: `<button (click)="checkout()">Upgrade to premium</button> `,
  styleUrl: './payment.component.scss'
})
export class PaymentComponent implements OnInit {
  private stripe: any;
  private envService = inject(EnvironmentService);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const stripeKey = this.envService.get('STRIPE_PUBLISHABLE_KEY');
    this.stripe = Stripe(stripeKey);
  }

  async checkout() {
    try {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      // Create a checkout session on the server
      const apiUrl = this.envService.get('API_URL');
      const response: any = await firstValueFrom(
        this.http.post(
          `${apiUrl}/stripe/create-checkout-session`,
          {
            amount: 2500,
            currency: 'cad',
          },
          {
            headers: headers,
          }
        )
      );

      // Redirect to Stripe Checkout
      const result = await this.stripe.redirectToCheckout({
        sessionId: response.sessionId,
      });

      if (result.error) {
        console.error('Error:', result.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
}
