import { Component, OnInit } from '@angular/core';
import {
  IntegrationModalComponent,
  IntegrationCredentials,
  IntegrationModalConfig,
} from '../../app/shared/integration-modal/integration-modal.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../app/shared/shared.module';
import { IntegrationService } from '../../app/core/services/integration.service';
import { DataService } from '../../app/core/services/data.service';

@Component({
  selector: 'app-integrate-dash',
  imports: [
    IntegrationModalComponent,
    CommonModule,
    RouterModule,
    SharedModule,
  ],
  templateUrl: './integrate-dash.component.html',
  styleUrl: './integrate-dash.component.scss',
})
export class IntegrateDashComponent implements OnInit {
  isModalOpen = false;
  selectedModalContent = '';
  isButtonLoading = false;
  showAlert: boolean = false;
  alertMessage: string = '';
  alertType: 'success' | 'error' = 'success';
  modalConfig: IntegrationModalConfig = {};

  // Track integration status
  integratedTools = {
    jira: false,
    slack: false,
    seamlessHR: false,
    outlook: false,
    teams: false,
    planner: false,
  };

  constructor(
    private integrationService: IntegrationService,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.loadIntegrationStatus();
  }

  onCloseModal() {
    this.isModalOpen = false;
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
      case 'hrm-seamless':
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
    localStorage.setItem('oauth_return_url', '/home/integrate-dash');
    this.integrationService.initiateJiraOAuth();
  }

  connectSlackOAuth() {
    localStorage.setItem('oauth_return_url', '/home/integrate-dash');
    this.integrationService.initiateSlackOAuth();
  }

  private loadIntegrationStatus() {
    this.integratedTools.jira =
      localStorage.getItem('jira_integrated') === 'true';
    this.integratedTools.slack =
      localStorage.getItem('slack_integrated') === 'true';
    this.integratedTools.seamlessHR =
      localStorage.getItem('seamlessHR_integrated') === 'true';
    this.integratedTools.outlook =
      localStorage.getItem('outlook_integrated') === 'true';
    this.integratedTools.teams =
      localStorage.getItem('teams_integrated') === 'true';
    this.integratedTools.planner =
      localStorage.getItem('planner_integrated') === 'true';
  }

  // Helper methods to check integration status for template
  isToolIntegrated(toolName: string): boolean {
    return this.integratedTools[toolName as keyof typeof this.integratedTools];
  }

  disconnectTool(toolName: string) {
    const toolKey = toolName as keyof typeof this.integratedTools;
    localStorage.removeItem(`${toolKey}_integrated`);
    this.integratedTools[toolKey] = false;
    this.showAlert = true;
    this.alertMessage = `${toolName} has been disconnected`;
    this.alertType = 'success';
    setTimeout(() => {
      this.showAlert = false;
    }, 3000);
  }

  // Specific methods for each tool
  openSeamlessModal() {
    this.selectedModalContent = 'hrm';
    this.modalConfig = {
      showSelectDropdowns: false,
      showApiKeyFields: true,
      preSelectedTool: {
        type: 'hrm',
        tool: 'seamless',
      },
    };
    this.isModalOpen = true;
  }

  openSlackModal() {
    this.selectedModalContent = 'communication';
    this.modalConfig = {
      showSelectDropdowns: false,
      showApiKeyFields: true,
      preSelectedTool: {
        type: 'communication',
        tool: 'slack',
      },
    };
    this.isModalOpen = true;
  }

  openJiraModal() {
    this.selectedModalContent = 'project';
    this.modalConfig = {
      showSelectDropdowns: false,
      showApiKeyFields: true,
      preSelectedTool: {
        type: 'project',
        tool: 'jira',
      },
    };
    this.isModalOpen = true;
  }

  openPlannerModal() {
    this.selectedModalContent = 'project';
    this.modalConfig = {
      showSelectDropdowns: false,
      showApiKeyFields: true,
      preSelectedTool: {
        type: 'project',
        tool: 'planner',
      },
    };
    this.isModalOpen = true;
  }

  openTeamsModal() {
    this.selectedModalContent = 'communication';
    this.modalConfig = {
      showSelectDropdowns: false,
      showApiKeyFields: true,
      preSelectedTool: {
        type: 'communication',
        tool: 'teams',
      },
    };
    this.isModalOpen = true;
  }

  openOutlookModal() {
    this.selectedModalContent = 'communication';
    this.modalConfig = {
      showSelectDropdowns: false,
      showApiKeyFields: true,
      preSelectedTool: {
        type: 'communication',
        tool: 'outlook',
      },
    };
    this.isModalOpen = true;
  }
}
