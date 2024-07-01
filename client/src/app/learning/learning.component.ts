import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import {  FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-learning',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './learning.component.html',
  styleUrl: './learning.component.scss'
})
export class LearningComponent {

  constructor(private router: Router) { }

  showOutline: boolean = false;

  hideCharacter: boolean = false;

  navigateToHome() {
    this.router.navigate(['/home']);
  }

  showOutlineToggle() {
    this.showOutline = !this.showOutline;

    //function to show the outline of the character in the whiteboard
  }

  hideCharacterToggle() {
    this.hideCharacter = !this.hideCharacter;

    //function to hide the character in the character section (only display romanized word)
  }


}
