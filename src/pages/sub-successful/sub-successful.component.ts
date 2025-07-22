import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  RouterLink,
  RouterModule,
  Router,
  ActivatedRoute,
} from '@angular/router';
import { AuthService } from '../../app/core/services/auth.service';
import { PaymentService } from '../../app/core/services/payment.service';
import { PackagesService } from '../../app/core/services/packages.service';
import { DataService } from '../../app/core/services/data.service';

@Component({
  selector: 'app-sub-successful',
  imports: [CommonModule, RouterModule],
  templateUrl: './sub-successful.component.html',
  styleUrl: './sub-successful.component.scss',
})
export class SubSuccessfulComponent implements OnInit {
  transactionRef: string | null = null;
  packageId: number;
  isLoading: boolean = true;
  isSuccess: boolean = false;
  failureMessage: string = '';
  isFreeTrialSuccess: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private packagesService: PackagesService,
    private authService: AuthService,
    private dataService: DataService
  ) {
    this.packageId = 1;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const queryPackageId = parseInt(params['packageId'], 10);
      let rawTransactionRef =
        params['tx_ref'] ||
        params['reference'] ||
        params['trxref'] ||
        params['transaction_id'] ||
        null;

      this.isFreeTrialSuccess = params['isFreeTrialSuccess'] === 'true';

      if (rawTransactionRef) {
        if (Array.isArray(rawTransactionRef)) {
          this.transactionRef = rawTransactionRef[0];
        } else if (
          typeof rawTransactionRef === 'string' &&
          rawTransactionRef.includes(',')
        ) {
          this.transactionRef = rawTransactionRef.split(',')[0].trim();
        } else {
          this.transactionRef = rawTransactionRef.trim();
        }
      } else {
        this.transactionRef = null;
      }

      // Check if we have valid packageId
      if (isNaN(queryPackageId)) {
        this.isLoading = false;
        this.failureMessage = 'Invalid package information';
        return;
      }

      this.packageId = queryPackageId;

      if (this.isFreeTrialSuccess) {
        this.handleFreeTrialSuccess();
      } else if (this.transactionRef) {
        this.processPayment();
      } else {
        this.isLoading = false;
        this.failureMessage = 'No transaction reference found';
        setTimeout(() => {
          this.router.navigate(['/subscription']);
        }, 3000);
      }
    });
  }

  handleFreeTrialSuccess(): void {
    setTimeout(() => {
      this.isLoading = false;
      this.isSuccess = true;

      setTimeout(() => {
        this.router.navigate(['/subscription/integration']);
      }, 5000);
    }, 2000);
  }

  processPayment(): void {
    if (!this.transactionRef || !this.packageId) {
      this.isLoading = false;
      this.failureMessage = 'Invalid payment information';
      return;
    }

    let cleanRef = this.transactionRef;
    if (cleanRef.includes(',')) {
      cleanRef = cleanRef.split(',')[0].trim();
      this.transactionRef = cleanRef;
    }

    const token = this.dataService.getAuthToken();
    if (!token) {
      this.isLoading = false;
      this.failureMessage =
        'Authentication token not found. Please login again.';
      setTimeout(() => {
        this.router.navigate(['/start/signin']);
      }, 3000);
      return;
    }

    const timeoutId = setTimeout(() => {
      if (this.isLoading) {
        this.isLoading = false;
        this.failureMessage =
          'Payment verification timed out. Please contact support.';
      }
    }, 30000);

    this.paymentService
      .verifyAndCreateSubscription(this.transactionRef, token, this.packageId)
      .subscribe({
        next: (response: any) => {
          clearTimeout(timeoutId);

          this.isLoading = false;

          const isSuccessful =
            response.success === true ||
            response.status === true ||
            response.status === 'true';

          if (isSuccessful) {
            this.isSuccess = true;
            this.failureMessage = '';

            setTimeout(() => {
              this.router.navigate(['/subscription/integration']);
            }, 5000);
          } else {
            this.failureMessage =
              response.message || 'Payment verification failed.';
            this.isSuccess = false;

            setTimeout(() => {
              this.router.navigate(['/subscription']);
            }, 5000);
          }
        },
        error: (error: any) => {
          clearTimeout(timeoutId);

          this.isLoading = false;
          this.isSuccess = false;

          if (error.status === 0) {
            this.failureMessage =
              'Network error. Please check your connection and try again.';
          } else if (error.status === 401) {
            this.failureMessage = 'Authentication failed. Please login again.';
            setTimeout(() => {
              this.router.navigate(['/start/signin']);
            }, 3000);
            return;
          } else if (error.status >= 500) {
            this.failureMessage =
              'Server error. Please try again later or contact support.';
          } else {
            this.failureMessage =
              error.message ||
              'An unexpected error occurred. Please try again.';
          }

          setTimeout(() => {
            this.router.navigate(['/subscription']);
          }, 5000);
        },
      });
  }
}
