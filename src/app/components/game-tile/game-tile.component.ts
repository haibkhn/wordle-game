import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game-tile',
  imports: [CommonModule],
  templateUrl: './game-tile.component.html',
  styleUrl: './game-tile.component.css',
  standalone: true,
})
export class GameTileComponent {
  @Input() letter: string = '';
  @Input() isFlipped: boolean = false;
  @Input() shouldShake: boolean = false;
  @Input() backgroundColor: string = 'transparent';
  @Input() shouldPop: boolean = false;
}
