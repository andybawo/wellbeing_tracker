import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnDestroy,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  companyRole,
  RoleApiResponse,
} from '../../../../app/interfaces/user-interface';
import { CommonModule } from '@angular/common';
import { RoleService } from '../../../../app/core/services/role.service';
import { Subscription } from 'rxjs';
import { SharedModule } from '../../../../app/shared/shared.module';
import { InsythaSkeletonLoaderComponent } from '../../../../app/shared/components/insytha-skeleton-loader/insytha-skeleton-loader.component';

interface PermissionOption {
  value: string;
  label: string;
  selected: boolean;
}

interface PermissionCategory {
  name: string;
  options: PermissionOption[];
  isOpen: boolean;
}

@Component({
  selector: 'app-role',
  imports: [CommonModule, ReactiveFormsModule, InsythaSkeletonLoaderComponent],
  templateUrl: './role.component.html',
  styleUrl: './role.component.scss',
})
export class RoleComponent implements OnInit, OnDestroy {
  role: companyRole[] = [];
  currentRole: companyRole | null = null;
  selectedRoleForDelete: companyRole | null = null;
  private roleSubscription?: Subscription;

  @Input() showModal = false;
  @Output() modalClosed = new EventEmitter<void>();
  @Output() roleAdded = new EventEmitter<any>();
  @Output() roleUpdated = new EventEmitter<companyRole>();
  @Output() roleDeleted = new EventEmitter<string>();

  isEditModal = false;
  isDeleteModal = false;
  isSuccessModal = false;
  isButtonLoading = false;
  successMessage = '';
  roleForm: FormGroup;
  loadingData = true;

  // Permission categories with checkbox
  permissionCategories: PermissionCategory[] = [
    {
      name: 'User Management',
      isOpen: false,
      options: [
        { value: 'user-create', label: 'Create', selected: false },
        { value: 'user-edit', label: 'Edit', selected: false },
        { value: 'user-delete', label: 'Delete', selected: false },
      ],
    },
    {
      name: 'Subscription',
      isOpen: false,
      options: [
        { value: 'sub-buy-plan', label: 'Buy Plan', selected: false },
        { value: 'sub-configure', label: 'Configure', selected: false },
      ],
    },
    {
      name: 'Integration',
      isOpen: false,
      options: [
        { value: 'int-add-tool', label: 'Add Tool', selected: false },
        {
          value: 'int-activate',
          label: 'Activate/Deactivate',
          selected: false,
        },
      ],
    },
    {
      name: 'Alert',
      isOpen: false,
      options: [
        { value: 'alert-custom', label: 'Custom', selected: false },
        { value: 'alert-configure', label: 'Configure', selected: false },
      ],
    },
  ];

  constructor(private fb: FormBuilder, private roleService: RoleService) {
    this.roleForm = this.fb.group({
      roleName: ['', [Validators.required, Validators.minLength(2)]],
      roleDescription: ['', [Validators.required, Validators.minLength(2)]],
      permissions: [''],
    });
  }

  ngOnInit() {
    this.fetchRoles();
  }

  ngOnDestroy() {
    if (this.roleSubscription) {
      this.roleSubscription.unsubscribe();
    }
  }

  fetchRoles() {
    this.loadingData = true;
    this.roleSubscription = this.roleService.getRole().subscribe({
      next: (res: RoleApiResponse) => {
        if (res.success) {
          this.role = res.data || [];
          this.loadingData = false;
        }
      },
      error: (err) => {
        console.error('Fetch roles error:', err);
      },
    });
  }

  openModal() {
    this.roleForm.reset();
    this.resetPermissionSelections();
  }

  openEditModal(rol: companyRole) {
    this.currentRole = rol;
    this.isEditModal = true;

    // Reset all permissions
    this.resetPermissionSelections();

    // Set selected permissions based on current role
    if (rol.permissions && Array.isArray(rol.permissions)) {
      this.setSelectedPermissions(rol.permissions);
    }

    this.roleForm.patchValue({
      roleName: rol.roleName,
      description: rol.roleDescription,
      permissions: rol.permissions || [],
    });
  }

  openDeleteModal(rol: companyRole) {
    console.log('Opening delete modal for role:', rol); // Debug log
    if (!rol || !rol.roleId) {
      console.error('Invalid role object:', rol);
      return;
    }
    this.selectedRoleForDelete = rol;
    this.isDeleteModal = true;
  }

  showSuccessModal(message: string) {
    this.successMessage = message;
    this.isSuccessModal = true;
    this.showModal = false;
    this.isEditModal = false;
  }

