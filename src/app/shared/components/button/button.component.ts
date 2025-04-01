import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [CommonModule],

  standalone: true,
  template: `<button [ngClass]="btnClass"><ng-content></ng-content></button>`,
  styles: [
    `
      .primary {
        background: #5c3c92;
        color: white;
        padding: 10px;
        border-radius: 5px;
        border: none;
        width: 100px;
      }
      .primary:hover {
        background: #3b4d61;
        cursor: pointer;
      }
      .secondary {
        background: #077b8a;
        color: white;
        padding: 10px;
        border-radius: 5px;
        border: none;
        width: 100px;
      }

      .secondary:hover {
        background: #a2d5c6;
        cursor: pointer;
      }
    `,
  ],
})
export class ButtonComponent {
  @Input() btnClass = 'primary';
}
