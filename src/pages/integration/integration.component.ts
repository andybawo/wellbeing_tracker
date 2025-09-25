import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IntegrationService } from '../../app/core/services/integration.service';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../app/core/services/data.service';
import { SharedModule } from '../../app/shared/shared.module';
import { Router } from '@angular/router';
import {
  IntegrationModalComponent,
  IntegrationCredentials,
  IntegrationModalConfig,
} from '../../app/shared/integration-modal/integration-modal.component';

import { DashboardService } from '../../app/core/services/dashboard.service';
import { AuthService } from '../../app/core/services/auth.service';
import { UserIntegrations } from '../../app/interfaces/user-interface';

@Component({
  selector: 'app-integration',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    SharedModule,
    IntegrationModalComponent,
  ],
  templateUrl: './integration.component.html',
  styleUrl: './integration.component.scss',
})
export class IntegrationComponent implements OnInit {
  selectedModalContent = '';
  isModalOpen = false;
  isLoading = false;
  shouldOpenModal = false;
  showAlert: boolean = false;
  alertMessage: string = '';
  alertType: 'success' | 'error' = 'success';
  isButtonLoading: boolean = false;
  userIntegrations: UserIntegrations = {} as UserIntegrations;

  integratedTools = {
    jira: false,
    slack: false,
    seamlessHR: false,
    outlook: false,
    teams: false,
    planner: false,
  };

  // Modal configuration
  modalConfig: IntegrationModalConfig = {
    showSelectDropdowns: true,
    showApiKeyFields: true,
    availableTools: {
      hr: ['seamless'],
      communication: ['slack', 'outlook', 'teams'],
      project: ['jira', 'planner'],
    },
  };

  constructor(
    private integrationService: IntegrationService,
    private dataService: DataService,
    private router: Router,
    private dashboardService: DashboardService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const token = this.authService.getToken();
    if (token) {
      this.authService.getUserDetails(token).subscribe((response) => {
        if (response.success && response) {
          this.userIntegrations = response.data;
        }
      });
    }
  }

