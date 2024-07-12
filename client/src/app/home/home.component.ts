import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentComponent } from '../components/payment/payment.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PaymentComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(private router: Router) { }


  navigateToLearning() {
    this.router.navigate(['/learning']);
  }

  navigateToPractice() {
    this.router.navigate(['/practice']);
  }

  navigateToGame() {
    this.router.navigate(['/game']);
  }
}
