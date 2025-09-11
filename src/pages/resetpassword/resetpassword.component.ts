import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../app/shared/shared.module';
import { AuthService } from '../../app/core/services/auth.service';

@Component({
  selector: 'app-resetpassword',
  imports: [ReactiveFormsModule, CommonModule, RouterModule, SharedModule],
  templateUrl: './resetpassword.component.html',
  styleUrl: './resetpassword.component.scss',
})
export class ResetpasswordComponent implements OnInit {
  resetForm: FormGroup;
  showPassword: boolean = false;
  isButtonLoading: boolean = false;
  showAlert: boolean = false;
  alertMessage: string = '';
  alertType: 'success' | 'error' = 'success';

  private token: string = '';
  private email: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.resetForm = this.fb.group({
      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern('^(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).+$'),
        ],
      ],
    });
  }

  ngOnInit(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const rawTokenFromUrl = urlParams.get('token');
    const rawEmailFromUrl = urlParams.get('email');

    if (rawTokenFromUrl && rawEmailFromUrl) {
      // Fix the token by replacing spaces with + signs
      this.token = rawTokenFromUrl.replace(/ /g, '+');
      this.email = rawEmailFromUrl;
    } else {
      // Fallback to Angular's route params
      this.route.queryParams.subscribe((params) => {
        let rawToken = params['token'] || '';

        this.token = rawToken
          ? decodeURIComponent(rawToken).replace(/ /g, '+')
          : '';
        this.email = params['email'] ? decodeURIComponent(params['email']) : '';
      });
    }

    if (!this.token || !this.email) {
      this.alertMessage =
        'Invalid reset link. Please request a new password reset.';
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onReset(): void {
    if (this.resetForm.valid && this.token && this.email) {
      this.isButtonLoading = true;
      this.hideAlert();

      const resetData = {
        token: this.token.trim(), // Remove any extra whitespace
        email: this.email.trim(),
        newPassword: this.resetForm.get('newPassword')?.value,
      };

      this.authService.resetPassword(resetData).subscribe({
        next: (response) => {
          this.isButtonLoading = false;
          this.showAlert = true;
          this.alertMessage =
            'Password reset successfully! Redirecting to login...';

          // Redirect to login page after 2 seconds
          setTimeout(() => {
            this.router.navigate(['/start/login']);
          }, 5000);
        },
        error: (error) => {
          this.isButtonLoading = false;
          this.alertMessage = 'Failed to reset password. Please try again.';
          this.alertType = 'error';
          this.showAlert = true;
          setTimeout(() => {
            this.showAlert = false;
          }, 3000);
        },
      });
    } else {
      this.showAlert = true;
      this.alertMessage = 'Please enter a valid password.';
      this.alertType = 'error';

      setTimeout(() => {
        this.showAlert = false;
      }, 3000);
    }
  }

  private hideAlert(): void {
    this.showAlert = false;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.resetForm.controls).forEach((key) => {
      const control = this.resetForm.get(key);
      control?.markAsTouched();
    });
  }

  get newPassword() {
    return this.resetForm.get('newPassword');
  }

  getPasswordErrors(): string[] {
    const errors: string[] = [];
    const passwordControl = this.newPassword;

    if (passwordControl?.errors && passwordControl.touched) {
      if (passwordControl.errors['required']) {
        errors.push('Password is required');
      }
      if (passwordControl.errors['minlength']) {
        errors.push('Password must be at least 8 characters long');
      }
      if (passwordControl.errors['pattern']) {
        errors.push(
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        );
      }
    }

    return errors;
  }
}
