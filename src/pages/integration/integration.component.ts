import { Component } from '@angular/core';
import { ModalComponent } from '../../app/shared/modal/modal.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-integration',
  imports: [ModalComponent, CommonModule, RouterModule],
  templateUrl: './integration.component.html',
  styleUrl: './integration.component.scss',
})
export class IntegrationComponent {
  selectedModalContent = '';
  isModalOpen = false;
  showApiKeyfield = false;
  isToolinfoOpen: boolean = false;

  openModal(content: string) {
    this.resetModalState();
    this.selectedModalContent = content;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  resetModalState() {
    this.selectedHrTool = 'seamless';
    this.selectedComTools = 'slack';
    this.selectedProjTools = 'jira';
    this.showApiKeyfield = false;
    this.isToolinfoOpen = false;
  }

  selectedHrTool: string = 'seamless';
  toggleToolhr(tool: string) {
    this.selectedHrTool = tool;
  }

  selectedComTools: string = 'slack';
  toggleTool(tool: string) {
    this.selectedComTools = tool;
  }

  selectedProjTools: string = 'jira';
  toggleToolproj(tool: string) {
    this.selectedProjTools = tool;
  }

  toggleApiKeyField(event: Event) {
    this.showApiKeyfield = (event.target as HTMLInputElement).checked;
  }

  openPermission(value: string) {
    this.isToolinfoOpen = true;
  }

  allowPermission() {}
}
