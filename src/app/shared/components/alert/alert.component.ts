import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alert',
  imports: [CommonModule],
  standalone: true,
  template: ` <div *ngIf="visible" [ngClass]="type" class="alert">
    {{ message }}
  </div>`,
  styles: [
    `
      .success {
        background: #d4edda;
        color: black;
        padding: 10px;
        width: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: auto;
      }

      .error {
        background: #f8d7da;
        color: black;
        padding: 10px;
        width: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: auto;
      }
    `,
  ],
})
export class AlertComponent {
  @Input() message = '';
  @Input() type: 'success' | 'error' = 'success';
  @Input() visible: boolean = false;
}
