import { Component, ElementRef, ViewChild  } from '@angular/core';
import { CommonModule } from '@angular/common';
import HanziWriter from "hanzi-writer"

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
  writer!: HanziWriter;
  @ViewChild('learnCharacter', { static: true }) learnCharacter!: ElementRef<HTMLElement>;
  @ViewChild('learnInstructions', { static: true }) learnInstructions!: ElementRef<HTMLElement>;
  @ViewChild('learnButton', { static: true }) learnButton!: ElementRef<HTMLElement>;
  @ViewChild('learnDemonstration', { static: true }) learnDemonstration!: ElementRef<HTMLElement>;
  @ViewChild('learnQuizWithOutline', { static: true }) learnQuizWithOutline!: ElementRef<HTMLElement>;
  @ViewChild('learnQuizWithoutOutline', { static: true }) learnQuizWithoutOutline!: ElementRef<HTMLElement>;
  @ViewChild('learnStrokeHint', { static: true }) learnStrokeHint!: ElementRef<HTMLElement>;

  constructor(private router: Router) { }

  showOutline: boolean = false;

  hideCharacter: boolean = false;

  ngOnInit(): void {
    this.hideInitalElements();
    this.createCharacter();
    this.initializeSteps();
  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }

  hideInitalElements() {
    // Hide the appropriate elements when the page in initialized
    this.learnStrokeHint.nativeElement.hidden = true;
    this.learnDemonstration.nativeElement.hidden = true;
    this.learnQuizWithOutline.nativeElement.hidden = true;
    this.learnQuizWithoutOutline.nativeElement.hidden = true;
  }

  createCharacter() {
    // Create the character using thrid party API HanziWriter
    this.writer = HanziWriter.create('learn-character', '我', {
      width: 500,
      height: 500,
      padding: 5,
      strokeAnimationSpeed: 5,
      showCharacter: false,
      showOutline: true,
      showHintAfterMisses: false,
      highlightOnComplete: false,
    });
  }

  initializeSteps() {
      // Create the needed event listeners for a step by step guide on how to write the character
      this.learnButton.nativeElement.addEventListener('click', () => this.learn());
      this.learnDemonstration.nativeElement.addEventListener('click', () => this.demonstrate());
      this.learnQuizWithoutOutline.nativeElement.addEventListener('click', () => this.quizWithoutOutline());
      this.learnQuizWithOutline.nativeElement.addEventListener('click', () => this.quizWithOutline());
  }

  learn() {
    this.learnButton.nativeElement.hidden = true;
    this.learnDemonstration.nativeElement.hidden = false;
    this.changeInstructions("Click to see a demonstration for the character. Make sure to pay attention to where the stroke starts, where it is going, and the stroke order.");
  }

  demonstrate() {
    // Show an animation of writing the character's stroke
    this.learnDemonstration.nativeElement.hidden = true;
    this.writer.animateCharacter({
      onComplete: () => {
        this.learnQuizWithOutline.nativeElement.hidden = false;
        this.changeInstructions("Try writing the character yourself now, with the help of outlines.");
      }
  });
  }

  quizWithOutline() {
    // Quiz the user on how to write the character with outline help
    this.learnQuizWithOutline.nativeElement.hidden = true;
    this.writer.highlightStroke(0, {
      onComplete: () => {
        this.writer.quiz({
          onMistake: (strokeData) => {
              this.writer.highlightStroke(strokeData.strokeNum);
          },
          onCorrectStroke: (strokeData) => {
              if (strokeData.strokesRemaining > 0) {
                  this.writer.highlightStroke(strokeData.strokeNum + 1);
              }
          },
          onComplete: () => {
              this.learnQuizWithoutOutline.nativeElement.hidden = false;
              this.changeInstructions("Now, lets try to do write it without outlines. There will be hints you can use if you get stuck.");
          }
        });
      }
    });
  }

  quizWithoutOutline() {
     // Quiz the user on how to write the character without outline help
    this.learnQuizWithoutOutline.nativeElement.hidden = true;
    this.writer.hideOutline();
    this.writer.quiz({
      onMistake: (strokeData) => {
        if (strokeData.mistakesOnStroke >= 3) {
          this.learnStrokeHint.nativeElement.hidden = false;
          this.learnStrokeHint.nativeElement.addEventListener('click', () => {
              this.writer.highlightStroke(strokeData.strokeNum);
          });
        }
      },
      onCorrectStroke: () => {
        this.learnStrokeHint.nativeElement.hidden = true;
      },
      onComplete: (summaryData) => {
        this.changeInstructions(`Congratulations, you have just learned how to write the character ${summaryData.character}. To solidy your knowledge, practice it from our practice menu.`);
        this.learnButton.nativeElement.hidden = true;
        this.writer.showOutline();
      }
    });
  }

  changeInstructions(instructions: String) {
    this.learnInstructions.nativeElement.innerHTML = `${instructions}`;
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
