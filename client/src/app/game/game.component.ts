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
    characterStrokes: number = 7;

    // Default values for game page
    isGameStarted: boolean = false;
    gameResultsHidden: boolean = true;

    // Values for the game
    timer: number = 30;
    difficulty: number = 1;
    showOutline: boolean = false;
    showHintAfterMisses: number = 0;

    // Scoring for the game
    player1Result: string = '';
    player1Score: number = 0;
    player1StrokesFinished: number = 0;
    player1MistakesMade: number = 0;
    player1TimeFinished: number = 0;
    player2Result: string = '';
    player2Score: number = 0;
    player2StrokesFinished: number = 0;
    player2MistakesMade: number = 0;
    player2TimeFinished: number = 0;

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
        if (this.timer <= 0 || (this.player1TimeFinished > 0 && this.player2TimeFinished > 0)) {
          clearInterval(timerInterval);
          this.declareWinner();
        }
      }, 1000);
    }

    startQuiz() {
      this.player1Writer.quiz({
        onMistake: () => {
          this.player1MistakesMade++;
        },
        onCorrectStroke: () => {
          this.player1StrokesFinished++;
        },
        onComplete: () => {
          this.player1TimeFinished = this.timer;
        }
      });
      this.player2Writer.quiz({
        onMistake: () => {
          this.player2MistakesMade++;
        },
        onCorrectStroke: () => {
          this.player2StrokesFinished++;
        },
        onComplete: () => {
          this.player2TimeFinished = this.timer;
        }
      });
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

    declareWinner() {
      this.gameResultsHidden = false;
      this.player1Score = (this.player1StrokesFinished * 50) + (this.player1TimeFinished * 10) - (this.player1MistakesMade * 20);
      this.player2Score = (this.player2StrokesFinished * 50) + (this.player2TimeFinished * 10) - (this.player2MistakesMade * 20);
      if (this.player1StrokesFinished === this.characterStrokes && this.player2StrokesFinished < this.characterStrokes) {
        this.player1Result = 'Victory'
        this.player2Result = 'Defeat'
      } else if (this.player2StrokesFinished === this.characterStrokes && this.player1StrokesFinished < this.characterStrokes) {
        this.player1Result = 'Defeat'
        this.player2Result = 'Victory'
      }
      else {
        if (this.player1Score  === this.player2Score) {
          this.player1Result = 'Tie'
          this.player2Result = 'Tie'
        } else if (this.player1Score  > this.player2Score) {
          this.player1Result = 'Victory'
          this.player2Result = 'Defeat'
        } else {
          this.player1Result = 'Defeat'
          this.player2Result = 'Victory'
        }
      }
    }
}