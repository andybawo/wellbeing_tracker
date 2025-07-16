import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../app/core/services/user.service';
import { User } from '../../app/interfaces/user-interface';

@Component({
  selector: 'app-user-management',
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
})
export class UserManagementComponent implements OnInit {
  // Modal states
  isEditUSerOpen = false;
  isModalOpen = false;
  isWarningModalOpen = false;
  isSuccessModalOpen = false;

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
  departments = ['IT', 'HR', 'Finance', 'Marketing', 'Operations'];
  roles = ['Manager', 'HR', 'Project Manager', 'Developer', 'Analyst'];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
    this.userService.users$.subscribe((users) => {
      this.users = users;
    });
  }

  loadUsers(): void {
    this.users = this.userService.getAllUsers();
  }

  openWarning(user: User): void {
    this.selectedUserForDelete = user;
    this.closeModal();
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
    this.currentUser = null;
  }

  openEditUser(user: User): void {
    this.currentUser = user;
    this.populateEditForm(user);
    this.isEditUSerOpen = true;
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
      alert('Please fill in all required fields');
      return;
    }

    // Check if email already exists
    const existingUser = this.users.find(
      (user) => user.email === this.addUserForm.email
    );
    if (existingUser) {
      alert('User with this email already exists');
      return;
    }

    try {
      this.userService.addUser(this.addUserForm);
      this.openSuccess();
      this.resetAddUserForm();
    } catch (error) {
      alert('Error adding user. Please try again.');
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
      alert('Please fill in all required fields');
      return;
    }

    const existingUser = this.users.find(
      (user) =>
        user.email === this.editUserForm.email &&
        user.id !== this.currentUser?.id
    );
    if (existingUser) {
      alert('User with this email already exists');
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
        alert('Error updating user. Please try again.');
      }
    } catch (error) {
      alert('Error updating user. Please try again.');
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
        alert('Error deleting user. Please try again.');
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
        alert('Error deactivating user. Please try again.');
      }
    } catch (error) {
      alert('Error deactivating user. Please try again.');
    }
  }

  getUserFullName(user: User): string {
    return `${user.firstName} ${user.lastName}`;
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString();
  }

  getStatusClass(status: string): string {
    return status === 'Active' ? 'status-active' : 'status-inactive';
  }
}
