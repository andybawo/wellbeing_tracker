import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface IntegrationModalConfig {
  showSelectDropdowns?: boolean;
  showApiKeyFields?: boolean;
  availableTools?: {
    hr?: string[];
    communication?: string[];
    project?: string[];
  };
  selectedTools?: {
    hr?: string;
    communication?: string;
    project?: string;
  };
  preSelectedTool?: {
    type: 'hrm' | 'communication' | 'project';
    tool: string;
  };
}

export interface IntegrationCredentials {
  // HR Tools
  seamlessClientId?: string;
  seamlessClientSecret?: string;

  // Communication Tools
  slackApiKey?: string;

  // Project Tools
  jiraApiKey?: string;
  jiraApiEmail?: string;
}

@Component({
  selector: 'app-integration-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './integration-modal.component.html',
  styleUrl: './integration-modal.component.scss',
})
export class IntegrationModalComponent implements OnInit, OnChanges {
  @Input() isModalOpen: boolean = false;
  @Input() selectedModalContent: string = '';
  @Input() config: IntegrationModalConfig = {};
  @Input() isButtonLoading: boolean = false;

  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() connectToolEvent = new EventEmitter<{
    toolType: string;
    toolName: string;
    credentials?: IntegrationCredentials;
    useOAuth?: boolean;
  }>();
  @Output() toolSelectionChange = new EventEmitter<{
    type: string;
    tool: string;
  }>();

  // Internal state
  showApiKeyfield: boolean = false;

  // Tool selections
  selectedHrTool: string = '';
  selectedComTools: string = '';
  selectedProjTools: string = '';

  // Credentials
  seamlessClientId: string = '';
  seamlessClientSecret: string = '';
  slackApiKey: string = '';
  jiraApiKey: string = '';
  jiraApiEmail: string = '';

  ngOnInit() {
    this.initializeModalState();
  }

  ngOnChanges(changes: SimpleChanges) {
    // Re-initialize when config or modal state changes
    if (
      changes['config'] ||
      changes['isModalOpen'] ||
      changes['selectedModalContent']
    ) {
      this.initializeModalState();
    }
  }

  private initializeModalState() {
    // Initialize selected tools from config if provided
    if (this.config.selectedTools) {
      this.selectedHrTool = this.config.selectedTools.hr || '';
      this.selectedComTools = this.config.selectedTools.communication || '';
      this.selectedProjTools = this.config.selectedTools.project || '';
    }

    // Handle pre-selected tool
    if (this.config.preSelectedTool) {
      const { type, tool } = this.config.preSelectedTool;
      switch (type) {
        case 'hrm':
          this.selectedHrTool = tool;
          break;
        case 'communication':
          this.selectedComTools = tool;
          break;
        case 'project':
          this.selectedProjTools = tool;
          break;
      }
    }

    // If dropdowns are hidden and we have a preselected tool, show API key fields automatically
    if (!this.shouldShowSelectDropdowns && this.config.preSelectedTool) {
      const tool = this.config.preSelectedTool.tool;
      // Only show API key fields by default for tools that don't support OAuth (like seamless HR)
      this.showApiKeyfield = this.isApiKeyOnlyTool(tool);
    }
  }

  private isApiKeyOnlyTool(tool: string): boolean {
    // Tools that only support API key authentication
    const apiKeyOnlyTools = ['seamless'];
    return apiKeyOnlyTools.includes(tool);
  }

  closeModal() {
    this.closeModalEvent.emit();
    this.resetModalState();
  }

  private resetModalState() {
    this.selectedHrTool = '';
    this.selectedComTools = '';
    this.selectedProjTools = '';
    this.showApiKeyfield = false;
    this.seamlessClientId = '';
    this.seamlessClientSecret = '';
    this.slackApiKey = '';
    this.jiraApiKey = '';
    this.jiraApiEmail = '';
  }

  toggleToolhr(tool: string) {
    this.selectedHrTool = tool;
    this.toolSelectionChange.emit({ type: 'hr', tool });
  }

  toggleTool(tool: string) {
    this.selectedComTools = tool;
    this.toolSelectionChange.emit({ type: 'communication', tool });
  }

  toggleToolproj(tool: string) {
    this.selectedProjTools = tool;
    this.toolSelectionChange.emit({ type: 'project', tool });
  }

  toggleApiKeyField(event: Event) {
    event.preventDefault();
    this.showApiKeyfield = !this.showApiKeyfield;
  }

  connectSeamlessHR() {
    const credentials: IntegrationCredentials = {
      seamlessClientId: this.seamlessClientId,
      seamlessClientSecret: this.seamlessClientSecret,
    };

    this.connectToolEvent.emit({
      toolType: 'hr',
      toolName: 'seamless',
      credentials,
    });
  }

  connectSlackApiKey() {
    const credentials: IntegrationCredentials = {
      slackApiKey: this.slackApiKey,
    };

    this.connectToolEvent.emit({
      toolType: 'communication',
      toolName: 'slack',
      credentials,
    });
  }

  connectJiraApiKey() {
    const credentials: IntegrationCredentials = {
      jiraApiKey: this.jiraApiKey,
      jiraApiEmail: this.jiraApiEmail,
    };

    this.connectToolEvent.emit({
      toolType: 'project',
      toolName: 'jira',
      credentials,
    });
  }

  allowPermission() {
    let toolType = '';
    let toolName = '';

    if (this.selectedModalContent === 'project' && this.selectedProjTools) {
      toolType = 'project';
      toolName = this.selectedProjTools;
    } else if (
      this.selectedModalContent === 'communication' &&
      this.selectedComTools
    ) {
      toolType = 'communication';
      toolName = this.selectedComTools;
    } else if (this.selectedModalContent === 'hrm' && this.selectedHrTool) {
      toolType = 'hr';
      toolName = this.selectedHrTool;
    }

    if (toolType && toolName) {
      this.connectToolEvent.emit({
        toolType,
        toolName,
        useOAuth: true,
      });
    } else {
      this.closeModal();
    }
  }

  // Getter methods for conditional rendering
  get shouldShowSelectDropdowns(): boolean {
    return this.config.showSelectDropdowns !== false; // Default to true
  }

  get shouldShowApiKeyFields(): boolean {
    return this.config.showApiKeyFields !== false; // Default to true
  }

  get availableHrTools(): string[] {
    return this.config.availableTools?.hr || ['seamless'];
  }

  get availableCommunicationTools(): string[] {
    return (
      this.config.availableTools?.communication || ['slack', 'outlook', 'teams']
    );
  }

  get availableProjectTools(): string[] {
    return this.config.availableTools?.project || ['jira', 'planner'];
  }
}
