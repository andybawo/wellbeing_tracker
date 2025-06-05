import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IntegrationService } from '../../app/core/services/integration.service';
import { CommonModule } from '@angular/common';
import { DataService } from '../../app/core/services/data.service';

@Component({
  selector: 'app-jira-redirect',
  imports: [CommonModule],
  templateUrl: './jira-redirect.component.html',
  styleUrl: './jira-redirect.component.scss',
})
export class JiraRedirectComponent implements OnInit {
  processing = true;
  success = false;
  error = false;
  errorMessage = '';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private integrationService: IntegrationService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const code = params['code'];
      const state = params['state'];

      // console.log('Received code:', code);
      // console.log('Received state:', state);

      if (!code) {
        // console.error('Code is missing from the redirect URL');
        this.error = true;
        this.errorMessage = 'Authorization code is missing';
        this.processing = false;
        return;
      }

      const storedState = localStorage.getItem('jira_oauth_state');
      const token = this.dataService.getAuthToken();

      if (token) {
        localStorage.removeItem('jira_oauth_state');
        this.integrationService
          .exchangeJiraCodeForToken(code, state, token)
          .subscribe({
            next: (response) => {
              // console.log('Jira OAuth successful', response);
              this.success = true;
              setTimeout(() => {
                this.router.navigate(['/subscription/integration']);
              }, 3000);
              // Redirect to a success page
              // Handle success (e.g., store tokens)
            },
            error: (error) => {
              // console.error('Jira OAuth failed', error);
              this.router.navigate(['/subscription/integration']); // Redirect to a failure page
              // Handle error (e.g., show an error message)
            },
          });
      } else {
        // console.error('Invalid state or missing code');
        this.router.navigate(['/subscription/integration']); // Redirect to a failure page
      }
    });
  }
}
