import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-virtual-keyboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './virtual-keyboard.component.html',
  styleUrls: ['./virtual-keyboard.component.css'],
})
export class VirtualKeyboardComponent {
  @Input() keyboard: string[][] = [];
  @Input() keyboardStates: { [key: string]: string } = {};
  @Output() keyPress = new EventEmitter<string>();

  onKeyClick(key: string) {
    this.keyPress.emit(key);
  }
}
