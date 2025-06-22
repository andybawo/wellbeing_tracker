import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-alerts',
  imports: [CommonModule],
  templateUrl: './alerts.component.html',
  styleUrl: './alerts.component.scss',
})
export class AlertsComponent {
  fullViewSection: string | null = null;

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
