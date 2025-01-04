import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-game-over-modal',
  imports: [CommonModule],
  templateUrl: './game-over-modal.component.html',
  styleUrl: './game-over-modal.component.css',
  standalone: true,
})
export class GameOverModalComponent {
  @Input() isWin = false;
  @Input() word = '';
  @Output() playAgain = new EventEmitter<void>();

  onPlayAgain() {
    this.playAgain.emit();
  }
}
