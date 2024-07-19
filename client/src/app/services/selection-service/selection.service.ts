import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SelectionService {
  private currentCharacter: any;

  constructor() {}

  setCharacter(currentCharacter: any) {
    this.currentCharacter = currentCharacter;
  }

  getCharacter() {
    return this.currentCharacter;
  }
}
