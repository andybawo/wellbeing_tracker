import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../app/core/services/auth.service';
import { DataService } from '../../app/core/services/data.service';
import { LocationService } from '../../app/core/services/location.service';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../app/shared/shared.module';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-registration',
  imports: [RouterModule, ReactiveFormsModule, CommonModule, SharedModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent implements OnInit, AfterViewInit, OnDestroy {
  companyForm: FormGroup = new FormGroup({
    companyName: new FormControl('', [Validators.required]),
    companyType: new FormControl('', [Validators.required]),
    companyAddress: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
  });

  countries: string[] = [];
  states: string[] = [];
  isLoading: boolean = false;
  showAlert: boolean = false;
  alertMessage: string = '';
  alertType: 'success' | 'error' = 'success';

  private formSubscription?: Subscription;
  private countrySubscription?: Subscription;
  private readonly STORAGE_KEY = 'registrationCompanyData';

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private router: Router,
    private locationService: LocationService
  ) {}

  ngOnInit(): void {
    this.loadCountries();
    this.loadSavedCompanyData();
  }

  ngAfterViewInit(): void {
    // Save form data as user types (debounced)
    this.formSubscription = this.companyForm.valueChanges
      .pipe(debounceTime(300))
      .subscribe((value) => {
        this.saveCompanyData(value);
      });
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
    if (this.countrySubscription) {
      this.countrySubscription.unsubscribe();
    }
  }

  private loadCountries(): void {
    this.locationService.getCountries().subscribe((countries) => {
      this.countries = countries;

      this.setupCountryChangeSubscription();

      const savedData = this.getSavedCompanyData();
      if (savedData?.country) {
        this.loadStatesForCountry(savedData.country);
      }
    });
  }

  private setupCountryChangeSubscription(): void {
    this.countrySubscription = this.companyForm
      .get('country')
      ?.valueChanges.subscribe((selectedCountry) => {
        const currentState = this.companyForm.get('state')?.value;
        this.companyForm.get('state')?.setValue('');
        this.states = [];

        if (selectedCountry) {
          this.loadStatesForCountry(selectedCountry);
        }
      });
  }

  private loadStatesForCountry(country: string): void {
    this.locationService.getStatesByCountry(country).subscribe((states) => {
      this.states = states;

      // If there's saved state data, restore it after states are loaded
      const savedData = this.getSavedCompanyData();
      if (savedData?.state && states.includes(savedData.state)) {
        this.companyForm
          .get('state')
          ?.setValue(savedData.state, { emitEvent: false });
      }
    });
  }

  private getSavedCompanyData(): any {
    try {
      const savedData = localStorage.getItem(this.STORAGE_KEY);
      return savedData ? JSON.parse(savedData) : null;
    } catch (error) {
      console.error('Error getting saved company data:', error);
      return null;
    }
  }

  private loadSavedCompanyData(): void {
    try {
      const savedCompanyData = localStorage.getItem(this.STORAGE_KEY);
      if (savedCompanyData) {
        const companyData = JSON.parse(savedCompanyData);
        this.companyForm.patchValue(
          {
            companyName: companyData.companyName || '',
            companyType: companyData.companyType || '',
            companyAddress: companyData.companyAddress || '',
            country: companyData.country || '',
            state: companyData.state || '',
          },
          { emitEvent: false }
        );
      }
    } catch (error) {
      console.error('Error loading saved company data:', error);
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  private saveCompanyData(companyData: any): void {
    try {
      if (
        companyData.companyName ||
        companyData.companyType ||
        companyData.companyAddress ||
        companyData.country ||
        companyData.state
      ) {
        const dataToSave = {
          companyName: companyData.companyName || '',
          companyType: companyData.companyType || '',
          companyAddress: companyData.companyAddress || '',
          country: companyData.country || '',
          state: companyData.state || '',
        };
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dataToSave));
      }
    } catch (error) {
      console.error('Error saving company data:', error);
    }
  }

  closeModal() {
    this.isLoading = false;
  }

  onCompanyRegister() {
    if (this.companyForm.invalid) {
      this.showAlert = true;
      this.alertMessage = 'Please fill in all company details correctly.';
      this.alertType = 'error';
      setTimeout(() => {
        this.showAlert = false;
      }, 3000);
      return;
    }

    this.isLoading = true;
    const companyData = this.companyForm.value;
    this.dataService.setCompanyData(companyData);

    const userData = this.dataService.getUserData();
    if (!userData || !userData.emailAddress) {
      this.isLoading = false;
      this.showAlert = true;
      this.alertMessage = 'User data not found. Please signup again.';
      this.alertType = 'error';
      this.router.navigate(['/start/signup']);
      return;
    }

    this.authService.registerUser(userData).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.showAlert = true;
        this.alertMessage =
          'Company details saved. Please check your email to verify your account.';
        this.alertType = 'success';

        if (res && res.data) {
          this.dataService.setAuthToken(res.data);
        }

        setTimeout(() => {
          this.router.navigate(['/start/verify']);
        }, 1000);
      },
      error: (err) => {
        this.isLoading = false;
        this.showAlert = true;
        this.alertMessage =
          err.error?.message ||
          'Company registration failed. Please try again.';
        this.alertType = 'error';
      },
    });
  }

  // Method to clear saved data if needed
  public clearSavedData(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
