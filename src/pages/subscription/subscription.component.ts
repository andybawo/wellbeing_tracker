import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ModalComponent } from '../../app/shared/modal/modal.component';

@Component({
  selector: 'app-subscription',
  imports: [CommonModule, ModalComponent],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.scss',
})
export class SubscriptionComponent {
  isClicked = false;

  isYearClicked = false;

  isModalOpen = false;

  openYear() {
    this.isYearClicked = true;
  }

  closeYear() {
    this.isYearClicked = false;
  }

  selectedPackage: string | null = null;

  selectPlan(packageName: string) {
    this.selectedPackage = packageName;
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
