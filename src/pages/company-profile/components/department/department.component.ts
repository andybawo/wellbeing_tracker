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
import { companyDepartment } from '../../../../app/interfaces/user-interface';
import { CommonModule } from '@angular/common';
import { DepartmentService } from '../../../../app/core/services/department.service';
import { Subscription } from 'rxjs';
import {
  DepartmentApiResponse,
  CompanyUsersApiResponse,
  DeleteCompanyResponse,
} from '../../../../app/interfaces/user-interface';
import { SharedModule } from '../../../../app/shared/shared.module';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrl: './department.component.scss',
  imports: [CommonModule, ReactiveFormsModule, SharedModule],
})
export class DepartmentComponent implements OnInit, OnDestroy {
  department: companyDepartment[] = [];
  currentDepartment: companyDepartment | null = null;
  selectedDepartmentForDelete: companyDepartment | null = null;
  private departmentSubscription?: Subscription;

  @Input() showModal = false;
  @Output() modalClosed = new EventEmitter<void>();
  @Output() departmentAdded = new EventEmitter<any>();
  @Output() departmentUpdated = new EventEmitter<companyDepartment>();
  @Output() departmentDeleted = new EventEmitter<string>();

  isEditModal = false;
  isDeleteModal = false;
  isSuccessModal = false;
  successMessage = '';
  showAlert: boolean = false;
  alertMessage: string = '';
  alertType: 'success' | 'error' = 'success';
  isButtonLoading: boolean = false;

  companyUsers: any[] = [];
  showHodDropdown: boolean = false;

  departmentForm: FormGroup;
  departmentFormUpdate: FormGroup;

