import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LocationService } from '../../../../app/core/services/location.service';
import { DataService } from '../../../../app/core/services/data.service';

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
    country: '',
    state: '',
  };

  companyEmail: string = 'Loading...';

  countries: string[] = [];
  states: string[] = [];
  loadingCountries = false;
  loadingStates = false;
  loadingCompanyData = false;

  private originalData = { ...this.companyData };

  constructor(
    private locationService: LocationService,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.loadCompanyData();
    this.loadCountries();

    const userData = this.dataService.getUserData();
    this.companyEmail = userData?.email || 'Unknown User';
  }

  loadCompanyData() {
    this.loadingCompanyData = true;
    const companyData = this.dataService.getCompanyData();

    if (companyData) {
      this.companyData = {
        companyName: companyData.companyName || '',
        companyType: companyData.companyType || '',
        // email: companyData.email || '',
        companyAddress: companyData.companyAddress || '',
        country: companyData.country || '',
        state: companyData.state || '',
      };
      this.originalData = { ...this.companyData };

      if (this.companyData.country) {
        this.loadStates(this.companyData.country);
      }

      // console.log('Company data loaded:', this.companyData);
    } else {
      // console.log('No company data found in localStorage');
    }

    this.loadingCompanyData = false;
  }

  loadCountries() {
    this.loadingCountries = true;
    this.locationService.getCountries().subscribe({
      next: (countries) => {
        this.countries = countries;
        this.loadingCountries = false;
      },
      error: (error) => {
        // console.error('Error loading countries:', error);
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
      next: (states) => {
        this.states = states;
        this.loadingStates = false;
        if (states.length > 0 && !states.includes(this.companyData.state)) {
          this.companyData.state = '';
        }
      },
      error: (error) => {
        // console.error('Error loading states:', error);
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
    // TODO: Implement when API endpoint is available
    // console.log('Update functionality not yet implemented');
    this.profileEdited.emit();
  }

  cancelEdit() {
    this.companyData = { ...this.originalData };
    // console.log('Edit cancelled, data restored');
    this.profileEdited.emit();
  }
}
