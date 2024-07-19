import { NgModule } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectionService } from '../services/selection-service/selection.service';

import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from '../services/env/env.service';
import { Character } from '../../classes/character';

@Component({
  selector: 'app-character-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './character-selection.component.html',
  styleUrl: './character-selection.component.scss',
})
export class CharacterSelectionComponent {
  characters: any = [];
  page: number = 0;
  limit: number = 32;
  totalPages: number = 0;
  destination: any = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private selectionService: SelectionService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    //logic to decide where to redirect
    this.destination = this.route.snapshot.paramMap.get('destination');

    //find number of total pages
    this.http
      .get<{ length: number }>(`${this.apiUrl}/totalCharacters`, {})
      .subscribe((res) => {
        this.totalPages = Math.ceil(res.length / this.limit);
      });
    this.getCharacters();
  }

  redirectFromSelection(selectedCharacter: any) {
    //redirect to learning or practice page
    this.selectionService.setCharacter(selectedCharacter);
    this.router.navigate([`/${this.destination}`]);
  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }

  private envService = inject(EnvironmentService);
  apiUrl = this.envService.get('API_URL');

  getCharacters() {
    this.http
      .get<{
        characters: Character[];
      }>(`${this.apiUrl}/characters/?page=${this.page}&limit=${this.limit}`, {})
      .subscribe((res) => {
        this.characters = res.characters;
        console.log(this.characters);
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
