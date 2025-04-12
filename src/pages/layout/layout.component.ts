import { CommonModule } from '@angular/common';
import { Component, inject, Input, NgModule } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { SharedModule } from '../../app/shared/shared.module';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, CommonModule, SharedModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  sidebarOpen = false;

  router = inject(Router);

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  onRouteChange(route: string) {
    console.log('Navigated to:', route);
  }
}
