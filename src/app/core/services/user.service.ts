import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../interfaces/user-interface';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly STORAGE_KEY = 'users';
  private usersSubject = new BehaviorSubject<User[]>([]);
  public users$ = this.usersSubject.asObservable();

  constructor() {
    this.loadUsersFromStorage();
  }

  private loadUsersFromStorage(): void {
    const storedUsers = localStorage.getItem(this.STORAGE_KEY);
    if (storedUsers) {
      const users = JSON.parse(storedUsers).map((user: any) => ({
        ...user,
        dateAdded: new Date(user.dateAdded),
      }));
      this.usersSubject.next(users);
    }
  }

  private saveUsersToStorage(users: User[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
    this.usersSubject.next(users);
  }

  getAllUsers(): User[] {
    return this.usersSubject.value;
  }

  getUserById(id: string): User | undefined {
    return this.usersSubject.value.find((user) => user.id === id);
  }

  addUser(userData: Omit<User, 'id' | 'dateAdded' | 'status'>): User {
    const newUser: User = {
      ...userData,
      id: this.generateId(),
      dateAdded: new Date(),
      status: 'Active',
    };

    const currentUsers = this.usersSubject.value;
    const updatedUsers = [...currentUsers, newUser];
    this.saveUsersToStorage(updatedUsers);

    return newUser;
  }

  updateUser(id: string, userData: Partial<User>): boolean {
    const currentUsers = this.usersSubject.value;
    const userIndex = currentUsers.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      return false;
    }

    const updatedUsers = [...currentUsers];
    updatedUsers[userIndex] = { ...updatedUsers[userIndex], ...userData };
    this.saveUsersToStorage(updatedUsers);

    return true;
  }

  deleteUser(id: string): boolean {
    const currentUsers = this.usersSubject.value;
    const filteredUsers = currentUsers.filter((user) => user.id !== id);

    if (filteredUsers.length === currentUsers.length) {
      return false;
    }

    this.saveUsersToStorage(filteredUsers);
    return true;
  }

  deactivateUser(id: string): boolean {
    return this.updateUser(id, { status: 'Inactive' });
  }

  activateUser(id: string): boolean {
    return this.updateUser(id, { status: 'Active' });
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
