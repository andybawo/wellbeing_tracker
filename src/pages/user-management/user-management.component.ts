import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../app/core/services/user.service';
import { User } from '../../app/interfaces/user-interface';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../app/shared/shared.module';
import { companyDepartment } from '../../app/interfaces/user-interface';
import { companyRole } from '../../app/interfaces/user-interface';
import { DepartmentService } from '../../app/core/services/department.service';
import { RoleService } from '../../app/core/services/role.service';

@Component({
  selector: 'app-user-management',
  imports: [CommonModule, FormsModule, RouterModule, SharedModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
})
export class UserManagementComponent implements OnInit {
  department: companyDepartment[] = [];
  role: companyRole[] = [];
  // Modal states
  isEditUSerOpen = false;
  isEditMode = false;
  isModalOpen = false;
  isWarningModalOpen = false;
  isSuccessModalOpen = false;
  showAlert = false;
  alertMessage = '';
  alertType: 'success' | 'error' = 'success';

  // User data
  users: User[] = [];
  currentUser: User | null = null;
  selectedUserForDelete: User | null = null;

  // Form data for adding user
  addUserForm = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    department: '',
    role: '',
  };

  // Form data for editing user
  editUserForm = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    department: '',
    role: '',
    status: 'Active' as 'Active' | 'Inactive',
  };

  // Available options
  // departments = ['IT', 'HR', 'Finance', 'Marketing', 'Operations'];
  // roles = ['Manager', 'HR', 'Project Manager', 'Developer', 'Analyst'];

  constructor(
    private userService: UserService,
    private departmentService: DepartmentService,
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.userService.users$.subscribe((users) => {
      this.users = users;
    });
    this.fetchDepartments();
    this.fetchRoles();
  }

  fetchDepartments() {
    this.departmentService.getAllDepartments().subscribe({
      next: (res) => {
        this.department = res.data || [];
      },
    });
  }

  fetchRoles() {
    this.roleService.getRole().subscribe({
      next: (res) => {
        this.role = res.data || [];
      },
    });
  }

  loadUsers(): void {
    this.users = this.userService.getAllUsers();
  }

  openWarning(user: User | null): void {
    if (!user) return;
    this.selectedUserForDelete = user;
    if (this.isEditUSerOpen) {
      this.closeEditUser();
    } else {
      this.closeModal();
    }
    this.isWarningModalOpen = true;
  }

  openSuccess(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.closeModal();
    this.isSuccessModalOpen = true;
  }

  openModal(): void {
    this.resetAddUserForm();
    this.closeModal();
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.isWarningModalOpen = false;
    this.isSuccessModalOpen = false;
  }

  closeEditUser(): void {
    this.isEditUSerOpen = false;
    this.isEditMode = false;
    this.currentUser = null;
  }

  openEditUser(user: User): void {
    this.currentUser = user;
    this.populateEditForm(user);
    this.isEditMode = false;
    this.isEditUSerOpen = true;
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
  }

  // Form methods
  resetAddUserForm(): void {
    this.addUserForm = {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      department: '',
      role: '',
    };
  }

  populateEditForm(user: User): void {
    this.editUserForm = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      department: user.department,
      role: user.role,
      status: user.status,
    };
  }

  addUser(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    if (
      !this.addUserForm.firstName ||
      !this.addUserForm.lastName ||
      !this.addUserForm.email ||
      !this.addUserForm.phoneNumber ||
      !this.addUserForm.department ||
      !this.addUserForm.role
    ) {
      this.showAlert = true;
      this.alertType = 'error';
      this.alertMessage = 'Please fill in all required field';
      setTimeout(() => {
        this.showAlert = false;
      }, 3000);
      return;
    }

    // Check if email already exists
    const existingUser = this.users.find(
      (user) => user.email === this.addUserForm.email
    );
    if (existingUser) {
      this.showAlert = true;
      this.alertType = 'error';
      this.alertMessage = 'User with this Email Address already exists';
      setTimeout(() => {
        this.showAlert = false;
      }, 3000);
      return;
    }

    try {
      this.userService.addUser(this.addUserForm);
      this.openSuccess();
      this.resetAddUserForm();
    } catch (error) {
      this.showAlert = true;
      this.alertType = 'error';
      this.alertMessage = 'User with this Email Address already exists';
      setTimeout(() => {
        this.showAlert = false;
      }, 3000);
      return;
    }
  }

  updateUser(): void {
    if (!this.currentUser) return;

    // Basic validation
    if (
      !this.editUserForm.firstName ||
      !this.editUserForm.lastName ||
      !this.editUserForm.email ||
      !this.editUserForm.phoneNumber ||
      !this.editUserForm.department ||
      !this.editUserForm.role
    ) {
      this.showAlert = true;
      this.alertType = 'error';
      this.alertMessage = 'User with this Email Address already exists';
      setTimeout(() => {
        this.showAlert = false;
      }, 3000);
      return;
    }

    const existingUser = this.users.find(
      (user) =>
        user.email === this.editUserForm.email &&
        user.id !== this.currentUser?.id
    );
    if (existingUser) {
      this.showAlert = true;
      this.alertType = 'error';
      this.alertMessage = 'User with this Email Address already exists';
      setTimeout(() => {
        this.showAlert = false;
      }, 3000);
      return;
    }

    try {
      const success = this.userService.updateUser(
        this.currentUser.id,
        this.editUserForm
      );
      if (success) {
        this.closeEditUser();
        this.openSuccess();
      } else {
        this.showAlert = true;
        this.alertType = 'error';
        this.alertMessage = 'There was an error updating user';
        setTimeout(() => {
          this.showAlert = false;
        }, 3000);
        return;
      }
    } catch (error) {
      this.showAlert = true;
      this.alertType = 'error';
      this.alertMessage = 'There was an error updating user';
      setTimeout(() => {
        this.showAlert = false;
      }, 3000);
      return;
    }
  }

  deleteUser(): void {
    if (!this.selectedUserForDelete) return;

    try {
      const success = this.userService.deleteUser(
        this.selectedUserForDelete.id
      );
      if (success) {
        this.closeModal();
        this.selectedUserForDelete = null;
      } else {
        this.showAlert = true;
        this.alertType = 'error';
        this.alertMessage = 'Error deleting user please try again';
        setTimeout(() => {
          this.showAlert = false;
        }, 3000);
        return;
      }
    } catch (error) {
      alert('Error deleting user. Please try again.');
    }
  }

  deactivateUser(): void {
    if (!this.currentUser) return;

    try {
      const success = this.userService.deactivateUser(this.currentUser.id);
      if (success) {
        this.closeEditUser();
      } else {
        this.showAlert = true;
        this.alertType = 'error';
        this.alertMessage = 'User with this Email Address already exists';
        setTimeout(() => {
          this.showAlert = false;
        }, 3000);
        return;
      }
    } catch (error) {
      alert('Error deactivating user. Please try again.');
    }
  }

  getUserFullName(user: User): string {
    return `${user.firstName} ${user.lastName}`;
  }

  formatDate(date: Date): string {
    if (!date) return '';

    const dateObj = date instanceof Date ? date : new Date(date);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  getStatusClass(status: string): string {
    return status === 'Active' ? 'status-active' : 'status-inactive';
  }
}
