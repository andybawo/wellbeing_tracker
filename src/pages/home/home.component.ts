import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../app/shared/shared.module';
import { DashboardService } from '../../app/core/services/dashboard.service';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { DataService } from '../../app/core/services/data.service';

@Component({
  selector: 'app-home',
  imports: [SharedModule, RouterModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  showAlert: boolean = false;
  syncing: boolean = false;
  syncError: string | null = null;
  summary: any = null;
  summaryError: string | null = null;

  private static dataInitialized = false;

  constructor(
    private dashboardService: DashboardService,
    private dataService: DataService,
    private router: Router
  ) {}
  ngOnInit() {
    const isPageRefresh = !sessionStorage.getItem('app_session_started');

    if (isPageRefresh) {
      sessionStorage.setItem('app_session_started', 'true');
    }

    // CHECK SUBSCRIPTION FIRST before attempting any data loads
    const token = this.dataService.getAuthToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const subscriptionExpiryDate = payload.Subscription_Expires_At;

        // Check if subscription exists and is not the default date
        if (
          !subscriptionExpiryDate ||
          subscriptionExpiryDate === '1/1/0001 12:00:00 AM'
        ) {
          console.error('No subscription found');
          this.router.navigate(['/subscription']);
          return;
        }

        // Check if subscription has expired
        const expiryDate = new Date(subscriptionExpiryDate);
        const now = new Date();

        if (expiryDate < now) {
          console.error('Subscription expired');
          this.router.navigate(['/subscription'], {
            queryParams: { expired: 'true' },
          });
          return;
        }

        // Only proceed to load data if subscription is valid
        if (!HomeComponent.dataInitialized || isPageRefresh) {
          this.loadFreshData();
          HomeComponent.dataInitialized = true;
        } else {
          this.loadCachedData();
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
        this.router.navigate(['/subscription']);
        return;
      }
    } else {
      console.error('No auth token found');
      this.router.navigate(['/start/signin']);
      return;
    }
  }

  loadFreshData() {
    this.syncing = true;

    this.dashboardService.syncData().subscribe({
      next: (syncResponse) => {
        console.log('Data sync complete:', syncResponse);

        this.dashboardService.getSummary(2).subscribe({
          next: (summaryRes) => {
            this.syncing = false;
            if (summaryRes && summaryRes.success) {
              this.summary = summaryRes.data;
            } else {
              this.summaryError =
                summaryRes?.message || 'Failed to load summary data.';
            }
          },

          error: (err) => {
            this.syncing = false;
            this.summaryError = 'Error fetching summary data.';
            console.error('Summary error:', err);
          },
        });
      },
      error: (syncError) => {
        this.syncing = false;
        this.syncError = 'Failed to sync with integrated tools.';
        console.error('Sync error:', syncError);
      },
    });
  }

  loadCachedData() {
    this.syncing = true;
    this.dashboardService.getSummaryCached(2).subscribe({
      next: (summaryRes) => {
        this.syncing = false;
        if (summaryRes && summaryRes.success) {
          this.summary = summaryRes.data;
        } else {
          this.summaryError =
            summaryRes?.message || 'Failed to load summary data.';
        }
      },
      error: (err) => {
        this.syncing = false;
        this.summaryError = 'Error fetching summary data.';
        console.error('Summary error:', err);
      },
    });
  }

  getChannelGradient(active: number = 0, inactive: number = 0): string {
    const total = (active || 0) + (inactive || 0);
    if (!total) {
      return 'conic-gradient(#e0e0e0 0% 100%)';
    }
    const activePercent = Math.round((active / total) * 100);
    return `conic-gradient(#7cb342 0% ${activePercent}%, #e0e0e0 ${activePercent}% 100%)`;
  }

  getMessageGradient(slack: number = 0, teams: number = 0): string {
    const total = (slack || 0) + (teams || 0);
    if (!total) {
      return 'conic-gradient(#e0e0e0 0% 100%)';
    }
    const slackPercent = Math.round((slack / total) * 100);
    const teamsPercent = Math.round((teams / total) * 100);
    return `conic-gradient(#7cb342 0% ${slackPercent}%, #e0e0e0 ${slackPercent}% ${
      slackPercent + teamsPercent
    }%)`;
  }
  toggleAlert() {
    this.showAlert = !this.showAlert;
  }

  /**
   * @param status 'toDoStatus' | 'inProgressStatus' | 'doneStatus'
   */
  getProjPercent(
    status: 'toDoStatus' | 'inProgressStatus' | 'doneStatus'
  ): number {
    const s = this.summary;
    if (!s) return 0;
    const todo = Number(s.toDoStatus) || 0;
    const inProgress = Number(s.inProgressStatus) || 0;
    const done = Number(s.doneStatus) || 0;
    const total = todo + inProgress + done;
    if (!total) return 0;
    let val = 0;
    if (status === 'toDoStatus') val = todo;
    if (status === 'inProgressStatus') val = inProgress;
    if (status === 'doneStatus') val = done;
    return Math.round((val / total) * 100);
  }
}
