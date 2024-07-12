import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

declare let Stripe: any;

@Component({
  selector: 'app-checkout',
  standalone: true,
  template: `<button (click)="checkout()">Upgrade to premium</button> `,
  styleUrl: './payment.component.scss'
})
export class PaymentComponent implements OnInit {
  private stripe: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.stripe = Stripe(environment.STRIPE_PUBLISHABLE_KEY);
  }

  async checkout() {
    try {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      // Create a checkout session on the server
      const response: any = await firstValueFrom(
        this.http.post(
          `${environment.API_URL}/stripe/create-checkout-session`,
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
