import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IntegrationService } from '../../app/core/services/integration.service';
import { CommonModule } from '@angular/common';
import { DataService } from '../../app/core/services/data.service';

@Component({
  selector: 'app-jira-redirect',
  imports: [CommonModule],
  templateUrl: './slack-oauth-redirect.component.html',
  styleUrl: './slack-oauth-redirect.component.scss',
})
export class SlackOauthRedirectComponent implements OnInit {
  processing = true;
  isSuccess = false;
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

      const storedState = localStorage.getItem('slack_oauth_state');
      const token = this.dataService.getAuthToken();

      if (token) {
        this.processing = true;
        localStorage.removeItem('slack_oauth_state');
        this.integrationService
          .exchangeSlackCodeForToken(code, state, token)
          .subscribe({
            next: (response) => {
              this.processing = false;
              this.isSuccess = true;
              this.error = false;

              localStorage.setItem('slack_integrated', 'true');

              const returnUrl =
                localStorage.getItem('oauth_return_url') ||
                '/subscription/integration';
              localStorage.removeItem('oauth_return_url');

              setTimeout(() => {
                this.router.navigate([returnUrl]);
              }, 3000);
            },

            error: (error) => {
              const returnUrl =
                localStorage.getItem('oauth_return_url') ||
                '/subscription/integration';
              localStorage.removeItem('oauth_return_url');
              this.router.navigate([returnUrl]);
            },
          });
      } else {
        const returnUrl =
          localStorage.getItem('oauth_return_url') ||
          '/subscription/integration';
        localStorage.removeItem('oauth_return_url');
        this.router.navigate([returnUrl]);
      }
    });
  }
}
