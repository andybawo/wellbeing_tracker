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
    console.log('ngOnInit: Initial packages value:', this.packages);
    this.isLoading = true;

    this.loadPackages();
  }

  loadPackages(): void {
    this.packagesService.getPackages().subscribe({
      next: (response) => {
        this.isLoading = false;

        console.log('loadPackages: Data from service:', response);
        this.packages = response.data;
        console.log('Packages loaded:', this.packages);

        this.filterPackages();
      },
      error: (error) => {
        console.error('Error loading packages:', error);
        alert('Failed to load packages. Please try again.');
      },
    });
  }

  filterPackages(): void {
    // Filter monthly packages (30 days duration and no "Yearly" in name)
    this.monthlyPackages = this.packages.filter(
      (pkg) =>
        pkg.durationInDays === 30 && !pkg.name.toLowerCase().includes('yearly')
    );

    // Filter yearly packages (365 days duration or "Yearly" in name)
    this.yearlyPackages = this.packages.filter(
      (pkg) =>
        pkg.durationInDays === 365 || pkg.name.toLowerCase().includes('yearly')
    );

    console.log('Monthly packages:', this.monthlyPackages);
    console.log('Yearly packages:', this.yearlyPackages);
  }

  openYear(): void {
    this.isYearClicked = true;
  }

  closeYear(): void {
    this.isYearClicked = false;
  }

  selectPackageDiv(packageName: string): void {
    this.selectedPackage = packageName;
    console.log('Selected package div:', this.selectedPackage);
  }

  selectPlan(packageName: string): void {
    this.selectedPackage = packageName;
    console.log('Selected package', this.selectedPackage);

    const selectedPackageData = this.packages.find(
      (pkg) => pkg.name?.toLowerCase() === packageName
    );

    if (selectedPackageData && selectedPackageData.id) {
      console.log('Selected package ID:', selectedPackageData.id); // Add logging here

      this.packagesService.setPackageId(selectedPackageData.id);
      this.openModal();
    } else {
      console.error('Package ID not found for package name:', packageName);
      alert('Error: Could not find package information.');
    }
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  initiatePaymentLinkRequest(): void {
    if (!this.selectedGateway) {
      console.warn('Payment gateway not selected.');
      alert('Please select a payment method');
      return;
    }
    const selectedPackageData = this.packages.find(
      (pkg) => pkg.name?.toLowerCase() === this.selectedPackage
    );

    if (selectedPackageData && selectedPackageData.id) {
      const packageId = parseInt(selectedPackageData.id, 10);
      this.isLoadingpayment = true;

      console.log('Package ID before sending:', packageId); // Log packageId

      const token = this.dataService.getAuthToken();
      console.log('Token before sending:', token); // Log token

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
        console.error('Invalid package ID:', selectedPackageData.id);
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
              console.log('Redirecting to payment URL:', paymentUrl);
              setTimeout(() => {
                window.location.href = paymentUrl;
              }, 500);
            } else {
              this.isLoadingpayment = false;
              console.error('Payment URL not found in the response:', response);
              alert(
                'Error: Could not retrieve the payment URL. Please try again.'
              );
            }
          },
          error: (error) => {
            // Only set to false on error
            this.isLoadingpayment = false;
            console.error('Payment initiation error:', error);
            alert('Error: Failed to initiate payment. Please try again.');
          },
        });
    } else {
      console.warn('Could not find package ID for:', this.selectedPackage);
      alert('Error: Could not process the selected plan.');
    }
  }
  setPaymentGateway(gateway: 'paystack' | 'flutterwave') {
    this.selectedGateway = gateway;
    console.log('Selected payment gateway:', this.selectedGateway); // Add logging here

    this.closeModal();

    this.isLoadingpayment = true;

    setTimeout(() => {
      this.initiatePaymentLinkRequest();
    }, 100);
    // Call the payment initiation here
  }
}
