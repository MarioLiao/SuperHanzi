import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app.routes';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { WriterComponent } from './writer/writer.component';
import { PaymentComponent } from './components/payment/payment.component';

@NgModule({
  declarations: [AppComponent, LoginComponent, HomeComponent, WriterComponent],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule,
    AppRoutingModule,
    PaymentComponent,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
