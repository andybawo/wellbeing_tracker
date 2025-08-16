import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../../../../app/core/services/dashboard.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-list',
  imports: [RouterModule, CommonModule],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss',
})
export class ProjectListComponent implements OnInit {
  projectData: any = null;
  loading = true;
  error: string | null = null;
  constructor(private dashboardService: DashboardService) {}
  ngOnInit(): void {
    this.dashboardService.getProjects(2).subscribe({
      next: (res) => {
        if (res && res.success) {
          this.projectData = res.data;
        } else {
          this.error = res?.message || 'Failed to load project data';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error fetching project data';
        this.loading = false;
      },
    });
  }
}
