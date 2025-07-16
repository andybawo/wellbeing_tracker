import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ModalComponent } from '../../app/shared/modal/modal.component';
import { PackagesService } from '../../app/core/services/packages.service';
import { Data, Router, RouterModule } from '@angular/router';
import { environment } from '../../environments/environment';
import { AuthService } from '../../app/core/services/auth.service';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { PaymentService } from '../../app/core/services/payment.service';
import { DataService } from '../../app/core/services/data.service';
import {
  PaystackPaymentInitiationResponse,
  FlutterwavePaymentInitiationResponse,
} from '../../app/interfaces/payment-response';

import { registerLocaleData } from '@angular/common';
import localeNg from '@angular/common/locales/en-NG';
registerLocaleData(localeNg, 'ng');

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [CommonModule, ModalComponent, RouterModule],
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss'],
})
export class SubscriptionComponent implements OnInit {
  isClicked = false;
  isYearClicked = false;
  isModalOpen = false;
  isLoading: boolean = false;
  isLoadingpayment: boolean = false;
  isLoadingFreeTrial: boolean = false;

  packages: any[] = [];
  monthlyPackages: any[] = [];
  yearlyPackages: any[] = [];

  selectedPackage: string | null = null;
  selectedGateway: 'paystack' | 'flutterwave' | null = null;

  constructor(
    private packagesService: PackagesService,
    private router: Router,
    private authService: AuthService,
    private http: HttpClient,
    private paymentService: PaymentService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.loadPackages();
  }

  loadPackages(): void {
    this.packagesService.getPackages().subscribe({
      next: (response) => {
        this.isLoading = false;
        this.packages = response.data;
        this.filterPackages();
      },
      error: (error) => {
        alert('Failed to load packages. Please try again.');
      },
    });
  }

  filterPackages(): void {
    this.monthlyPackages = this.packages.filter(
      (pkg) =>
        pkg.durationInDays === 30 && !pkg.name.toLowerCase().includes('yearly')
    );

    this.yearlyPackages = this.packages.filter(
      (pkg) =>
        pkg.durationInDays === 365 ||
        pkg.name.toLowerCase().includes('yearly') ||
        pkg.name.toLowerCase() === 'free trial'
    );
  }

  openYear(): void {
    this.isYearClicked = true;
  }

  closeYear(): void {
    this.isYearClicked = false;
  }

  selectPackageDiv(packageName: string): void {
    this.selectedPackage = packageName;
  }

  selectPlan(packageName: string): void {
    this.selectedPackage = packageName;

    const selectedPackageData = this.packages.find(
      (pkg) => pkg.name?.toLowerCase() === packageName
    );

    if (selectedPackageData && selectedPackageData.id) {
      this.packagesService.setPackageId(selectedPackageData.id);

      if (packageName.toLowerCase() === 'free trial') {
        this.createFreeTrialSubscription(selectedPackageData.id);
      } else {
        this.openModal();
      }
    } else {
      alert('Error: Could not find package information.');
    }
  }

  createFreeTrialSubscription(packageId: string): void {
    const token = this.dataService.getAuthToken();

    if (!token) {
      alert('You are not authenticated. Please complete registration process.');
      this.router.navigate(['/start/signup']);
      return;
    }

    this.isLoadingFreeTrial = true;

    const numericPackageId = parseInt(packageId, 10);

    if (isNaN(numericPackageId)) {
      this.isLoadingFreeTrial = false;
      alert('Error: Invalid package ID. Please select a valid plan.');
      return;
    }

    this.paymentService.newSubscription(numericPackageId, token).subscribe({
      next: (response: any) => {
        this.isLoadingFreeTrial = false;

        const isSuccessful =
          response.success === true ||
          response.status === true ||
          response.status === 'true';

        if (isSuccessful) {
          this.router.navigate(['/subscription/sub-successful'], {
            queryParams: {
              packageId: numericPackageId,
              tx_ref: 'free-trial-' + Date.now(),
              isFreeTrialSuccess: 'true', // Special flag to indicate this is a free trial
            },
          });
        } else {
          alert(
            response.message || 'Failed to create free trial subscription.'
          );
        }
      },
      error: (error) => {
        this.isLoadingFreeTrial = false;
        alert(
          'Error: Failed to create free trial subscription. Please try again.'
        );
      },
    });
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  initiatePaymentLinkRequest(): void {
    if (!this.selectedGateway) {
      alert('Please select a payment method');
      return;
    }

    const selectedPackageData = this.packages.find(
      (pkg) => pkg.name?.toLowerCase() === this.selectedPackage
    );

    if (selectedPackageData && selectedPackageData.id) {
      const packageId = parseInt(selectedPackageData.id, 10);
      this.isLoadingpayment = true;

      const token = this.dataService.getAuthToken();

      if (!token) {
        this.isLoadingpayment = false;
        alert(
          'You are not authenticated. Please complete registration process.'
        );
        this.router.navigate(['/start/signup']);
        return;
      }

      if (isNaN(packageId)) {
        this.isLoadingpayment = false;
        alert('Error: Invalid package ID. Please select a valid plan.');
        return;
      }

      this.paymentService
        .initiatePayment(this.selectedGateway, packageId, token)
        .subscribe({
          next: (response: any) => {
            let paymentUrl: string | undefined;

            if (this.selectedGateway === 'paystack' && response?.data) {
              paymentUrl = (
                response.data as PaystackPaymentInitiationResponse['data']
              )?.authorization_url;
            } else if (
              this.selectedGateway === 'flutterwave' &&
              response?.data
            ) {
              paymentUrl = (
                response.data as FlutterwavePaymentInitiationResponse['data']
              )?.link;
            }

            if (paymentUrl) {
              setTimeout(() => {
                window.location.href = paymentUrl;
              }, 500);
            } else {
              this.isLoadingpayment = false;
              alert(
                'Error: Could not retrieve the payment URL. Please try again.'
              );
            }
          },
          error: (error) => {
            this.isLoadingpayment = false;
            alert('Error: Failed to initiate payment. Please try again.');
          },
        });
    } else {
      alert('Error: Could not process the selected plan.');
    }
  }

  setPaymentGateway(gateway: 'paystack' | 'flutterwave') {
    this.selectedGateway = gateway;
    this.closeModal();
    this.isLoadingpayment = true;

    setTimeout(() => {
      this.initiatePaymentLinkRequest();
    }, 100);
  }

  get transformedMonthlyPackages() {
    return this.monthlyPackages.map((pkg) => this.transformPackage(pkg));
  }

  get transformedYearlyPackages() {
    return this.yearlyPackages.map((pkg) => this.transformPackage(pkg));
  }

  private transformPackage(pkg: any) {
    const transformed = { ...pkg };

    switch (pkg.name?.toLowerCase()) {
      case 'free trial':
        transformed.displayName = 'Starter';
        transformed.displayPrice = 'Free';
        transformed.customText = '30 days free trial';
        break;
      case 'basic':
        transformed.displayName = 'Basic';
        transformed.customText = 'Save 5% on annual subscription';
        break;
      case 'pro':
        transformed.displayName = 'Pro';
        transformed.customText = 'Save 10% on annual subscription';
        break;
      case 'enterprise':
        transformed.displayName = 'Enterprise';
        transformed.customText = 'Save 20% on annual subscription';
        break;
      default:
        transformed.displayName = pkg.name;
        transformed.displayPrice = null;
        transformed.customText = '';
    }

    return transformed;
  }
}
