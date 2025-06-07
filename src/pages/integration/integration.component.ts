// integration.component.ts
import { Component } from '@angular/core';
import { ModalComponent } from '../../app/shared/modal/modal.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IntegrationService } from '../../app/core/services/integration.service';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../app/core/services/data.service';
import { SharedModule } from '../../app/shared/shared.module';

@Component({
  selector: 'app-integration',
  imports: [
    ModalComponent,
    CommonModule,
    RouterModule,
    FormsModule,
    SharedModule,
  ],
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
  showAlert: boolean = false; // Control alert visibility
  alertMessage: string = ''; // Alert message
  alertType: 'success' | 'error' = 'success'; // Alert typ
  isButtonLoading: boolean = false;

  selectedHrTool: string = 'seamless';
  selectedComTools: string = 'slack';
  selectedProjTools: string = 'jira';

  jiraApiKey = '';
  jiraApiEmail = '';

  slackApiKey: string = '';

  seamlessClientId: string = '';
  seamlessClientSecret: string = '';

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
    this.isButtonLoading = true; // Start button loading

    if (this.jiraApiKey && this.jiraApiEmail) {
      const token = this.dataService.getAuthToken();

      if (token) {
        this.integrationService
          .connectJiraWithApiKey(this.jiraApiKey, this.jiraApiEmail, token)
          .subscribe({
            next: (response) => {
              this.isButtonLoading = false; // Stop button loading

              this.showAlert = true;
              this.alertMessage = '🎉🎉Jira Successfully Integrated';
              this.alertType = 'success';
              setTimeout(() => {
                this.showAlert = false;
              }, 3000);
              this.closeModal();
            },
            error: (error) => {
              this.isButtonLoading = false;

              this.showAlert = true;
              this.alertMessage = 'Error connecting Jira with API Key';
              this.alertType = 'success';
            },
          });
      } else {
        // Handle case where API key or email is missing
        // console.warn('Please provide both API Key and Email');
      }
    }
  }

  connectSlackApiKey() {
    this.isButtonLoading = true;

    if (this.slackApiKey) {
      const token = this.dataService.getAuthToken();

      if (token) {
        this.integrationService
          .connectSlackwithApi(this.slackApiKey, token)
          .subscribe({
            next: (response) => {
              // console.log('Slack integration successful:', response);
              this.isButtonLoading = false;
              this.showAlert = true;

              this.alertMessage = '🎉🎉Slack Successfully Integrated';
              setTimeout(() => {
                this.showAlert = false;
              }, 3000);
              this.alertType = 'success';
              this.closeModal();
            },
            error: (error) => {
              // console.error('Slack integration error:', error);
              this.isButtonLoading = false;
              this.showAlert = true;
              this.alertMessage = 'Error connecting Slack with API Key';
              this.alertType = 'error'; // Fixed: changed from 'success' to 'error'
            },
          });
      } else {
        // Handle missing token case
        // console.error('No auth token available');
        this.isButtonLoading = false;
        this.showAlert = true;
        this.alertMessage = 'Authentication token not found';
        this.alertType = 'error';
      }
    } else {
      // Handle missing API key case
      // console.error('No Slack API key provided');
      this.isButtonLoading = false;
      this.showAlert = true;
      this.alertMessage = 'Please enter a valid Slack API key';
      this.alertType = 'error';
    }
  }
  connectJiraOAuth() {
    this.integrationService.initiateJiraOAuth();
  }

  connectSlackOAuth() {
    this.integrationService.initiateSlackOAuth();
  }

  allowPermission() {
    if (
      this.selectedModalContent === 'project' &&
      this.selectedProjTools === 'jira'
    ) {
      this.connectJiraOAuth();
    }

    if (
      this.selectedModalContent === 'communication' &&
      this.selectedComTools === 'slack'
    ) {
      this.connectSlackOAuth();
    }

    if (!this.selectedProjTools && !this.selectedComTools) {
      this.closeModal();
    }
  }

  connectSeamlessHR() {
    this.isButtonLoading = true; // Start button loading

    if (this.seamlessClientId && this.seamlessClientSecret) {
      const token = this.dataService.getAuthToken();
      if (token) {
        this.integrationService
          .connectSeamlessHRWithCredentials(
            this.seamlessClientId,
            this.seamlessClientSecret,
            token
          )
          .subscribe({
            next: (response) => {
              this.isButtonLoading = false; // Stop button loading
              this.showAlert = true;
              this.alertMessage = '🎉🎉SeamlessHR Successfully Integrated';
              setTimeout(() => {
                this.showAlert = false;
              }, 3000);
              this.alertType = 'success';
              // console.log('SeamlessHR connected successfully', response);
              this.closeModal();
              // Handle success (e.g., show a notification)
            },
            error: (error) => {
              this.isButtonLoading = false; // Stop button loading
              this.showAlert = true;
              this.alertMessage =
                'Error connecting SeamlessHR. Try again Later';
              setTimeout(() => {
                this.showAlert = false;
              }, 3000);
              this.alertType = 'error'; // Fixed: should be 'error' not 'success'
            },
          });
      } else {
        this.isButtonLoading = false;
        // console.warn('No authentication token found');
      }
    } else {
      this.isButtonLoading = false;
      // console.warn('Please provide both Client ID and Client Secret');
    }
  }
}
