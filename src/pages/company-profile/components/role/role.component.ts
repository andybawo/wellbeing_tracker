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
import { companyRole } from '../../../../app/interfaces/user-interface';
import { CommonModule } from '@angular/common';
import { RoleService } from '../../../../app/core/services/role.service';
import { Subscription } from 'rxjs';

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
  imports: [CommonModule, ReactiveFormsModule],
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
  successMessage = '';
  roleForm: FormGroup;

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
      description: ['', [Validators.required, Validators.minLength(2)]],
      permissions: [[], [Validators.required]],
    });
  }

  ngOnInit() {
    this.roleSubscription = this.roleService.roles$.subscribe((roles) => {
      this.role = roles;
    });
  }

  ngOnDestroy() {
    if (this.roleSubscription) {
      this.roleSubscription.unsubscribe();
    }
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
      description: rol.description,
      permissions: rol.permissions || [],
    });
  }

  openDeleteModal(rol: companyRole) {
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
      const newRole = this.roleService.addRole(roleData);
      this.resetPermissionSelections(); // Reset after adding
      this.showSuccessModal('Role added successfully');
      this.roleAdded.emit(newRole);
    }
  }

  onRoleSaved(role: any) {
    this.roleAdded.emit(role);
  }

  updateRole() {
    if (this.roleForm.valid && this.currentRole) {
      const selectedPermissions = this.getSelectedPermissions();
      const roleData = {
        ...this.roleForm.value,
        permissions: selectedPermissions,
      };

      const success = this.roleService.updateRole(
        this.currentRole.id,
        roleData
      );
      if (success) {
        this.resetPermissionSelections(); // Reset after updating
        this.showSuccessModal('Role Updated successfully');
        this.roleUpdated.emit({
          ...this.currentRole,
          ...roleData,
        });
      }
    }
  }

  deleteRole() {
    if (this.selectedRoleForDelete) {
      const success = this.roleService.deleteRole(
        this.selectedRoleForDelete.id
      );
      if (success) {
        this.roleDeleted.emit(this.selectedRoleForDelete.id);
        this.closeModal();
      }
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
