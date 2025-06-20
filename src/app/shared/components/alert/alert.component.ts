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
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: auto;
        margin-top: auto;
        position: fixed; /* Make it a fixed overlay */
        top: 0; /* Position it at the top of the viewport */
        left: 0; /* Position it at the left of the viewport */
        z-index: 1001; /* Ensure it's above other content (adjust as needed) */
      }

      .error {
        background: #f8d7da;
        color: black;
        padding: 10px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: auto;
        position: fixed; /* Make it a fixed overlay */
        top: 0; /* Position it at the top of the viewport */
        left: 0; /* Position it at the left of the viewport */
        z-index: 1001; /* Ensure it's above other content (adjust as needed) */
      }
    `,
  ],
})
export class AlertComponent {
  @Input() message = '';
  @Input() type: 'success' | 'error' = 'success';
  @Input() visible: boolean = false;
}
