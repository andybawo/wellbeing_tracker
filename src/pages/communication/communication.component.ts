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
    this.loading = true;
    this.dashboardService.getCommunication(0).subscribe({
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

  getSentimentGradient(
    positive: number = 0,
    negative: number = 0,
    neutral: number = 0
  ): string {
    const total = (positive || 0) + (negative || 0) + (neutral || 0);
    if (!total) {
      return 'conic-gradient(#e0e0e0 0% 100%)';
    }

    const positivePercent = (positive / total) * 100;
    const negativePercent = (negative / total) * 100;
    const neutralPercent = (neutral / total) * 100;

    const positiveEnd = positivePercent;
    const negativeEnd = positiveEnd + negativePercent;
    const neutralEnd = 100;

    return `conic-gradient(
    #5c8503 0% ${positiveEnd}%,
    #e00f0f ${positiveEnd}% ${negativeEnd}%,
    #f9b51e ${negativeEnd}% ${neutralEnd}%
  )`;
  }
}
