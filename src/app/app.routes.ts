import { Routes } from '@angular/router';
import { LayoutComponent } from '../pages/layout/layout.component';
import { HomeComponent } from '../pages/home/home.component';
import { WelcomeComponent } from '../pages/welcome/welcome.component';
import { SignupComponent } from '../pages/signup/signup.component';
import { StartComponent } from '../pages/start/start.component';
import { LoginComponent } from '../pages/login/login.component';
import { CompanyRegComponent } from '../pages/company-reg/company-reg.component';
import { VerifyComponent } from '../pages/verify/verify.component';
import { IntegrationComponent } from '../pages/integration/integration.component';
import { RegistrationComponent } from '../pages/registration/registration.component';
import { SubscriptionComponent } from '../pages/subscription/subscription.component';
import { SubSuccessfulComponent } from '../pages/sub-successful/sub-successful.component';
import { ForgotPasswordComponent } from '../pages/forgot-password/forgot-password.component';
import { JiraRedirectComponent } from '../pages/jira-redirect/jira-redirect.component';
import { HrOverviewComponent } from '../pages/hr-overview/hr-overview.component';
import { CommunicationComponent } from '../pages/communication/communication.component';
import { SlackOauthRedirectComponent } from '../pages/slack-oauth-redirect/slack-oauth-redirect.component';
// import { ResetPasswordComponent } from '../pages/reset-password/reset-password.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'start',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'communication',
        component: CommunicationComponent,
      },
      {
        path: 'hr-overview',
        component: HrOverviewComponent,
      },
    ],
  },
  {
    path: 'start',
    component: WelcomeComponent,
    children: [
      {
        path: '',
        component: StartComponent,
      },
      {
        path: 'signup',
        component: SignupComponent,
      },
      {
        path: 'registration',
        component: RegistrationComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
      },
      // {
      //   path: 'reset-password',
      //   component: ResetPasswordComponent,
      // },
      {
        path: 'verify',
        component: VerifyComponent,
      },
    ],
  },
  {
    path: 'subscription',
    component: CompanyRegComponent,
    children: [
      // {
      //   path: '',
      //   component: RegistrationComponent,
      // },
      {
        path: 'integration',
        component: IntegrationComponent,
      },
      {
        path: '',
        component: SubscriptionComponent,
      },
      {
        path: 'sub-successful',
        component: SubSuccessfulComponent,
      },
      {
        path: 'jira-redirect',
        component: JiraRedirectComponent,
      },
      {
        path: 'slack-oauth-redirect',
        component: SlackOauthRedirectComponent,
      },
    ],
  },
];
