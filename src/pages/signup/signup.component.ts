import { Component } from '@angular/core';
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

@Component({
  selector: 'app-signup',
  imports: [RouterModule, ReactiveFormsModule, CommonModule, SharedModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  standalone: true,
})
export class SignupComponent {
  userForm: FormGroup = new FormGroup({
    fullName: new FormControl('', [Validators.required]),
    emailAddress: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern('^(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).+$'),
    ]),
  });

  isLoading: boolean = false;
  isButtonLoading: boolean = false;
  showAlert: boolean = false;
  alertMessage: string = '';
  alertType: 'success' | 'error' = 'success';
  showPassword: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private dataService: DataService
  ) {}

  async onUserSave() {
    this.isButtonLoading = true;

    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (this.userForm.valid) {
      this.isLoading = true;
      const userData = this.userForm.value;

      this.dataService.setUserData(userData);
      this.isLoading = false;
      this.showAlert = true;
      this.alertMessage =
        'Signup successful! Please proceed to register your company.';
      this.alertType = 'success';
      setTimeout(() => {
        this.isButtonLoading = false;
        this.router.navigate(['/start/registration']);
      }, 500);
    } else {
      this.isLoading = false;
      this.showAlert = true;
      this.isButtonLoading = false;
      let errorMessage = 'Please ensure all fields are filled correctly.';

      if (this.userForm.controls['password'].invalid) {
        if (this.userForm.controls['password'].errors?.['required']) {
          errorMessage = 'Password is required.';
        } else if (this.userForm.controls['password'].errors?.['minlength']) {
          errorMessage = 'Password must be at least 8 characters long.';
        } else if (this.userForm.controls['password'].errors?.['pattern']) {
          errorMessage =
            'Password must contain at least one uppercase letter, one number, and one special character.';
        }
      }

      this.alertMessage = errorMessage;
      this.alertType = 'error';
      setTimeout(() => {
        this.showAlert = false;
      }, 6000);
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
