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
      this.transactionRef = params['tx_ref'] || null; // Assign transactionRef first

      if (!isNaN(queryPackageId) && this.transactionRef) {
        // Check if both are valid
        this.packageId = queryPackageId;
        this.processPayment();
      } else {
        // console.warn(
        //   'Package ID or Transaction Reference is missing in query parameters.'
        // );
        this.router.navigate(['/subscription']);
        return;
      }
    });
  }

  processPayment(): void {
    if (this.transactionRef && this.packageId) {
      const token = this.dataService.getAuthToken();
      if (token) {
        this.paymentService
          .verifyAndCreateSubscription(
            this.transactionRef,
            token,
            this.packageId
          )
          .subscribe({
            next: (response: any) => {
              this.isLoading = false;
              this.isSuccess = response.success === true;
              this.failureMessage = response.message || 'Unknown error';
              // console.log('Payment and subscription result:', response);
              if (response.success) {
                setTimeout(() => {
                  this.router.navigate(['/subscription/integration']);
                }, 5000);
              } else {
                this.failureMessage =
                  response.message || 'Payment verification failed.'; // Display backend message
                this.isSuccess = false;
              }
            },
            error: (error: any) => {
              this.isLoading = false;
              this.isSuccess = false;
              this.failureMessage =
                'An unexpected error occurred. Please try again.';
              // console.error('Error processing payment:', error);
              this.router.navigate(['/subscription-failed']);
            },
          });
      }
    } else {
      this.isLoading = false;
      // console.warn('Transaction reference or package ID is missing.');
      alert('Invalid payment information. Please try again.');
      this.router.navigate(['/subscription']);
    }
  }
}
