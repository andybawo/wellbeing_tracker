import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../app/shared/shared.module';
import { DashboardService } from '../../app/core/services/dashboard.service';

@Component({
  selector: 'app-home',
  imports: [SharedModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  showAlert: boolean = false;
  syncing: boolean = false;
  syncError: string | null = null;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.syncing = true;
    this.dashboardService.syncData().subscribe({
      next: (res) => {
        this.syncing = false;
        if (!res?.success) {
          this.syncError = res?.message || 'Failed to sync dashboard data.';
        }
      },
      error: (err) => {
        this.syncing = false;
        this.syncError = 'Error syncing dashboard data.';
      },
    });
  }

  toggleAlert() {
    this.showAlert = !this.showAlert;
  }
}
