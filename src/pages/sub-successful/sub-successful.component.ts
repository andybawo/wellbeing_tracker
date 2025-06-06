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
      // console.log('=== DEBUGGING QUERY PARAMS ===');
      // console.log('All query parameters:', params);
      // console.log('Raw tx_ref:', params['tx_ref']);
      // console.log('Type of tx_ref:', typeof params['tx_ref']);
      // console.log('Is tx_ref an array?', Array.isArray(params['tx_ref']));
      const queryPackageId = parseInt(params['packageId'], 10);
      let rawTransactionRef =
        params['tx_ref'] ||
        params['reference'] ||
        params['trxref'] ||
        params['transaction_id'] ||
        null;

      // console.log('Raw transaction reference:', rawTransactionRef);
      // console.log('Extracted package ID:', queryPackageId);

      // Handle cases where the parameter might be an array or comma-separated string
      if (rawTransactionRef) {
        if (Array.isArray(rawTransactionRef)) {
          // If it's an array, take the first element
          this.transactionRef = rawTransactionRef[0];
          // console.log(
          //   'Transaction ref was array, using first element:',
          //   this.transactionRef
          // );
        } else if (
          typeof rawTransactionRef === 'string' &&
          rawTransactionRef.includes(',')
        ) {
          // If it's a comma-separated string, take the first part
          this.transactionRef = rawTransactionRef.split(',')[0].trim();
          // console.log(
          //   'Transaction ref was comma-separated, using first part:',
          //   this.transactionRef
          // );
        } else {
          // It's a clean string
          this.transactionRef = rawTransactionRef.trim();
        }
      } else {
        this.transactionRef = null;
      }

      // console.log('Final cleaned transaction reference:', this.transactionRef);

      // Now check if both packageId and transactionRef are valid
      if (!isNaN(queryPackageId) && this.transactionRef) {
        this.packageId = queryPackageId;
        this.processPayment();
      } else {
        // console.warn(
        //   'Package ID or Transaction Reference is missing in query parameters.',
        //   { packageId: queryPackageId, transactionRef: this.transactionRef }
        // );
        this.router.navigate(['/subscription']);
        return;
      }
    });
  }

  processPayment(): void {
    if (this.transactionRef && this.packageId) {
      let cleanRef = this.transactionRef;
      if (cleanRef.includes(',')) {
        cleanRef = cleanRef.split(',')[0].trim();
        // console.log(
        //   'processPayment: Further cleaned ref from',
        //   this.transactionRef,
        //   'to',
        //   cleanRef
        // );
        this.transactionRef = cleanRef; // Update the instance variable
      }
      const token = this.dataService.getAuthToken();
      if (token) {
        // console.log('Processing payment with:', {
        //   transactionRef: this.transactionRef,
        //   packageId: this.packageId,
        //   token: token ? 'Present' : 'Missing',
        // });
        this.paymentService
          .verifyAndCreateSubscription(
            this.transactionRef,
            token,
            this.packageId
          )
          .subscribe({
            next: (response: any) => {
              this.isLoading = false;
              this.failureMessage = response.message || 'Unknown error';
              // console.log('Payment and subscription result:', response);
              const isSuccessful =
                response.success === true ||
                response.status === true ||
                response.status === 'true';
              this.isSuccess = isSuccessful;

              if (isSuccessful) {
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
