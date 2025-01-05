import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-how-to-play',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './how-to-play.component.html',
  styleUrl: './how-to-play.component.css',
})
export class HowToPlayComponent {
  @Output() close = new EventEmitter<void>();
}
