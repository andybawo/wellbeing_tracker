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

  constructor(private fb: FormBuilder, private roleService: RoleService) {
    this.roleForm = this.fb.group({
      roleName: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(2)]],
      permissions: ['', [Validators.required, Validators.minLength(2)]],
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
  }

  openEditModal(rol: companyRole) {
    this.currentRole = rol;
    this.isEditModal = true;
    this.roleForm.patchValue({
      roleName: rol.roleName,
      description: rol.description,
      permissions: rol.permissions,
    });
  }

  openDeleteModal(rol: companyRole) {
    this, (this.selectedRoleForDelete = rol);
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
      const newRole = this.roleService.addRole(this.roleForm.value);
      this.showSuccessModal('Role added successfully');
      this.roleAdded.emit(newRole);
    }
  }

  onRoleSaved(role: any) {
    this.roleAdded.emit(role);
  }

  updateRole() {
    if (this.roleForm.valid && this.currentRole) {
      const success = this.roleService.updateRole(
        this.currentRole.id,
        this.roleForm.value
      );

      if (success) {
        this.showSuccessModal('Role Updated successfully');
        this.roleUpdated.emit({
          ...this.currentRole,
          ...this.roleForm.value,
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
    this.modalClosed.emit();
  }

  getFormControl(controlName: string) {
    return this.roleForm.get(controlName);
  }
}
