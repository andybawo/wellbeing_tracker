import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [FormsModule, CommonModule],
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
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

  setActiveTab(tab: string) {
    this.activeTab = tab;
    this.isEditing = false;
  }

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