import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  @Input() sidebarOpen = false; // Allow parent to control sidebar state

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
