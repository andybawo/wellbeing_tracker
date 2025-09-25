import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../../app/core/services/dashboard.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Route } from '@angular/router';
import { CompanyProfileRoutingModule } from '../../../company-profile/company-profile-routing.module';

@Component({
  selector: 'app-view-projects',
  imports: [CommonModule, CompanyProfileRoutingModule],
  templateUrl: './view-projects.component.html',
  styleUrl: './view-projects.component.scss',
})
export class ViewProjectsComponent implements OnInit {
  projectDetails: any = null;
  constructor(
    private route: ActivatedRoute,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    const projectId = this.route.snapshot.paramMap.get('id');
    const range = 2;
    if (projectId) {
      this.dashboardService
        .getProjectDetails(Number(projectId), range)
        .subscribe(
          (data) => {
            this.projectDetails = data;
          },
          (error) => {
            console.error('Error fetching project details:', error);
          }
        );
    }
  }

  getPercent(status: 'onTrack' | 'ongoing' | 'atRisk' | 'overdue'): number {
    const data = this.projectDetails?.data;
    if (!data) return 0;
    const total =
      (data.onTrack || 0) +
      (data.ongoing || 0) +
      (data.atRisk || 0) +
      (data.overdue || 0);
    if (!total) return 0;
    return Math.round(((data[status] || 0) / total) * 100);
  }
}