  openModal(content: string) {
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

  onCloseModal() {
    this.isLoading = false;
    this.isModalOpen = false;
    this.shouldOpenModal = false;
  }

  onToolSelectionChange(event: { type: string; tool: string }) {
    // Handle tool selection changes if needed
    console.log('Tool selection changed:', event);
  }

  onConnectTool(event: {
    toolType: string;
    toolName: string;
    credentials?: IntegrationCredentials;
    useOAuth?: boolean;
  }) {
    this.isButtonLoading = true;

    if (event.useOAuth) {
      this.handleOAuthConnection(event.toolType, event.toolName);
    } else if (event.credentials) {
      this.handleApiKeyConnection(
        event.toolType,
        event.toolName,
        event.credentials
      );
    }
  }

  private handleOAuthConnection(toolType: string, toolName: string) {
    if (toolType === 'project' && toolName === 'jira') {
      this.connectJiraOAuth();
    } else if (toolType === 'communication' && toolName === 'slack') {
      this.connectSlackOAuth();
    }
    this.isButtonLoading = false;
  }

  private handleApiKeyConnection(
    toolType: string,
    toolName: string,
    credentials: IntegrationCredentials
  ) {
    const token = this.dataService.getAuthToken();

    if (!token) {
      this.isButtonLoading = false;
      this.showAlert = true;
      this.alertMessage = 'Authentication token not found';
      this.alertType = 'error';
      return;
    }

    switch (`${toolType}-${toolName}`) {
      case 'hr-seamless':
        this.connectSeamlessHR(credentials, token);
        break;
      case 'communication-slack':
        this.connectSlackApiKey(credentials, token);
        break;
      case 'project-jira':
        this.connectJiraApiKey(credentials, token);
        break;
      default:
        this.isButtonLoading = false;
        break;
    }
  }

  private connectSeamlessHR(
    credentials: IntegrationCredentials,
    token: string
  ) {
    if (credentials.seamlessClientId && credentials.seamlessClientSecret) {
      this.integrationService
        .connectSeamlessHRWithCredentials(
          credentials.seamlessClientId,
          credentials.seamlessClientSecret,
          token
        )
        .subscribe({
          next: (response) => {
            this.handleSuccessfulConnection(
              'seamlessHR',
              '🎉🎉SeamlessHR Successfully Integrated'
            );
          },
          error: (error) => {
            this.handleConnectionError(
              'Error connecting SeamlessHR. Try again Later'
            );
          },
        });
    } else {
      this.isButtonLoading = false;
    }
  }

  private connectSlackApiKey(
    credentials: IntegrationCredentials,
    token: string
  ) {
    if (credentials.slackApiKey) {
      this.integrationService
        .connectSlackwithApi(credentials.slackApiKey, token)
        .subscribe({
          next: (response) => {
            this.handleSuccessfulConnection(
              'slack',
              '🎉🎉Slack Successfully Integrated'
            );
          },
          error: (error) => {
            this.handleConnectionError('Error connecting Slack with API Key');
          },
        });
    } else {
      this.handleConnectionError('Please enter a valid Slack API key');
    }
  }

  private connectJiraApiKey(
    credentials: IntegrationCredentials,
    token: string
  ) {
    if (credentials.jiraApiKey && credentials.jiraApiEmail) {
      this.integrationService
        .connectJiraWithApiKey(
          credentials.jiraApiKey,
          credentials.jiraApiEmail,
          token
        )
        .subscribe({
          next: (response) => {
            this.handleSuccessfulConnection(
              'jira',
              '🎉🎉Jira Successfully Integrated'
            );
          },
          error: (error) => {
            this.handleConnectionError('Error connecting Jira with API Key');
          },
        });
    }
  }

  private handleSuccessfulConnection(
    toolKey: keyof typeof this.integratedTools,
    message: string
  ) {
    this.isButtonLoading = false;
    localStorage.setItem(`${toolKey}_integrated`, 'true');
    this.integratedTools[toolKey] = true;
    this.showAlert = true;
    this.alertMessage = message;
    this.alertType = 'success';
    setTimeout(() => {
      this.showAlert = false;
    }, 3000);
    this.onCloseModal();
  }

  private handleConnectionError(message: string) {
    this.isButtonLoading = false;
    this.showAlert = true;
    this.alertMessage = message;
    this.alertType = 'error';
    setTimeout(() => {
      this.showAlert = false;
    }, 3000);
  }

  connectJiraOAuth() {
    localStorage.setItem('oauth_return_url', '/subscription/integration');
    this.integrationService.initiateJiraOAuth();
  }

  connectSlackOAuth() {
    localStorage.setItem('oauth_return_url', '/subscription/integration');
    this.integrationService.initiateSlackOAuth();
  }

  private loadIntegrationStatus() {
    this.integratedTools.jira =
      localStorage.getItem('jira_integrated') === 'true';
    this.integratedTools.slack =
      localStorage.getItem('slack_integrated') === 'true';
    this.integratedTools.seamlessHR =
      localStorage.getItem('seamlessHR_integrated') === 'true';
  }

  getIntegratedHRTools(): string[] {
    const tools: string[] = [];
    if (this.userIntegrations.isSeamlessHRConnected) tools.push('seamless');
    return tools;
  }

  getIntegratedCommunicationTools(): string[] {
    const tools: string[] = [];
    if (this.userIntegrations.isSlackConnected) tools.push('slack');
    if (this.userIntegrations.isOutlookConnected) tools.push('outlook');
    if (this.userIntegrations.isTeamsConnected) tools.push('teams');
    return tools;
  }

  getIntegratedProjectTools(): string[] {
    const tools: string[] = [];
    if (this.userIntegrations.isJiraConnected) tools.push('Jira');
    if (this.userIntegrations.isPlannerConnected) tools.push('Planner');
    return tools;
  }

  continueToHome() {
    this.isButtonLoading = true;
    this.dashboardService.clearCache();
    this.dashboardService.syncData().subscribe({
      next: () => {
        this.isButtonLoading = false;
        this.router.navigate(['/home']);
      },
      error: () => {
        this.isButtonLoading = false;
        // Optionally handle sync error, then navigate anyway
        this.router.navigate(['/home']);
      },
    });
  }
}
