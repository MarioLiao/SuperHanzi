import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthGoogleService } from '../services/auth-google/auth-google.service';
import { WebsocketService } from '../websocket/websocket.service';
import { Subscription } from 'rxjs';
import { PaymentComponent } from '../components/payment/payment.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PaymentComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  private userInfo: any;
  //private gameRoom: any;
  private routerSubscription: Subscription;

  constructor(
    private router: Router,
    private authService: AuthGoogleService,
    private socket: WebsocketService,
  ) {
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.urlAfterRedirects !== '/game') {
          //this.gameRoom = null;
          console.log('erase room');
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

    this.userInfo = this.authService.getCurrentUser();
    console.log(this.userInfo);

    // store user info in variable
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }

  navigateToLearning() {
    this.router.navigate(['/learning']);
  }

  navigateToPractice() {
    this.router.navigate(['/practice']);
  }


  findMatch() {
    console.log(this.userInfo);

    this.router.navigate([
      '/game',
      { userInfo: JSON.stringify(this.userInfo) },
    ]);
  }

  navigateToGame() {
    this.router.navigate(['/game']);
  }
}