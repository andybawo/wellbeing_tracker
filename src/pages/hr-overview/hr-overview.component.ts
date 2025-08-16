import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../app/core/services/dashboard.service';

@Component({
  selector: 'app-hr-overview',
  imports: [],
  templateUrl: './hr-overview.component.html',
  styleUrl: './hr-overview.component.scss',
})
export class HrOverviewComponent implements OnInit {
  hrmData: any = null;
  loading = true;
  error: string | null = null;
  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dashboardService.getHRM(2).subscribe({
      next: (res) => {
        if (res && res.success) {
          this.hrmData = res.data;
        } else {
          this.error = res?.message || 'Failed to load HRM data';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error fetching HRM data';
        this.loading = false;
      },
    });
  }
}
