import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../app/core/services/dashboard.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-communication',
  imports: [CommonModule],
  templateUrl: './communication.component.html',
  styleUrl: './communication.component.scss',
})
export class CommunicationComponent implements OnInit {
  communicationData: any = null;
  loading = false;
  syncing = false;
  error: string | null = null;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    // Only fetch cached data on component load
    this.loading = true;
    this.dashboardService.getCommunication(2).subscribe({
      next: (res) => {
        if (res && res.success) {
          this.communicationData = res.data;
        } else {
          this.error = res?.message || 'Failed to load communication data';
        }
        this.loading = false;
      },
      error: () => {
        this.error = 'Error fetching communication data';
        this.loading = false;
      },
    });
  }
}
