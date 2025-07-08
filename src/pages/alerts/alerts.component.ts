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

  isModalOpen = false;
  modalStep: 'create' | 'configure' = 'create'; // Track current step
  alertDescription = '';

  // Modal control methods
  openModal() {
    this.isModalOpen = true;
    this.modalStep = 'create'; // Always start with create step
  }

  closeModal() {
    this.isModalOpen = false;
    this.modalStep = 'create'; // Reset to first step
    this.alertDescription = ''; // Clear form data
  }

  // Step navigation methods
  goToConfigureStep() {
    console.log('Generate clicked, description:', this.alertDescription); // Debug log
    console.log('Current modal step:', this.modalStep); // Debug log

    // Remove the trim check temporarily for testing
    this.modalStep = 'configure';
    console.log('Modal step changed to:', this.modalStep); // Debug log
  }
  goBackToCreateStep() {
    console.log('Back button clicked'); // Debug log
    this.modalStep = 'create';
  }

  // Form submission
  activateAlert() {
    // Handle alert activation logic here
    console.log('Alert activated:', this.alertDescription);
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
