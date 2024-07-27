import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payment-result',
  standalone: true,
  imports: [],
  templateUrl: './payment-result.component.html',
  styleUrl: './payment-result.component.scss',
})
export class PaymentResultComponent {
  public status: any;
  public title: string = 'Payment Successful';
  public message: string = 'Thank you for your purchase!';
  public color: string = 'green';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.status = this.route.snapshot.paramMap.get('status');
    if (this.status == 'success') {
      this.title = 'Payment Successful';
      this.message = 'Thank you for your purchase!';
      this.color = 'rgb(93, 165, 93)';
    } else {
      this.title = 'Payment Failed';
      this.message = 'Please wait for a few minutes and try again...';
      this.color = 'rgb(187, 66, 66)';
    }
  }

  navigateToHome() {
    // Navigate to home page
    this.router.navigate(['/home']);
  }
}
