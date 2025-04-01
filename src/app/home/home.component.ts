import { Component } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-home',
  imports: [SharedModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  showAlert: boolean = false;

  toggleAlert() {
    this.showAlert = !this.showAlert;
  }
}
