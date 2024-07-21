import {
  Component,
  ChangeDetectorRef,
  OnInit,
  OnDestroy,
  HostListener,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WebsocketService } from '../websocket/websocket.service';
import { CommonModule, PlatformLocation } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import HanziWriter from 'hanzi-writer';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent implements OnInit, OnDestroy {
  player1Writer!: HanziWriter;
  player2Writer!: HanziWriter;
  character: string = '我';

  private gameRoom: any;
  private userInfo: any;

  public matchFound: boolean = false;
  public showOpponent: boolean = false;
  public opponentQuit: boolean = false;

  // Default values for game page
  isGameStarted: boolean = false;
  gameResultsHidden: boolean = true;

  // Values for the game
  timer: number = 30;
  difficulty: number = 1;
  showOutline: boolean = false;
  showHintAfterMisses: number = 0;

  // Scoring for the game
  player1Score: number = 0;
  player1StrokesFinished: number = 0;
  player1MistakesMade: number = 0;
  player1TimeFinished: number = 0;
  player2Result: string = '';
  player2Score: number = 0;
  player2StrokesFinished: number = 0;
  player2MistakesMade: number = 0;
  player2TimeFinished: number = 0;

  private opponentProgress: number = -1;

  constructor(
    private socket: WebsocketService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    const navData = window.history.state;
    this.userInfo = navData.userInfo;

    //setup socket event listeners
    this.socket.openSocket();

    // triggered when user 2 joins the room
    this.socket.onMatchFound((data) => {
      this.showOpponent = true;
      this.cdr.detectChanges();
      this.gameRoom = data.roomId;

      //To show brief message that opponent has been found
      setTimeout(() => {
        this.showOpponent = false;
        this.matchFound = true;
        this.cdr.detectChanges();
      }, 2000);
    });

    // triggered when user 2 leaves the room
    this.socket.onDestroyRoom((data) => {
      this.gameRoom = null;
      this.opponentQuit = true;
      this.matchFound = false;
      this.cdr.detectChanges();
      setTimeout(() => {
        this.router.navigate(['/home']);
      }, 1000);
    });

    // emit signal to create room
    this.socket.findMatch({ userId: this.userInfo.id });
    console.log('finding match');

    // triggered when you join a room
    this.socket.onJoinedRoom((data) => {
      this.gameRoom = data.roomId;
      console.log('joined room: ', data.roomId);
    });

    this.socket.onSignal((data) => {
      if (data.userId !== this.userInfo.id) {
        if (data.signal === 'complete character') {
          //handle when opponent completes the character
          this.player1TimeFinished = this.timer;
        } else if (data.signal === 'character mistake') {
          //handle when opponent misses a character
          this.player1MistakesMade++;
        } else {
          this.opponentProgress = data.signal;
          this.cdr.detectChanges();
          this.createOpponentCharacter();
        }
      }
    });

    this.socket.onStartGame((data) => {
      if (data.userId !== this.userInfo.id) {
        this.setOptions(data);
        this.startGame(false);
      }
    });
  }

  ngOnDestroy() {
    this.socket.leaveRoom({ roomId: this.gameRoom });
    this.socket.closeSocket();
  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }

  startGame(shooter: boolean = true) {
    if (!this.isGameStarted) {
      this.isGameStarted = true;
      this.setProperGameValues();
      this.createCharacters();
      //this.createOpponentCharacter();
      if (shooter) {
        this.socket.startGame({
          roomId: this.gameRoom,
          userId: this.userInfo.id,
          timer: this.timer,
          difficulty: this.difficulty,
          showOutline: this.showOutline,
          showHintAfterMisses: this.showHintAfterMisses,
        });
      }
      this.startTimer();
      this.startQuiz();
    }
  }

  createCharacters() {
    // Create the characters using thrid party API HanziWriter
    if (this.showHintAfterMisses === 0) {
      this.player2Writer = HanziWriter.create(
        'player2-writer',
        this.character,
        {
          width: 500,
          height: 500,
          padding: 5,
          showCharacter: false,
          showOutline: this.showOutline,
          showHintAfterMisses: false,
          highlightOnComplete: false,
          leniency: this.difficulty,
        },
      );
    } else {
      this.player2Writer = HanziWriter.create(
        'player2-writer',
        this.character,
        {
          width: 500,
          height: 500,
          padding: 5,
          showCharacter: false,
          showOutline: this.showOutline,
          showHintAfterMisses: Number(this.showHintAfterMisses),
          highlightOnComplete: false,
          leniency: Number(this.difficulty),
        },
      );
    }
  }

  createOpponentCharacter() {
    HanziWriter.loadCharacterData(this.character).then((charData: any) => {
      let target = document.getElementById('player1-writer');
      let order = this.opponentProgress + 1;
      let strokesPortion = charData.strokes.slice(0, order);
      this.renderFanningStrokes(target, strokesPortion);
      this.player1StrokesFinished++;
    });
  }

  renderFanningStrokes(target: any, strokes: any) {
    let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.width = '500';
    svg.style.height = '500';
    svg.style.marginRight = '3px';
    while (target.firstChild) {
      target.removeChild(target.firstChild);
    }
    target.appendChild(svg);
    let group = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    // set the transform property on the g element so the character renders at 75x75
    let transformData = HanziWriter.getScalingTransform(500, 500);
    group.setAttributeNS(null, 'transform', transformData.transform);
    svg.appendChild(group);

    strokes.forEach(function (strokePath: any) {
      let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttributeNS(null, 'd', strokePath);
      // style the character paths
      path.style.fill = '#808080';
      group.appendChild(path);
    });
  }

  startTimer() {
    let timerInterval = setInterval(() => {
      this.timer--;
      if (
        this.timer <= 0 ||
        (this.player1TimeFinished > 0 && this.player2TimeFinished > 0)
      ) {
        clearInterval(timerInterval);
        this.declareWinner();
      }
    }, 1000);
  }

  startQuiz() {
    this.player2Writer.quiz({
      onMistake: () => {
        this.player2MistakesMade++;
        //send signal to room that player 2 has completed a stroke
        this.socket.sendSignal({
          roomId: this.gameRoom,
          signal: 'character mistake',
          user: this.userInfo.id,
        });
      },
      onCorrectStroke: (strokeData) => {
        this.player2StrokesFinished++;
        //send signal to room that player 2 has completed a stroke
        this.socket.sendSignal({
          roomId: this.gameRoom,
          signal: strokeData.strokeNum,
          user: this.userInfo.id,
        });
      },
      onComplete: () => {
        this.player2TimeFinished = this.timer;
        //send signal to room that player 2 has completed the quiz
        this.socket.sendSignal({
          roomId: this.gameRoom,
          signal: 'complete character',
          user: this.userInfo.id,
        });
      },
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

  setOptions(data: any) {
    this.timer = data.timer;
    this.showOutline = data.showOutline;
    this.showHintAfterMisses = data.showHintAfterMisses;
    this.difficulty = data.difficulty;
  }

  declareWinner() {
    this.gameResultsHidden = false;
    this.player1Score =
      this.player1StrokesFinished * 50 +
      this.player1TimeFinished * 10 -
      this.player1MistakesMade * 20;
    this.player2Score =
      this.player2StrokesFinished * 50 +
      this.player2TimeFinished * 10 -
      this.player2MistakesMade * 20;
    if (this.player1Score === this.player2Score) {
      this.player2Result = 'Tie';
    } else if (this.player1Score > this.player2Score) {
      this.player2Result = 'Defeat';
    } else {
      this.player2Result = 'Victory';
    }
  }
}
