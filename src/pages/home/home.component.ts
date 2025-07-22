import { Component } from '@angular/core';

import { SharedModule } from '../../app/shared/shared.module';

@Component({
  selector: 'app-home',
  imports: [SharedModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  showAlert: boolean = false;

  toggleAlert() {
    this.showAlert = !this.showAlert;
  }
}
