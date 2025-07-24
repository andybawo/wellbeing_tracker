import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { companyRole } from '../../interfaces/user-interface';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private readonly STORAGE_KEY = 'roles';
  private rolesSubject = new BehaviorSubject<companyRole[]>([]);
  public roles$ = this.rolesSubject.asObservable();

  constructor() {
    this.loadRolesFromStorage();
  }

  private loadRolesFromStorage(): void {
    const storedRoles = localStorage.getItem(this.STORAGE_KEY);
    if (storedRoles) {
      const roles = JSON.parse(storedRoles);
      this.rolesSubject.next(roles);
    }
  }

  private saveRolesToStorage(roles: companyRole[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(roles));
    this.rolesSubject.next(roles);
  }

  getAllRoles(): companyRole[] {
    return this.rolesSubject.value;
  }

  getRoleById(id: string): companyRole | undefined {
    return this.rolesSubject.value.find((rol) => rol.id === id);
  }

  addRole(roleData: Omit<companyRole, 'id'>): companyRole {
    const newRole: companyRole = {
      ...roleData,
      id: this.generateId(),
    };

    const currentRoles = this.rolesSubject.value;
    const updatedRoles = [...currentRoles, newRole];
    this.saveRolesToStorage(updatedRoles);

    return newRole;
  }

  updateRole(id: string, roleData: Partial<companyRole>): boolean {
    const currentRoles = this.rolesSubject.value;
    const roleIndex = currentRoles.findIndex((rol) => rol.id === id);

    if (roleIndex === -1) {
      return false;
    }

    const updatedRoles = [...currentRoles];
    updatedRoles[roleIndex] = {
      ...updatedRoles[roleIndex],
      ...roleData,
    };
    this.saveRolesToStorage(updatedRoles);

    return true;
  }

  deleteRole(id: string): boolean {
    const currentRoles = this.rolesSubject.value;
    const filteredRoles = currentRoles.filter((rol) => rol.id !== id);

    if (filteredRoles.length === currentRoles.length) {
      return false;
    }

    this.saveRolesToStorage(filteredRoles);
    return true;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
