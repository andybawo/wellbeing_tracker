import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../app/shared/shared.module';

@Component({
  selector: 'app-home',
  imports: [SharedModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  showAlert: boolean = false;

  toggleAlert() {
    this.showAlert = !this.showAlert;
  }
}