  constructor(
    private fb: FormBuilder,
    private departmentService: DepartmentService
  ) {
    this.departmentForm = this.fb.group({
      departmentName: ['', [Validators.required, Validators.minLength(2)]],
      hodName: [''],
      hodDisplayName: [''],
      // emailHod: ['', [Validators.required, Validators.email]],
    });
    this.departmentFormUpdate = this.fb.group({
      departmentName: ['', [Validators.required, Validators.minLength(2)]],
      headOfDepartmentName: [
        '',
        [Validators.required, Validators.minLength(2)],
      ],
      hodDisplayName: [''],
      // emailHod: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {
    this.fetchDepartments();
    this.fetchCompanyUsers();
  }

  ngOnDestroy() {
    if (this.departmentSubscription) {
      this.departmentSubscription.unsubscribe();
    }
  }

  fetchDepartments() {
    this.departmentSubscription = this.departmentService
      .getAllDepartments()
      .subscribe({
        next: (res: DepartmentApiResponse) => {
          this.department = res.data || [];
        },
        error: (err) => {},
      });
  }

  fetchCompanyUsers() {
    this.departmentSubscription = this.departmentService
      .getAllCompUsers()
      .subscribe({
        next: (res: CompanyUsersApiResponse) => {
          this.companyUsers = res.data || [];
        },
        error: (err) => {},
      });
  }

  getHodEmail(hodName: string): string | undefined {
    const userByUsername = this.companyUsers.find(
      (u) => u.username === hodName
    );
    if (userByUsername) {
      return userByUsername.emailAddress;
    }

    const userByFullName = this.companyUsers.find(
      (u) => u.fullName === hodName
    );
    return userByFullName ? userByFullName.emailAddress : '';
  }

  getHodDisplayName(hodIdentifier: string): string {
    const userByUsername = this.companyUsers.find(
      (u) => u.username === hodIdentifier
    );
    if (userByUsername) {
      return userByUsername.fullName;
    }

    const userByFullName = this.companyUsers.find(
      (u) => u.fullName === hodIdentifier
    );
    return userByFullName ? userByFullName.fullName : hodIdentifier;
  }

  onHodInputFocus() {
    this.showHodDropdown = true;
  }

  selectHod(user: any, mode: 'add' | 'edit' = 'add') {
    if (mode === 'add') {
      this.departmentForm.get('hodName')?.setValue(user.username);
      this.departmentForm.get('hodDisplayName')?.setValue(user.fullName);
    } else {
      this.departmentFormUpdate
        .get('headOfDepartmentName')
        ?.setValue(user.username);
      this.departmentFormUpdate.get('hodDisplayName')?.setValue(user.fullName);
    }
    this.showHodDropdown = false;
  }

  onHodInputBlur() {
    setTimeout(() => (this.showHodDropdown = false), 200);
  }

  openAddModal() {
    this.departmentForm.reset();
  }

  openEditModal(dept: companyDepartment) {
    this.currentDepartment = dept;
    this.isEditModal = true;

    const user = this.companyUsers.find(
      (u) => u.username === dept.hodName || u.fullName === dept.hodName
    );

    this.departmentFormUpdate.patchValue({
      departmentName: dept.departmentName,
      headOfDepartmentName: user ? user.username : dept.hodName,
      hodDisplayName: user ? user.fullName : dept.hodName,
    });
  }

  openDeleteModal(dept: companyDepartment) {
    this.selectedDepartmentForDelete = dept;
    this.isDeleteModal = true;
  }

  showSuccessModal(message: string) {
    this.successMessage = message;
    this.isSuccessModal = true;
    this.showModal = false;
    this.isEditModal = false;
  }

  addDepartment() {
    if (this.departmentForm.valid) {
      this.isButtonLoading = true;
      const payload = {
        departmentName: this.departmentForm.value.departmentName,
        hodName: this.departmentForm.value.hodName,
      };
      this.departmentService
        .addDepartment(this.departmentForm.value)
        .subscribe({
          next: (res) => {
            this.showSuccessModal(
              'Department added successfully to the system'
            );
            this.isButtonLoading = false;
            this.fetchDepartments();
            this.departmentAdded.emit(res);
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

  onDepartmentSaved(department: any) {
    this.departmentAdded.emit(department);
  }

  updateDepartment() {
    if (this.departmentFormUpdate.valid && this.currentDepartment) {
      this.isButtonLoading = true;
      const updatePayload = {
        departmentId: this.currentDepartment.id,
        departmentName: this.departmentFormUpdate.value.departmentName,
        headOfDepartmentName:
          this.departmentFormUpdate.value.headOfDepartmentName,
      };
      this.departmentService.updateDepartment(updatePayload).subscribe({
        next: (res) => {
          this.isButtonLoading = false;
          this.showSuccessModal('Department updated successfully');
          this.fetchDepartments();
          this.departmentUpdated.emit({
            id: updatePayload.departmentId,
            departmentName: updatePayload.departmentName,
            hodName: updatePayload.headOfDepartmentName,
          });
        },
        error: (err) => {
          this.isButtonLoading = false;
          this.showAlert = true;
          this.alertMessage = 'Head of Department is not registered in Company';
          this.alertType = 'error';
          setTimeout(() => {
            this.showAlert = false;
          }, 2000);
        },
      });
    }
  }

  deleteDepartment() {
    const dept = this.selectedDepartmentForDelete;
    if (dept) {
      this.isButtonLoading = true;

      this.departmentService.deleteDepartment(dept.id).subscribe({
        next: () => {
          this.isButtonLoading = false;
          this.closeModal();
          this.department = this.department.filter((d) => d.id !== dept.id);
          this.showSuccessModal('Department deleted successfully');
          this.departmentDeleted.emit(dept.id);
        },
        error: (err) => {
          console.error('Delete error:', err);
          this.isButtonLoading = false;

          this.showAlert = true;
          this.alertMessage =
            err?.error?.message || 'Failed to delete department.';
          this.alertType = 'error';
          setTimeout(() => (this.showAlert = false), 3000);
        },
      });
    }
  }

  closeModal() {
    this.isEditModal = false;
    this.isDeleteModal = false;
    this.isSuccessModal = false;
    this.currentDepartment = null;
    this.selectedDepartmentForDelete = null;
    this.departmentForm.reset();
    this.modalClosed.emit();
  }

  getFormControl(controlName: string) {
    return this.departmentForm.get(controlName);
  }
}
