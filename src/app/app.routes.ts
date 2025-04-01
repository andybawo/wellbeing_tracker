import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'layout',
    component: LayoutComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
];
