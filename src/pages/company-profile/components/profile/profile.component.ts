import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss',
    imports: [CommonModule, ReactiveFormsModule, FormsModule],
})
export class ProfileComponent {
  isEditing = false;
  activeTab = 'profile';
  
  companyData = {
    name: 'Quocreo Technology Limited',
    type: 'Technology',
    email: 'Quocreo.ng@outlook.com',
    address: 'Nusaiba Towers, Ahmadu Bello Way',
    country: 'Nigeria',
    state: 'Abuja'
  };

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  saveChanges() {
    this.isEditing = false;
    console.log('Saving changes:', this.companyData);
  }

  cancelEdit() {
    this.isEditing = false;
  }
}