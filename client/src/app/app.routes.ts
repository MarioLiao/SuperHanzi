import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthCallbackComponent } from './components/auth-callback/auth-callback.component';
import { HomeComponent } from './home/home.component';
import { LearningComponent } from './learning/learning.component';
import { PracticeComponent } from './practice/practice.component';
import { GameComponent } from './game/game.component';
import { CharacterSelectionComponent } from './character-selection/character-selection.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'oauth/callback', component: AuthCallbackComponent },
  { path: 'home', component: HomeComponent },
  { path: 'learning', component: LearningComponent },
  { path: 'practice', component: PracticeComponent },
  { path: 'game', component: GameComponent },
  { path: 'character-selection', component: CharacterSelectionComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
