// integration.component.ts
import { Component } from '@angular/core';
import { ModalComponent } from '../../app/shared/modal/modal.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IntegrationService } from '../../app/core/services/integration.service';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../app/core/services/data.service';

@Component({
  selector: 'app-integration',
  imports: [ModalComponent, CommonModule, RouterModule, FormsModule],
  templateUrl: './integration.component.html',
  styleUrl: './integration.component.scss',
})
export class IntegrationComponent {
  selectedModalContent = '';
  isModalOpen = false;
  showApiKeyfield = false;
  isToolinfoOpen: boolean = false;
  isLoading = false;
  shouldOpenModal = false;

  selectedHrTool: string = 'seamless';
  selectedComTools: string = 'slack';
  selectedProjTools: string = 'jira';

  jiraApiKey = '';
  jiraApiEmail = '';

  constructor(
    private integrationService: IntegrationService,
    private dataService: DataService
  ) {}

  openModal(content: string) {
    this.resetModalState();
    this.selectedModalContent = content;
    this.isLoading = true;
    this.shouldOpenModal = true;

    setTimeout(() => {
      if (this.shouldOpenModal) {
        this.isLoading = false;
        this.isModalOpen = true;
      }
    }, 3000);
  }

  closeModal() {
    this.isLoading = false;
    this.isModalOpen = false;
    this.shouldOpenModal = false;
  }

  resetModalState() {
    this.selectedHrTool = 'seamless';
    this.selectedComTools = 'slack';
    this.selectedProjTools = 'jira';
    this.showApiKeyfield = false;
    this.isToolinfoOpen = false;
    this.jiraApiKey = '';
    this.jiraApiEmail = '';
  }

  toggleToolhr(tool: string) {
    this.selectedHrTool = tool;
  }

  toggleTool(tool: string) {
    this.selectedComTools = tool;
  }

  toggleToolproj(tool: string) {
    this.selectedProjTools = tool;
  }

  toggleApiKeyField(event: Event) {
    this.showApiKeyfield = (event.target as HTMLInputElement).checked;
  }

  openPermission(tool: string) {
    this.isToolinfoOpen = true;
    this.selectedModalContent = tool; // Ensure the correct modal content is active
  }

  connectJiraApiKey() {
    if (this.jiraApiKey && this.jiraApiEmail) {
      const token = this.dataService.getAuthToken();

      if (token) {
        this.integrationService
          .connectJiraWithApiKey(this.jiraApiKey, this.jiraApiEmail, token)
          .subscribe({
            next: (response) => {
              console.log('Jira API Key connected successfully', response);
              this.closeModal();
              // Handle success (e.g., show a notification)
            },
            error: (error) => {
              console.error('Error connecting Jira with API Key', error);
              // Handle error (e.g., show an error message)
            },
          });
      } else {
        // Handle case where API key or email is missing
        console.warn('Please provide both API Key and Email');
      }
    }
  }

  connectJiraOAuth() {
    this.integrationService.initiateJiraOAuth();
  }

  allowPermission() {
    if (
      this.selectedModalContent === 'project' &&
      this.selectedProjTools === 'jira'
    ) {
      this.connectJiraOAuth();
    } else {
      this.closeModal(); // For other tools, just close the modal for now
    }
  }
}
