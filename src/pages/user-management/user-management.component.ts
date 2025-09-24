import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  FormGroup,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { UserService } from '../../app/core/services/user.service';
import {
  User,
  UserApiResponse,
  EditRequestWrapper,
  CompanyUsersApiResponse,
} from '../../app/interfaces/user-interface';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../app/shared/shared.module';
import { companyDepartment } from '../../app/interfaces/user-interface';
import { companyRole } from '../../app/interfaces/user-interface';
import { DepartmentService } from '../../app/core/services/department.service';
import { RoleService } from '../../app/core/services/role.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-management',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SharedModule,
    ReactiveFormsModule,
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
})
export class UserManagementComponent implements OnInit, OnDestroy {
  department: companyDepartment[] = [];
  role: companyRole[] = [];
  // Modal states
  isEditUSerOpen = false;
  isEditMode = false;
  isModalOpen = false;
  isWarningModalOpen = false;
  isSuccessModalOpen = false;
  successMessage = '';
  showAlert = false;
  alertMessage = '';
  alertType: 'success' | 'error' = 'success';
  isButtonLoading: boolean = false;

  // User data
  users: User[] = [];
  currentUser: User | null = null;
  selectedUserForDelete: User | null = null;
  private userSubscription?: Subscription;

  userForm: FormGroup;
  userFormUpdate: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private departmentService: DepartmentService,
    private roleService: RoleService
  ) {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      emailAddress: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      departmentId: [''],
      roleId: ['', [Validators.required]],
    });
    this.userFormUpdate = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      emailAddress: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      departmentId: [''],
      roleId: [''],
      isActive: true,
    });
  }

  ngOnInit() {
    this.fetchDepartments();
    this.fetchRoles();
    this.fetchUsers();
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
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

  fetchUsers() {
    this.userSubscription = this.departmentService.getAllCompUsers().subscribe({
      next: (res: CompanyUsersApiResponse) => {
        this.users = (res.data || []).map((u) => {
          const [firstName, ...rest] = (u.fullName || '').split(' ');
          return {
            ...u,
            firstName,
            lastName: rest.join(' '),
            isActive: u.isActive !== undefined ? u.isActive : true,
          };
        });
      },
      error: (err) => {},
    });
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

  showSuccessModal(message: string) {
    this.successMessage = message;
    this.isSuccessModalOpen = true;
    this.isEditUSerOpen = false;
    this.isModalOpen = false;
    this.isWarningModalOpen = false;
  }

  openModal(): void {
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
    this.isEditMode = false;
    this.isEditUSerOpen = true;

    // Patch the form with the selected user's data
    this.userFormUpdate.patchValue({
      firstName: user.firstName ?? user.fullName?.split(' ')[0] ?? '',
      lastName:
        user.lastName ?? user.fullName?.split(' ').slice(1).join(' ') ?? '',
      emailAddress: user.emailAddress,
      phoneNumber: user.phoneNumber || '',
      departmentId: user.departmentId || '',
      roleId: user.roleId || '',
      isActive: user.isActive ?? true,
    });
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) {
      this.userFormUpdate.enable();
    } else {
      this.userFormUpdate.disable();
    }
  }

  addUser() {
    if (this.userForm.valid) {
      this.isButtonLoading = true;
      const payload = {
        firstName: this.userForm.value.firstName,
        lastName: this.userForm.value.lastName,
        emailAddress: this.userForm.value.emailAddress,
        phoneNumber: this.userForm.value.phoneNumber,
        departmentId: this.userForm.value.departmentId,
        roleId: this.userForm.value.roleId || '',
      };
      this.userService.addUser(this.userForm.value).subscribe({
        next: (res) => {
          this.showSuccessModal('User added successfully');
          this.isButtonLoading = false;
          this.fetchUsers();
        },
        error: (err) => {
          this.isButtonLoading = false;

          this.showAlert = true;
          this.alertMessage = err?.error?.message || 'An error occurred.';
          this.alertType = 'error';
          setTimeout(() => {
            this.showAlert = false;
          }, 3000);
        },
      });
    }
  }

  updateUser() {
    if (this.userFormUpdate.valid && this.currentUser) {
      this.isButtonLoading = true;
      const updatePayload = {
        userId: this.currentUser.id,
        firstName: this.userFormUpdate.value.firstName,
        lastName: this.userFormUpdate.value.lastName,
        emailAddress: this.userFormUpdate.value.emailAddress,
        phoneNumber: this.userFormUpdate.value.phoneNumber,
        departmentId: this.userFormUpdate.value.departmentId,
        roleId: this.userFormUpdate.value.roleId,
        isActive: this.userFormUpdate.value.isActive,
      };
      this.userService.updateUser(updatePayload).subscribe({
        next: (res) => {
          this.showSuccessModal('User updated successfully');
          this.isButtonLoading = false;
          this.fetchUsers();
        },
        error: (err) => {
          this.isButtonLoading = false;
          this.showAlert = true;
          this.alertMessage = err?.error?.message || 'An error occurred.';
          this.alertType = 'error';
          setTimeout(() => {
            this.showAlert = false;
          }, 3000);
        },
      });
    }
  }

  deleteUser() {
    const user = this.selectedUserForDelete;
    if (user) {
      this.isButtonLoading = true;

      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          this.isButtonLoading = false;
          this.closeModal();
          this.users = this.users.filter((u) => u.id !== user.id);
          this.showSuccessModal('User deleted successfully');
        },
        error: (err) => {
          this.isButtonLoading = false;

          this.showAlert = true;
          this.alertMessage = err?.error?.message || 'Failed to delete user.';
          this.alertType = 'error';
          setTimeout(() => (this.showAlert = false), 3000);
        },
      });
    }
  }

  getUserFullName(user: User): string {
    return (
      user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim()
    );
  }

  formatDate(date: Date): string {
    if (!date) return '';

    const dateObj = date instanceof Date ? date : new Date(date);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  getStatusClass(isActive?: boolean): string {
    if (isActive === undefined) return '';
    return isActive ? 'status-active' : 'status-inactive';
  }

  getRoleName(roleId?: string): string {
    if (!roleId) return '';
    const found = this.role.find((r) => r.roleId === roleId);
    return found ? found.roleName : roleId;
  }

  // deactivateUser(event: Event) {
  //   event.preventDefault();
  //   this.userFormUpdate.patchValue({ isActive: false });
  // }

  toggleActiveStatus(event: Event) {
    event.preventDefault();
    const current = this.userFormUpdate.value.isActive;
    this.userFormUpdate.patchValue({ isActive: !current });
  }
}
