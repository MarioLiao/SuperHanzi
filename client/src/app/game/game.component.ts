import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  FormsModule } from '@angular/forms';

import HanziWriter from "hanzi-writer"
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {
    player1Writer!: HanziWriter;
    player2Writer!: HanziWriter;
    character: string = '我';

    // Default values for game page
    isGameStarted: boolean = false;

    // Values for the game
    timer: number = 30;
    difficulty: number = 1;
    showOutline: boolean = false;
    showHintAfterMisses: number = 0;

    constructor(private router: Router) { }

    ngOnInit(): void { }

    navigateToHome() {
      this.router.navigate(['/home']);
    }

    startGame() {
      this.isGameStarted = true;
      this.setProperGameValues();
      this.createCharacters();
      this.startTimer();
      this.startQuiz();
    }

    createCharacters() {
      // Create the characters using thrid party API HanziWriter
      if (this.showHintAfterMisses === 0) {
        this.player1Writer = HanziWriter.create('player1-writer', this.character, {
          width: 500,
          height: 500,
          padding: 5,
          showCharacter: false,
          showOutline: this.showOutline,
          showHintAfterMisses: false,
          highlightOnComplete: false,
          leniency: this.difficulty,
        });
        this.player2Writer = HanziWriter.create('player2-writer', this.character, {
          width: 500,
          height: 500,
          padding: 5,
          showCharacter: false,
          showOutline: this.showOutline,
          showHintAfterMisses: false,
          highlightOnComplete: false,
          leniency: this.difficulty,
        });
      } else {
        this.player1Writer = HanziWriter.create('player1-writer', this.character, {
          width: 500,
          height: 500,
          padding: 5,
          showCharacter: false,
          showOutline: this.showOutline,
          showHintAfterMisses: this.showHintAfterMisses,
          highlightOnComplete: false,
          leniency: this.difficulty,
        });
        this.player2Writer = HanziWriter.create('player2-writer', this.character, {
          width: 500,
          height: 500,
          padding: 5,
          showCharacter: false,
          showOutline: this.showOutline,
          showHintAfterMisses: Number(this.showHintAfterMisses),
          highlightOnComplete: false,
          leniency: Number(this.difficulty),
        });
      }
    }

    startTimer() {
      var timerInterval = setInterval( () => {
        this.timer--;
        if (this.timer <= 0) {
          clearInterval(timerInterval);
        }
      }, 1000);
    }

    startQuiz() {
      this.player1Writer.quiz({});
      this.player2Writer.quiz({});
    }

    setProperGameValues() {
      this.showHintAfterMisses = Number(this.showHintAfterMisses);
      this.difficulty = Number(this.difficulty);
      this.timer = Number(this.timer);
      if (String(this.showOutline) === 'true') {
        this.showOutline = true;
      } else {
        this.showOutline = false;
      }
    }
}