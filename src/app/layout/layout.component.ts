import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ButtonComponent } from '../shared/components/button/button.component';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, CommonModule, ButtonComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
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
