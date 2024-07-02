import { Component } from '@angular/core';
import { WriterComponent } from '../writer/writer.component';

@Component({
  selector: 'app-practice',
  standalone: true,
  imports: [WriterComponent],
  templateUrl: './practice.component.html',
  styleUrl: './practice.component.scss'
})
export class PracticeComponent {

  constructor() {}

  ngOnInit(): void {
  }
}
