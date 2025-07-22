import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { SharedModule } from '../../app/shared/shared.module';
import { AuthService } from '../../app/core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  imports: [RouterModule, ReactiveFormsModule, CommonModule, SharedModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup = new FormGroup({
    emailAddress: new FormControl('', [Validators.required, Validators.email]),
  });

  isButtonLoading: boolean = false;
  showAlert: boolean = false;
  alertMessage: string = '';
  alertType: 'success' | 'error' = 'success';

  constructor(private router: Router, private authService: AuthService) {}

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      this.isButtonLoading = true;
      const email = this.forgotPasswordForm.value.emailAddress;

      this.authService.forgotPassword(email).subscribe({
        next: (response) => {
          this.isButtonLoading = false;
          this.showAlert = true;
          this.alertMessage =
            'Password reset link has been sent to your email.';
          this.alertType = 'success';

          localStorage.setItem('resetEmail', email);
        },
        error: (error) => {
          this.isButtonLoading = false;
          this.showAlert = true;
          this.alertMessage =
            error.error?.message ||
            'Failed to send reset link. Please try again';
          this.alertType = 'error';

          setTimeout(() => {
            this.showAlert = false;
          }, 5000);
        },
      });
    } else {
      this.showAlert = true;
      this.alertMessage = 'Please enter a valid email address.';
      this.alertType = 'error';

      setTimeout(() => {
        this.showAlert = false;
      }, 3000);
    }
  }
}
