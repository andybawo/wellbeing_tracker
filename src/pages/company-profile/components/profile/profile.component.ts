import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LocationService } from '../../../../app/core/services/location.service';
import { DataService } from '../../../../app/core/services/data.service';
import { AuthService } from '../../../../app/core/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  imports: [CommonModule, FormsModule],
})
export class ProfileComponent implements OnInit {
  @Input() allowEdit = false;
  @Output() profileEdited = new EventEmitter<any>();

  companyData = {
    companyName: '',
    companyType: '',
    companyAddress: '',
    companyEmail: '',
    country: '',
    state: '',
  };

  countries: string[] = [];
  states: string[] = [];
  loadingCountries = false;
  loadingStates = false;
  loadingCompanyData = false;

  private originalData = { ...this.companyData };
  userEmail: string | null = null;

  constructor(
    private locationService: LocationService,
    private dataService: DataService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userEmail = this.authService.getUserEmail();
    this.loadCompanyData();
    this.loadCountries();
  }

  loadCompanyData() {
    this.loadingCompanyData = true;
    this.authService.getCompanyDetail().subscribe({
      next: (response: any) => {
        const data = response?.data;
        if (data) {
          this.companyData = {
            companyName: data.companyName || '',
            companyType: data.companyType || '',
            companyAddress: data.companyAddress || '',
            companyEmail: data.companyEmail || '',
            country: data.country || '',
            state: data.state || '',
          };
          this.originalData = { ...this.companyData };
          if (this.companyData.country) {
            this.loadStates(this.companyData.country);
          }
        }
        this.loadingCompanyData = false;
      },
      error: () => {
        this.loadingCompanyData = false;
      },
    });
  }

  loadCountries() {
    this.loadingCountries = true;
    this.locationService.getCountries().subscribe({
      next: (countries: string[]) => {
        this.countries = countries;
        this.loadingCountries = false;
      },
      error: (_error: any) => {
        this.loadingCountries = false;
        this.countries = ['Nigeria', 'Ghana', 'Kenya', 'South Africa'];
      },
    });
  }

  loadStates(country: string) {
    if (!country) {
      this.states = [];
      return;
    }
    this.loadingStates = true;
    this.locationService.getStatesByCountry(country).subscribe({
      next: (states: string[]) => {
        this.states = states;
        this.loadingStates = false;
        if (states.length > 0 && !states.includes(this.companyData.state)) {
          this.companyData.state = '';
        }
      },
      error: (_error: any) => {
        this.loadingStates = false;
        this.states = [];
      },
    });
  }

  onCountryChange() {
    this.companyData.state = '';
    this.loadStates(this.companyData.country);
  }

  saveChanges() {
    console.log('Before save - companyData:', this.companyData);
    console.log('Company email specifically:', this.companyData.companyEmail);

    this.authService.updateCompanyDetail(this.companyData).subscribe({
      next: (_res: any) => {
        this.originalData = { ...this.companyData };
        this.profileEdited.emit();
      },
      error: (_err: any) => {
        // Optionally show an error message
      },
    });
  }

  cancelEdit() {
    this.companyData = { ...this.originalData };
    this.profileEdited.emit();
  }
}
