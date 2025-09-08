import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

interface IncompleteRegistration {
  userId: string;
  email: string;
  fullName: string;
  registeredAt: string;
  daysIncomplete: number;
  lastReminderSent?: string;
  reminderCount: number;
}

interface RegistrationStats {
  totalUsers: number;
  completedRegistrations: number;
  incompleteRegistrations: number;
  completionRate: number;
  avgDaysToComplete: number;
  incompleteByDays: {
    '1-3 days': number;
    '4-7 days': number;
    '8-30 days': number;
    '30+ days': number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getIncompleteRegistrations(): Observable<IncompleteRegistration[]> {
    return this.http.get<IncompleteRegistration[]>(
      `${this.apiUrl}/api/Admin/incomplete-registrations`
    );
  }

  getRegistrationStats(): Observable<RegistrationStats> {
    return this.http.get<RegistrationStats>(
      `${this.apiUrl}/api/Admin/registration-stats`
    );
  }

  // Send reminder email to specific user
  sendRegistrationReminder(userId: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/api/Admin/send-reminder/${userId}`,
      {}
    );
  }

  // Send bulk reminder emails
  sendBulkReminders(criteria: {
    daysIncomplete?: number;
    maxReminders?: number;
    excludeRecentReminders?: boolean;
  }): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/api/Admin/send-bulk-reminders`,
      criteria
    );
  }

  // Clean up old incomplete registrations
  cleanupIncompleteRegistrations(
    daysOld: number,
    dryRun: boolean = true
  ): Observable<{
    deletedCount: number;
    deletedUsers: string[];
  }> {
    return this.http.delete<any>(
      `${this.apiUrl}/api/Admin/cleanup-incomplete/${daysOld}?dryRun=${dryRun}`
    );
  }

  // Mark user as abandoned (soft delete)
  markAsAbandoned(userId: string): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/api/Admin/mark-abandoned/${userId}`,
      {}
    );
  }

  // Restore abandoned user
  restoreUser(userId: string): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/api/Admin/restore-user/${userId}`,
      {}
    );
  }

  scheduleAutomaticCleanup(config: {
    enabled: boolean;
    daysBeforeCleanup: number;
    reminderSchedule: number[];
    maxReminders: number;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/Admin/schedule-cleanup`, config);
  }

  getCleanupSchedule(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/Admin/cleanup-schedule`);
  }
}
