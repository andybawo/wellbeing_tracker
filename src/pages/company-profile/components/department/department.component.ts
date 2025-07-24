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

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrl: './department.component.scss',
  imports: [CommonModule, ReactiveFormsModule],
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

  departmentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private departmentService: DepartmentService
  ) {
    this.departmentForm = this.fb.group({
      departmentName: ['', [Validators.required, Validators.minLength(2)]],
      hodName: ['', [Validators.required, Validators.minLength(2)]],
      emailHod: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {
    this.departmentSubscription = this.departmentService.departments$.subscribe(
      (departments) => {
        this.department = departments;
      }
    );
  }

  ngOnDestroy() {
    if (this.departmentSubscription) {
      this.departmentSubscription.unsubscribe();
    }
  }

  openAddModal() {
    this.departmentForm.reset();
  }

  openEditModal(dept: companyDepartment) {
    this.currentDepartment = dept;
    this.isEditModal = true;
    this.departmentForm.patchValue({
      departmentName: dept.departmentName,
      hodName: dept.hodName,
      emailHod: dept.emailHod,
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
      const newDepartment = this.departmentService.addDepartment(
        this.departmentForm.value
      );
      this.showSuccessModal('Department added successfully to the system');
      this.departmentAdded.emit(newDepartment);
    }
  }

  onDepartmentSaved(department: any) {
    this.departmentAdded.emit(department);
  }

  updateDepartment() {
    if (this.departmentForm.valid && this.currentDepartment) {
      const success = this.departmentService.updateDepartment(
        this.currentDepartment.id,
        this.departmentForm.value
      );

      if (success) {
        this.showSuccessModal('Department updated successfully');
        this.departmentUpdated.emit({
          ...this.currentDepartment,
          ...this.departmentForm.value,
        });
      }
    }
  }

  deleteDepartment() {
    if (this.selectedDepartmentForDelete) {
      const success = this.departmentService.deleteDepartment(
        this.selectedDepartmentForDelete.id
      );

      if (success) {
        this.departmentDeleted.emit(this.selectedDepartmentForDelete.id);
        this.closeModal();
      }
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
