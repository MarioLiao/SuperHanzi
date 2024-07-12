import {
  Component,
  ChangeDetectorRef,
  OnInit,
  OnDestroy,
  HostListener,
} from '@angular/core';
import {  FormsModule } from '@angular/forms';
import { WebsocketService } from '../websocket/websocket.service';
import { CommonModule, PlatformLocation } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import HanziWriter from "hanzi-writer"

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})

export class GameComponent implements OnInit, OnDestroy{
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

    // Values for the game
    timer: number = 30;
    difficulty: number = 1;
    showOutline: boolean = false;
    showHintAfterMisses: number = 0;

    private opponentProgress: number = -1;

    constructor(
      private socket: WebsocketService,
      private cdr: ChangeDetectorRef,
      private router: Router,
      private route: ActivatedRoute,
    ) {}

    ngOnInit() {
      //setup socket event listeners

      this.route.paramMap.subscribe((params) => {
        this.userInfo = params.get('userInfo');
        this.userInfo = JSON.parse(this.userInfo);
      });
      
      // triggered when user 2 joins the room
      this.socket.onMatchFound((data) => {
        this.showOpponent = true;
        this.cdr.detectChanges();
        this.gameRoom = data.roomId;

        setTimeout(() => {
          this.showOpponent = false;
          this.matchFound = true;
          this.cdr.detectChanges();
        }, 3000);

      });
  
      // triggered when user 2 leaves the room
      this.socket.onDestroyRoom((data) => {
        this.gameRoom = null;
        this.opponentQuit = true;
        this.matchFound = false;
        this.cdr.detectChanges();
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 2000);
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
        if(data.userId !== this.userInfo.id) {
          if(data.signal === "complete character") {
            //handle when opponent completes the character
          } else {
            this.opponentProgress = data.signal;
            this.cdr.detectChanges();
            this.createOpponentCharacter();
          }
        }
      });
    }

    ngOnDestroy() {
      this.socket.leaveRoom({ roomId: this.gameRoom });
    }
  
  
    navigateToHome() {
      this.router.navigate(['/home']);
    }

    startGame() {
      this.isGameStarted = true;
      this.setProperGameValues();
      this.createCharacters();
      this.createOpponentCharacter();
      this.startTimer();
      this.startQuiz();
    }

    createCharacters() {
      // Create the characters using thrid party API HanziWriter
      if (this.showHintAfterMisses === 0) {
        // this.player1Writer = HanziWriter.create('player1-writer', this.character, {
        //   width: 500,
        //   height: 500,
        //   padding: 5,
        //   showCharacter: false,
        //   showOutline: this.showOutline,
        //   showHintAfterMisses: false,
        //   highlightOnComplete: false,
        //   leniency: this.difficulty,
        // });
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
        // this.player1Writer = HanziWriter.create('player1-writer', this.character, {
        //   width: 500,
        //   height: 500,
        //   padding: 5,
        //   showCharacter: false,
        //   showOutline: this.showOutline,
        //   showHintAfterMisses: this.showHintAfterMisses,
        //   highlightOnComplete: false,
        //   leniency: this.difficulty,
        // });
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

      this.player2Writer.quiz({
        onComplete: (summaryData) => {
          //send signal to room that player 2 has completed the quiz
         this.socket.sendSignal({ roomId: this.gameRoom, signal:"complete character", user: this.userInfo.id});
        },
        onCorrectStroke: (data) => {
          //send signal to room that player 2 has completed a stroke
          this.socket.sendSignal({ roomId: this.gameRoom, signal: data.strokeNum, user: this.userInfo.id });
        },
        
      });



    }

    createOpponentCharacter() {
      HanziWriter.loadCharacterData(this.character).then((charData: any) => {
        let target = document.getElementById('player1-writer');
        let order = this.opponentProgress + 1;
        let strokesPortion = charData.strokes.slice(0, order);
        this.renderFanningStrokes(target, strokesPortion);
        
      });
    }

    renderFanningStrokes(target: any, strokes: any) {
      let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.style.width = '450';
      svg.style.height = '450';
      svg.style.marginRight = '3px'
      while (target.firstChild) {
        target.removeChild(target.firstChild);
      }
      target.appendChild(svg);
      let group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
      // set the transform property on the g element so the character renders at 75x75
      let transformData = HanziWriter.getScalingTransform(450, 450);
      group.setAttributeNS(null, 'transform', transformData.transform);
      svg.appendChild(group);
    
      strokes.forEach(function(strokePath: any) {
        let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttributeNS(null, 'd', strokePath);
        // style the character paths
        path.style.fill = '#555';
        group.appendChild(path);
      });
    }



    startTimer() {
      let timerInterval = setInterval( () => {
        this.timer--;
        if (this.timer <= 0) {
          clearInterval(timerInterval);
        }
      }, 1000);
    }

    startQuiz() {
      //this.player1Writer.quiz({});
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