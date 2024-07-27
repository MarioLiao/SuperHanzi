import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import HanziWriter from 'hanzi-writer';

import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { SelectionService } from '../services/selection-service/selection.service';

@Component({
  selector: 'app-writer',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './writer.component.html',
  styleUrl: './writer.component.scss',
})
export class WriterComponent {
  writer!: HanziWriter;
  character: any;
  hanzi: string = '';
  pinyin: string = '';
  english: string = '';
  currentStroke: number = 0;
  public viewWidth: number = window.innerWidth;
  public viewHeight: number = window.innerHeight;
  public color: string = 'rgb(253, 253, 253, 0.8)';

  @Input() showOutline!: boolean;
  @Input() strokeHintHidden: boolean = true;
  @Input() hideCharacter!: boolean;

  // Default values for learning page
  @Input() learning: boolean = false;
  @Input() learnButtonHidden: boolean = true;
  @Input() learnDemonstrationHidden: boolean = true;
  @Input() learnQuizWithOutlineHidden: boolean = true;
  @Input() learnQuizWithoutOutlineHidden: boolean = true;
  @Input() learnInstructions: string = 'Click on learn to get started';

  // Default values for practice page
  @Input() practice: boolean = false;
  @Input() difficulty: string = 'easy';
  @Input() practiceButtonHidden: boolean = true;
  @Input() practiceAgainButtonHidden: boolean = true;
  @Input() difficultyButtonHidden: boolean = true;
  @Input() practiceInstructions: string = 'Click on practice to get started';
  @Input() feedbackCurrentStroke: string = '';
  @Input() feedbackStrokeMistakes: string = '';
  @Input() feedbackStrokesRemaining: string = '';
  @Input() feedbackTotalMistakes: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private selectionService: SelectionService,
  ) {}

  ngOnInit(): void {
    this.character = this.selectionService.getCharacter();
    this.hanzi = this.character.character;
    this.pinyin = this.character.pinyin;
    this.english = this.character.english;
  }

  createCharacter(leniency: number) {
    // Create the character using thrid party API HanziWriter
    this.writer = HanziWriter.create('character-writer', this.hanzi, {
      width: this.viewWidth * 0.5 * 0.8,
      height: this.viewHeight * 0.87 * 0.85,
      padding: 5,
      showCharacter: false,
      showOutline: this.showOutline,
      showHintAfterMisses: false,
      highlightOnComplete: false,
      leniency: leniency,
      strokeAnimationSpeed: 2,
    });
  }

  navigateToCharacterSelection() {
    // this.router.navigate(['/character-selection/learning']);
    if (this.router.url === '/learning') {
      this.router.navigate(['/character-selection/learning']);
    } else {
      this.router.navigate(['/character-selection/practice']);
    }
  }

  learnCharacter() {
    this.createCharacter(1.0);
    this.learnButtonHidden = true;
    this.learnDemonstrationHidden = false;
    this.learnInstructions =
      'Click to see a demonstration for the character. Make sure to pay attention to where the stroke starts, where it is going, and the stroke order.';
  }

  demonstrateCharacter() {
    // Show an animation of writing the character's stroke
    this.learnDemonstrationHidden = true;
    this.writer.animateCharacter({
      onComplete: () => {
        this.learnQuizWithOutlineHidden = false;
        this.learnInstructions =
          'Try writing the character yourself now, with the help of outlines.';
      },
    });
  }

  quizWithOutline() {
    // Quiz the user on how to write the character with outline help
    this.learnQuizWithOutlineHidden = true;
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
            this.learnQuizWithoutOutlineHidden = false;
            this.learnInstructions =
              'Now, lets try to do write it without outlines. There will be hints you can use if you get stuck.';
          },
        });
      },
    });
  }

  quizWithoutOutline() {
    // Quiz the user on how to write the character without outline help
    this.learnQuizWithoutOutlineHidden = true;
    this.writer.hideOutline();
    this.writer.quiz({
      onMistake: (strokeData) => {
        if (strokeData.mistakesOnStroke >= 3) {
          this.strokeHintHidden = false;
          this.currentStroke = strokeData.strokeNum;
        }
      },
      onCorrectStroke: () => {
        this.strokeHintHidden = true;
      },
      onComplete: (summaryData) => {
        this.learnInstructions = `Congratulations, you have just learned how to write the character ${summaryData.character}. To solidy your knowledge, practice it from our practice menu.`;
        this.writer.showOutline();
      },
    });
  }

  practiceCharacter() {
    // Practice version for quizing
    this.practiceButtonHidden = true;
    this.difficultyButtonHidden = true;
    this.color = 'transparent';
    // Get the difficulty value and then create character with it
    this.createCharacter(this.getLeniency());
    this.practiceQuiz();
  }

  practiceCharacterAgain() {
    // For if the user were to practice more than once
    this.practiceAgainButtonHidden = true;
    this.practiceQuiz();
  }

  practiceQuiz() {
    this.practiceInstructions = 'Practice Statistics:';
    this.feedbackCurrentStroke = '1';
    this.feedbackStrokeMistakes = '0';
    HanziWriter.loadCharacterData(this.hanzi).then((charData: any) => {
      this.feedbackStrokesRemaining = `${charData.strokes.length}`;
    });
    this.feedbackTotalMistakes = '0';
    this.writer.quiz({
      onMistake: (strokeData) => {
        if (strokeData.mistakesOnStroke >= 3) {
          this.strokeHintHidden = false;
          this.currentStroke = strokeData.strokeNum;
        }
        this.feedbackStrokeMistakes = `${strokeData.mistakesOnStroke}`;
        this.feedbackTotalMistakes = `${strokeData.totalMistakes}`;
      },
      onCorrectStroke: (strokeData) => {
        this.strokeHintHidden = true;
        if (strokeData.strokesRemaining > 0) {
          this.feedbackCurrentStroke = `${strokeData.strokeNum + 2}`;
        }
        this.feedbackStrokesRemaining = `${strokeData.strokesRemaining}`;
        this.feedbackStrokeMistakes = `0`;
      },
      onComplete: () => {
        this.feedbackCurrentStroke = `Finished`;
        this.practiceAgainButtonHidden = false;
      },
    });
  }

  getLeniency(): number {
    let leniency = 1.0;
    switch (this.difficulty) {
      case 'easy':
        leniency = 1.5;
        break;
      case 'medium':
        leniency = 1.0;
        break;
      case 'hard':
        leniency = 0.8;
        break;
    }
    return leniency;
  }

  showStrokeHint() {
    this.writer.highlightStroke(this.currentStroke);
  }

  showOutlineToggle() {
    //function to show the outline of the character in the whiteboard
    this.showOutline = !this.showOutline;
    if (this.writer) {
      if (this.showOutline) {
        this.writer.showOutline();
      } else {
        this.writer.hideOutline();
      }
    }
  }

  hideCharacterToggle() {
    //function to hide the character in the character section (only display romanized word)
    this.hideCharacter = !this.hideCharacter;
  }
}
