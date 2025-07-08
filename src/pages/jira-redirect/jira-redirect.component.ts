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

      if (!code) {
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
              this.success = true;

              localStorage.setItem('jira_integrated', 'true');
              setTimeout(() => {
                this.router.navigate(['/subscription/integration']);
              }, 3000);
            },
            error: (error) => {
              this.error = true;
              setTimeout(() => {
                this.router.navigate(['/subscription/integration']);
              }, 3000);
            },
          });
      } else {
        this.router.navigate(['/subscription/integration']); // Redirect to a failure page
      }
    });
  }
}
