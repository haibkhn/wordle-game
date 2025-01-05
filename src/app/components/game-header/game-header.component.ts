import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HowToPlayComponent } from '../how-to-play/how-to-play.component';

@Component({
  selector: 'app-game-header',
  standalone: true,
  imports: [CommonModule, RouterLink, HowToPlayComponent],
  templateUrl: './game-header.component.html',
  styleUrl: './game-header.component.css',
})
export class GameHeaderComponent {
  isMenuOpen = false;

  showingHowToPlay = false;

  showHowToPlay() {
    this.showingHowToPlay = true;
    this.closeMenu();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}
