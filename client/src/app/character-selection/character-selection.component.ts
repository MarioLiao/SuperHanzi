import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from '../services/env/env.service';
import { Character } from '../../classes/character';

@Component({
  selector: 'app-character-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './character-selection.component.html',
  styleUrl: './character-selection.component.scss'
})
export class CharacterSelectionComponent {

  characters: Character[] = [];
  page: number = 0;
  limit: number = 28;
  totalPages: number = 0;

  private envService = inject(EnvironmentService);
  apiUrl = this.envService.get('API_URL');

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<{ length: number }>(`${this.apiUrl}/totalCharacters`, {}).subscribe((res) => {
      this.totalPages = Math.ceil(res.length / this.limit);
    });
    this.getCharacters();
  }

  getCharacters() {
    this.http.get<{ characters: Character[] }>(`${this.apiUrl}/characters/?page=${this.page}&limit=${this.limit}`, {}).subscribe((res) => {
      this.characters = res.characters;
    });
  }

  nextPage() {
    this.page++;
    this.getCharacters();
  }

  prevPage() {
    this.page--;
    this.getCharacters();
  }

}
