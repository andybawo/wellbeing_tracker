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
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'verify',
        component: VerifyComponent,
      },
    ],
  },
  {
    path: 'registration',
    component: CompanyRegComponent,
    children: [
      {
        path: '',
        component: RegistrationComponent,
      },
      {
        path: 'integration',
        component: IntegrationComponent,
      },
      {
        path: 'subscription',
        component: SubscriptionComponent,
      },
    ],
  },
];
