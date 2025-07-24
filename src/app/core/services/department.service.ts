import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { companyDepartment } from '../../interfaces/user-interface';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private readonly STORAGE_KEY = 'departments';
  private departmentsSubject = new BehaviorSubject<companyDepartment[]>([]);
  public departments$ = this.departmentsSubject.asObservable();

  constructor() {
    this.loadDepartmentsFromStorage();
  }

  private loadDepartmentsFromStorage(): void {
    const storedDepartments = localStorage.getItem(this.STORAGE_KEY);
    if (storedDepartments) {
      const departments = JSON.parse(storedDepartments);
      this.departmentsSubject.next(departments);
    }
  }

  private saveDepartmentsToStorage(departments: companyDepartment[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(departments));
    this.departmentsSubject.next(departments);
  }

  getAllDepartments(): companyDepartment[] {
    return this.departmentsSubject.value;
  }

  getDepartmentById(id: string): companyDepartment | undefined {
    return this.departmentsSubject.value.find((dept) => dept.id === id);
  }

  addDepartment(
    departmentData: Omit<companyDepartment, 'id'>
  ): companyDepartment {
    const newDepartment: companyDepartment = {
      ...departmentData,
      id: this.generateId(),
    };

    const currentDepartments = this.departmentsSubject.value;
    const updatedDepartments = [...currentDepartments, newDepartment];
    this.saveDepartmentsToStorage(updatedDepartments);

    return newDepartment;
  }

  updateDepartment(
    id: string,
    departmentData: Partial<companyDepartment>
  ): boolean {
    const currentDepartments = this.departmentsSubject.value;
    const departmentIndex = currentDepartments.findIndex(
      (dept) => dept.id === id
    );

    if (departmentIndex === -1) {
      return false;
    }

    const updatedDepartments = [...currentDepartments];
    updatedDepartments[departmentIndex] = {
      ...updatedDepartments[departmentIndex],
      ...departmentData,
    };
    this.saveDepartmentsToStorage(updatedDepartments);

    return true;
  }

  deleteDepartment(id: string): boolean {
    const currentDepartments = this.departmentsSubject.value;
    const filteredDepartments = currentDepartments.filter(
      (dept) => dept.id !== id
    );

    if (filteredDepartments.length === currentDepartments.length) {
      return false;
    }

    this.saveDepartmentsToStorage(filteredDepartments);
    return true;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
