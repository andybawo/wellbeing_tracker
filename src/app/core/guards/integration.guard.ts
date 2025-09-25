import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.service';

@Injectable({ providedIn: 'root' })
export class IntegrationGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    const token = this.authService.getToken();
    if (!token) {
      return of(this.router.createUrlTree(['/start/login']));
    }
    return this.authService.getUserDetails(token).pipe(
      map((response) => {
        if (!response.success || !response.data) {
          return this.router.createUrlTree(['/start/login']);
        }
        const userData = response.data;

        // Company registration
        if (!userData.companyId) {
          this.dataService.setUserData(userData);
          return this.router.createUrlTree(['/start/registration']);
        }
        // Email verification
        if (!userData.isEmailVerified) {
          this.dataService.setUserData({ emailAddress: userData.emailAddress });
          return this.router.createUrlTree(['/start/verify']);
        }
        // Required integrations
        const hasRequiredIntegration =
          userData.isSeamlessHRConnected ||
          userData.isSlackConnected ||
          userData.isJiraConnected;
        if (!hasRequiredIntegration) {
          return this.router.createUrlTree(['/subscription/integration'], {
            queryParams: { required: 'true' },
          });
        }
        // All checks passed
        return true;
      }),
      catchError(() => of(this.router.createUrlTree(['/start/login'])))
    );
  }
}
