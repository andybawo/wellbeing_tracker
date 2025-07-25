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
import { AuthenticationComponent } from '../pages/authentication/authentication.component';
import { ResetpasswordComponent } from '../pages/resetpassword/resetpassword.component';
// import { ResetPasswordComponent } from '../pages/reset-password/reset-password.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AlertsComponent } from '../pages/alerts/alerts.component';
import { IntegrateDashComponent } from '../pages/integrate-dash/integrate-dash.component';
import { UserManagementComponent } from '../pages/user-management/user-management.component';
import { ProjectManagementComponent } from '../pages/project-management/project-management.component';
import { SubscriptionDashComponent } from '../pages/subscription-dash/subscription-dash.component';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'start',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: LayoutComponent,
    // canActivate: [AuthGuard],
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
      {
        path: 'alerts',
        component: AlertsComponent,
      },
      {
        path: 'integrate-dash',
        component: IntegrateDashComponent,
      },
      {
        path: 'user-management',
        component: UserManagementComponent,
      },
      {
        path: 'company-profile',
        loadChildren: () =>
          import('../pages/company-profile/company-profile.module').then(
            (m) => m.CompanyProfileModule
          ),
      },
      {
        path: 'project-management',
        component: ProjectManagementComponent,
      },
      {
        path: 'subscription-dash',
        component: SubscriptionDashComponent,
      },
    ],
  },
  {
    path: 'authentication',
    component: AuthenticationComponent,
    children: [
      {
        path: 'resetpassword',
        component: ResetpasswordComponent,
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
