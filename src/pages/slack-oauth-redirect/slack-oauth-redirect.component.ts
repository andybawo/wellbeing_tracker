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

      // console.log('Received code:', code);
      // console.log('Received state:', state);

      if (!code) {
        // console.error('Code is missing from the redirect URL');
        this.error = true;
        this.errorMessage = 'Authorization code is missing';
        this.processing = false;
        return;
      }

      const storedState = localStorage.getItem('slack_oauth_state');
      const token = this.dataService.getAuthToken();

      if (token) {
        this.processing = true;
        localStorage.removeItem('slack');
        this.integrationService
          .exchangeSlackCodeForToken(code, state, token)
          .subscribe({
            next: (response) => {
              // console.log('Slack OAuth successful', response);
              this.processing = false;
              this.isSuccess = true;
              this.error = false;

              // Wait 3 seconds to show success message, then redirect
              setTimeout(() => {
                this.router.navigate(['/subscription/integration']);
              }, 3000);
            },

            error: (error) => {
              // console.error('Slack OAuth failed', error);
              this.router.navigate(['/subscription/integration']);
            },
          });
      } else {
        // console.error('Invalid state or missing code');
        this.router.navigate(['/subscription/integration']);
      }
    });
  }
}
