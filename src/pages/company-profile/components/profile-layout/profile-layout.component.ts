import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepartmentComponent } from '../department/department.component';
import { RoleComponent } from '../role/role.component';
import { ProfileComponent } from "../profile/profile.component";

@Component({
  selector: 'app-profile-layout',
  imports: [CommonModule, DepartmentComponent, RoleComponent, ProfileComponent],
  templateUrl: './profile-layout.component.html',
  styleUrls: ['./profile-layout.component.scss'],
})
export class ProfileLayoutComponent {
  isClicked = false;

  currentTab: number = 0;
  activeTab: number = 0;
  showDepartmentModal = false;
  showRoleModal = false;

  changeTab(tab: number) {
    this.currentTab = tab;
    this.activeTab = tab;
  }

  onAddDepartment() {
    this.showDepartmentModal = true;
  }

  onDepartmentModalClose() {
    this.showDepartmentModal = false;
  }

  onDepartmentAdded() {
    this.showDepartmentModal = false;
  }

  onAddrole() {
    this.showRoleModal = true;
  }

  onRoleModalClose() {
    this.showRoleModal = false;
  }

  onRoleAdded() {
    this.showRoleModal = false;
  }
}