  addRole() {
    if (this.roleForm.valid) {
      const selectedPermissions = this.getSelectedPermissions();
      const roleData = {
        ...this.roleForm.value,
        permissions: selectedPermissions,
      };
      this.isButtonLoading = true;
      this.roleService.addRole(this.roleForm.value).subscribe({
        next: (res) => {
          this.showSuccessModal('Role added successfully to the system');
          this.isButtonLoading = false;
          this.fetchRoles();
          this.roleAdded.emit(res);
        },
      });
    }
  }

  onRoleSaved(role: any) {
    this.roleAdded.emit(role);
  }

  updateRole() {
    if (this.roleForm.valid && this.currentRole) {
      const selectedPermissions = this.getSelectedPermissions();
      const roleData = {
        roleId: this.currentRole.roleId,
        ...this.roleForm.value,
        permissions: selectedPermissions,
      };
      this.isButtonLoading = true;
      const updatePayload = {
        roleId: this.currentRole.roleId,
        roleName: this.roleForm.value.roleName,
        roleDescription: this.roleForm.value.roleDescription,
        permissions: selectedPermissions,
      };

      this.roleService.updateRole(updatePayload).subscribe({
        next: (res) => {
          this.showSuccessModal('Role updated successfully');
          this.isButtonLoading = false;
          this.fetchRoles();
          this.roleUpdated.emit(res);
        },
        error: (err) => {
          console.error('Update role error:', err);
          this.isButtonLoading = false;

          alert(err?.error?.message || 'Failed to update role.');
        },
      });
    } else {
      console.error('No valid role selected for update');
    }
  }

  deleteRole() {
    const rol = this.selectedRoleForDelete;
    if (rol && rol.roleId) {
      this.isButtonLoading = true;
      this.roleService.deleteRole(rol.roleId).subscribe({
        next: (res) => {
          this.isButtonLoading = false;
          this.closeModal();
          this.role = this.role.filter((r) => r.roleId !== rol.roleId);
          this.showSuccessModal('Role deleted successfully');
          this.roleDeleted.emit(rol.roleId);
        },
        error: (err) => {
          console.error('Delete role error:', err);
          this.isButtonLoading = false;

          alert(err?.error?.message || 'Failed to delete role.');
        },
      });
    } else {
      console.error('No valid role selected for deletion');
    }
  }

  closeModal() {
    this.isEditModal = false;
    this.isDeleteModal = false;
    this.isSuccessModal = false;
    this.currentRole = null;
    this.selectedRoleForDelete = null;
    this.roleForm.reset();
    this.resetPermissionSelections();
    this.modalClosed.emit();
  }

  getFormControl(controlName: string) {
    return this.roleForm.get(controlName);
  }

  // Permission management methods
  toggleDropdown(categoryIndex: number, event: Event) {
    event.stopPropagation();
    this.permissionCategories[categoryIndex].isOpen =
      !this.permissionCategories[categoryIndex].isOpen;
  }

  onPermissionChange(categoryIndex: number, optionIndex: number) {
    this.permissionCategories[categoryIndex].options[optionIndex].selected =
      !this.permissionCategories[categoryIndex].options[optionIndex].selected;

    // Update form control
    const selectedPermissions = this.getSelectedPermissions();
    this.roleForm.patchValue({ permissions: selectedPermissions });
  }

  getSelectedPermissions(): string[] {
    const selected: string[] = [];
    this.permissionCategories.forEach((category) => {
      category.options.forEach((option) => {
        if (option.selected) {
          selected.push(option.value);
        }
      });
    });
    return selected;
  }

  getSelectedPermissionsDisplay(): string {
    return '';
  }

  resetPermissionSelections() {
    this.permissionCategories.forEach((category) => {
      category.isOpen = false;
      category.options.forEach((option) => {
        option.selected = false;
      });
    });
  }

  setSelectedPermissions(permissions: string[]) {
    this.permissionCategories.forEach((category) => {
      category.options.forEach((option) => {
        option.selected = permissions.includes(option.value);
      });
    });
  }

  formatPermissionsForDisplay(permissions: any): string {
    if (!permissions) return 'No permissions';
    if (Array.isArray(permissions)) {
      if (permissions.length === 0) return 'No permissions';

      //This is to Find the permission labels and display them
      const labels: string[] = [];
      for (let category of this.permissionCategories) {
        for (let option of category.options) {
          if (permissions.includes(option.value)) {
            labels.push(option.label);
          }
        }
      }
      return labels.length > 0 ? labels.join(', ') : permissions.join(', ');
    }
    return 'No permissions';
  }

  closeAllDropdowns() {
    this.permissionCategories.forEach((category) => {
      category.isOpen = false;
    });
  }
}
