import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-alerts',
  imports: [CommonModule, FormsModule],
  templateUrl: './alerts.component.html',
  styleUrl: './alerts.component.scss',
})
export class AlertsComponent {
  fullViewSection: string | null = null;
  viewAlertBox = false;

  isModalOpen = false;
  isConfigureModalOpen = false;
  modalStep: 'create' | 'configure' = 'create'; // Track current step
  alertDescription = '';

  openAlertBox() {
    this.viewAlertBox = true;
  }

  closeAlertBox() {
    this.viewAlertBox = false;
  }

  openConfigureModal() {
    this.isConfigureModalOpen = true;
  }

  openModal() {
    this.isModalOpen = true;
    this.modalStep = 'create';
  }

  closeModal() {
    this.isModalOpen = false;
    this.modalStep = 'create';
    this.alertDescription = '';
    this.isConfigureModalOpen = false;
  }

  goToConfigureStep() {
    this.modalStep = 'configure';
  }
  goBackToCreateStep() {
    this.modalStep = 'create';
  }

  activateAlert() {
    this.closeModal();
  }

  showFullView(section: string) {
    this.fullViewSection = section;
  }

  goBackToNormalView() {
    this.fullViewSection = null;
  }

  isInFullView(): boolean {
    return this.fullViewSection !== null;
  }

  isSectionInFullView(section: string): boolean {
    return this.fullViewSection === section;
  }
}
