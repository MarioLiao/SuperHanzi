import { Component } from '@angular/core';
import { WriterComponent } from '../writer/writer.component';

@Component({
  selector: 'app-learning',
  standalone: true,
  imports: [WriterComponent],
  templateUrl: './learning.component.html',
  styleUrl: './learning.component.scss'
})
export class LearningComponent {

  constructor() {}

  ngOnInit(): void {
  }
}
