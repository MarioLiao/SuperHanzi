import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthCallbackComponent } from './components/auth-callback/auth-callback.component';
import { HomeComponent } from './home/home.component';
import { LearningComponent } from './learning/learning.component';
import { PracticeComponent } from './practice/practice.component';
import { GameComponent } from './game/game.component';
import { CharacterSelectionComponent } from './character-selection/character-selection.component';
import { PaymentResultComponent } from './payment-result/payment-result.component';
import { CreditsComponent } from './credits/credits.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
    data: { animation: 'LoginPage' },
  },
  { path: 'oauth/callback', component: AuthCallbackComponent },
  {
    path: 'home',
    component: HomeComponent,
    data: { animation: 'HomePage' },
    canActivate: [authGuard],
  },
  {
    path: 'learning',
    component: LearningComponent,
    data: { animation: 'LearningPage' },
    canActivate: [authGuard],
  },
  { path: 'practice', component: PracticeComponent, canActivate: [authGuard] },
  {
    path: 'game',
    component: GameComponent,
    data: { animation: 'GamePage' },
    canActivate: [authGuard],
  },
  {
    path: 'character-selection/:destination',
    component: CharacterSelectionComponent,
    data: { animation: 'CharacterSelectionPage' },
    canActivate: [authGuard],
  },
  { path: 'credits', component: CreditsComponent },
  {
    path: 'after-payment/:status',
    component: PaymentResultComponent,
    canActivate: [authGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
