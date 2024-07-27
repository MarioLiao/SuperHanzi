import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthGoogleService } from '../services/auth-google/auth-google.service';
import { WebsocketService } from '../websocket/websocket.service';
import { Subscription } from 'rxjs';
import { PaymentComponent } from '../components/payment/payment.component';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from '../services/env/env.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PaymentComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  private userInfo: any;
  //private gameRoom: any;
  private routerSubscription: Subscription;

  private envService = inject(EnvironmentService);
  isUserPremium: boolean = true;

  constructor(
    private router: Router,
    private authService: AuthGoogleService,
    private socket: WebsocketService,
    private http: HttpClient,
  ) {
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.urlAfterRedirects !== '/game') {
          //this.gameRoom = null;
          //console.log('erase room');
        }
      }
    });
  }

  ngOnInit() {
    this.socket.onSignal((data) => {
      //listens for signal from server
    });

    this.socket.onDisconnect((data) => {
      //listens for disconnect from server
    });

    this.userInfo = this.authService.getUserFromStorage();
    // store user info in variable
    const apiUrl = this.envService.get('API_URL');
    this.http
      .get<{
        isUserPremium: boolean;
      }>(`${apiUrl}/isUserPremium/${this.userInfo.id}`, {})
      .subscribe((res) => {
        this.isUserPremium = res.isUserPremium;
      });
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }

  navigateToCredits() {
    this.router.navigate(['/credits']);
  }

  navigateToLearning() {
    this.router.navigate(['/character-selection/learning']);
  }

  navigateToPractice() {
    this.router.navigate(['/character-selection/practice']);
  }

  findMatch() {
    this.router.navigate(['/game'], { state: { userInfo: this.userInfo } });
  }

  signOut() {
    this.authService.logout();
  }
}
