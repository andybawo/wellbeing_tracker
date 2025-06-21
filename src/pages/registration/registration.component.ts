import { Component } from '@angular/core';
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

@Component({
  selector: 'app-registration',
  imports: [RouterModule, ReactiveFormsModule, CommonModule, SharedModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent {
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
  showAlert: boolean = false; // Control alert visibility
  alertMessage: string = ''; // Alert message
  alertType: 'success' | 'error' = 'success'; // Alert typ

  closeModal() {
    this.isLoading = false;
  }

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private router: Router,
    private locationService: LocationService
  ) {
    this.locationService.getCountries().subscribe((countries) => {
      this.countries = countries;
    });

    this.companyForm
      .get('country')
      ?.valueChanges.subscribe((selectedCountry) => {
        this.companyForm.get('state')?.setValue('');
        this.states = [];
        if (selectedCountry) {
          this.locationService
            .getStatesByCountry(selectedCountry)
            .subscribe((states) => {
              this.states = states;
            });
        }
      });
  }

  onCompanyRegister() {
    // console.log('Company Form Value:', this.companyForm.value);
    if (this.companyForm.invalid) {
      // console.log('Company form is invalid');
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
        } else {
        }

        this.router.navigate(['/start/verify']);
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
}
