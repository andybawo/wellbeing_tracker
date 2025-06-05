// integration.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { v4 as uuidv4 } from 'uuid';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class IntegrationService {
  private apiUrl = environment.apiUrl;
  private jiraApiKeyEndpoint =
    'https://cultural-health.azurewebsites.net/api/Jira/connect/Jira/key';
  private jiraOAuthAuthorizeUrl = 'https://auth.atlassian.com/authorize';
  private jiraClientId = 'gWwrLlmqy36TJ0P4GKALS6W74LCaosUq';
  private jiraOAuthRedirectUri = `${window.location.origin}/subscription/jira-redirect`;
  private jiraOAuthScope =
    'read:project:jira read:project-info:jira read:issue-details:jira read:issue-status:jira read:user:jira read:issue:jira-software read:sprint:jira-software read:operations-info:jira read:comment-info:jira read:conversation-info:jira read:calendar-info:jira read:customer-org:jira read:role:jira read:status:jira read:workflow:jira read:project.feature:jira read:project.component:jira read:issue-worklog:jira read:issue:jira read:group:jira read:dashboard:jira';

  private slackOAuthAuthorizeUrl = 'https://slack.com/oauth/v2/authorize';
  private slackClientId = '8902772966210.8893672806710';
  private slackOAuthRedirectUri = `${window.location.origin}/subscription/slack-redirect`;
  private slackOAuthScope =
    'channels:history channels:read groups:history groups:read mpim:history mpim:read reactions:read usergroups:read users:read users:read.email';

  constructor(private http: HttpClient, private router: Router) {}

  private seamlessIntegrateEndpoint =
    'https://cultural-health.azurewebsites.net/api/SeamlessHR/connect/seamlessHR/key';

  connectSeamlessHRWithCredentials(
    clientId: string,
    clientSecret: string,
    jwtToken: string
  ) {
    // console.log('Client ID being sent:', clientId);
    // console.log('Client ID length:', clientId.length);
    // console.log('Client Secret present:', !!clientSecret);
    // console.log('JWT Token present:', !!jwtToken);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${jwtToken}`,
      'Content-Type': 'application/json',
      Accept: '*/*',
    });

    const requestBody = {
      clientId: clientId,
      clientSecret: clientSecret,
    };

    // console.log('Request Body:', requestBody);
    // console.log('Full URL will be:', this.seamlessIntegrateEndpoint);

    return this.http.post(this.seamlessIntegrateEndpoint, requestBody, {
      headers,
    });
  }

  connectJiraWithApiKey(apiKey: string, email: string, jwtToken: string) {
    // console.log('API Key being sent:', apiKey);
    // console.log('API Key length:', apiKey.length);
    // console.log('Email being sent:', email);
    // console.log('JWT Token present:', !!jwtToken);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${jwtToken}`,
      'Content-Type': 'application/json',
      Accept: '*/*',
    });

    // Match the exact parameter names and format used in Swagger
    const params = new HttpParams().set('key', apiKey).set('jiraEmail', email);

    // console.log('Query params:', params.toString());
    // console.log(
    //   'Full URL will be:',
    //   `${this.jiraApiKeyEndpoint}?${params.toString()}`
    // );

    // Check if URL is too long (browsers have limits around 2048-8192 chars)
    const fullUrl = `${this.jiraApiKeyEndpoint}?${params.toString()}`;
    // console.log('URL length:', fullUrl.length);

    if (fullUrl.length > 2048) {
      // console.warn('URL might be too long for some browsers/servers');
    }

    // Use the same format as the successful Swagger test
    return this.http.post(this.jiraApiKeyEndpoint, null, { headers, params });
  }

  initiateJiraOAuth() {
    const state = uuidv4();
    const authorizationUrl = `${
      this.jiraOAuthAuthorizeUrl
    }?audience=api.atlassian.com&client_id=${
      this.jiraClientId
    }&scope=${encodeURIComponent(
      this.jiraOAuthScope
      // )}&redirect_uri=${encodeURIComponent(
      //   this.jiraOAuthRedirectUri
    )}&state=${state}&response_type=code&prompt=consent`;
    localStorage.setItem('jira_oauth_state', state);
    window.location.href = authorizationUrl;
  }

  exchangeJiraCodeForToken(code: string, state: string, jwtToken: string) {
    // console.log('Code being sent:', code);
    // console.log('State being sent:', state);
    // console.log('JWT Token:', jwtToken);
    const headers = new HttpHeaders({
      Authorization: `Bearer ${jwtToken}`,
    });

    const params = new HttpParams().set('code', code).set('state', state);

    return this.http.post(
      `${this.apiUrl}/api/Jira/connect/Jira/OAuth`,
      {
        code,
        state,
      },
      { headers, params }
    );
  }

  initiateSlackOAuth() {
    const state = uuidv4();
    const authorizationUrl = `${this.slackOAuthAuthorizeUrl}?client_id=${
      this.slackClientId
    }&scope=${encodeURIComponent(
      this.slackOAuthScope
      // )}&redirect_uri=${encodeURIComponent(
      //   this.slackOAuthRedirectUri
    )}&state=${state}&response_type=code`;
    localStorage.setItem('slack_oauth_state', state);
    window.location.href = authorizationUrl;
  }

  exchangeSlackCodeForToken(code: string, state: string, jwtToken: string) {
    // console.log('Code being sent:', code);
    // console.log('State being sent:', state);
    // console.log('JWT Token:', jwtToken);
    const headers = new HttpHeaders({
      Authorization: `Bearer ${jwtToken}`,
    });
    const params = new HttpParams().set('code', code).set('state', state);
    return this.http.post(
      `${this.apiUrl}/api/Slack/connect/Slack/OAuth`,
      {
        code,
        state,
      },
      { headers, params }
    );
  }
}
