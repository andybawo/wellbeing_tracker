import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../app/core/services/auth.service';
import { DataService } from '../../app/core/services/data.service';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../app/shared/shared.module';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule, SharedModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent implements OnInit, AfterViewInit, OnDestroy {
  userForm: FormGroup = new FormGroup({
    fullName: new FormControl('', [Validators.required]),
    emailAddress: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern('^(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).+$'),
    ]),
  });

  isLoading = false;
  isButtonLoading = false;
  showAlert = false;
  alertMessage = '';
  alertType: 'success' | 'error' = 'success';
  showPassword = false;
  emailChecking = false;

  private formSubscription?: Subscription;
  private readonly STORAGE_KEY = 'signupUserData';

  constructor(
    private router: Router,
    private authService: AuthService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.loadSavedUserData();
  }

  ngAfterViewInit(): void {
    // Use debounceTime to avoid excessive localStorage writes
    this.formSubscription = this.userForm.valueChanges
      .pipe(debounceTime(300))
      .subscribe((value) => {
        this.saveUserData(value);
      });
  }

  ngOnDestroy(): void {
    // Clean up subscription to prevent memory leaks
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
  }

  private loadSavedUserData(): void {
    try {
      const savedUserData = localStorage.getItem(this.STORAGE_KEY);
      if (savedUserData) {
        const userData = JSON.parse(savedUserData);
        // Explicitly set the form values, ensuring password is always empty
        this.userForm.patchValue(
          {
            fullName: userData.fullName || '',
            emailAddress: userData.emailAddress || '',
            password: '', // Always clear password for security
          },
          { emitEvent: false }
        );
      }
    } catch (error) {
      console.error('Error loading saved user data:', error);
      // Clear corrupted data
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  private saveUserData(userData: any): void {
    try {
      // Only save if form has some data (excluding password for security)
      if (userData.fullName || userData.emailAddress) {
        // Create a copy without the password for security reasons
        const dataToSave = {
          fullName: userData.fullName || '',
          emailAddress: userData.emailAddress || '',
          // Intentionally exclude password
        };
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dataToSave));
      }
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  async onUserSave(): Promise<void> {
    this.isButtonLoading = true;

    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (this.userForm.invalid) {
      this.handleFormError();
      return;
    }

    const email = this.userForm.get('emailAddress')?.value;

    try {
      const emailCheckResponse = await this.authService
        .checkEmailExists(email)
        .toPromise();

      if (emailCheckResponse?.data === true) {
        this.setAlert(
          'This Email Address is already registered. Please use a different email.',
          'error'
        );
        this.isButtonLoading = false;
        return;
      }

      const userData = this.userForm.value;
      this.dataService.setUserData(userData);

      this.setAlert(
        'Signup successful! Please proceed to register your company.',
        'success'
      );

      setTimeout(() => {
        this.isButtonLoading = false;
        this.router.navigate(['/start/registration']);
      }, 500);
    } catch (error) {
      this.setAlert(
        'Unable to verify email availability. Please try again.',
        'error'
      );
      this.isButtonLoading = false;
    }
  }

  public clearSavedData(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  private handleFormError(): void {
    this.isLoading = false;
    this.isButtonLoading = false;
    this.showAlert = true;

    let errorMessage = 'Please ensure all fields are filled correctly.';

    if (this.userForm.controls['password'].invalid) {
      const errors = this.userForm.controls['password'].errors;
      if (errors?.['required']) {
        errorMessage = 'Password is required.';
      } else if (errors?.['minlength']) {
        errorMessage = 'Password must be at least 8 characters long.';
      } else if (errors?.['pattern']) {
        errorMessage =
          'Password must contain at least one uppercase letter, one number, and one special character.';
      }
    }

    this.alertMessage = errorMessage;
    this.alertType = 'error';
    setTimeout(() => (this.showAlert = false), 6000);
  }

  private setAlert(message: string, type: 'success' | 'error'): void {
    this.isLoading = false;
    this.showAlert = true;
    this.alertMessage = message;
    this.alertType = type;
    setTimeout(() => {
      this.showAlert = false;
    }, 4000);
  }
}
