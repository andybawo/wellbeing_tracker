import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LocationService } from '../../../../app/core/services/location.service';

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
    name: 'Quocreo Technology Limited',
    type: 'Technology',
    email: 'Quocreo.ng@outlook.com',
    address: 'Nusaiba Towers, Ahmadu Bello Way',
    country: 'Nigeria',
    state: 'Abuja',
  };

  countries: string[] = [];
  states: string[] = [];
  loadingCountries = false;
  loadingStates = false;

  private originalData = { ...this.companyData };

  constructor(private locationService: LocationService) {}

  ngOnInit() {
    this.loadCountries();
    if (this.companyData.country) {
      this.loadStates(this.companyData.country);
    }
  }

  loadCountries() {
    this.loadingCountries = true;
    this.locationService.getCountries().subscribe({
      next: (countries) => {
        this.countries = countries;
        this.loadingCountries = false;
      },
      error: (error) => {
        console.error('Error loading countries:', error);
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
        console.error('Error loading states:', error);
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
    this.originalData = { ...this.companyData };
    console.log('Profile updated:', this.companyData);
    this.profileEdited.emit();
  }

  cancelEdit() {
    this.companyData = { ...this.originalData };
    console.log('Edit cancelled, data restored');
    this.profileEdited.emit();
  }
}
