import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../app/core/services/auth.service';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../app/shared/shared.module';
import { DataService } from '../../app/core/services/data.service';

@Component({
  selector: 'app-login',
  imports: [RouterModule, ReactiveFormsModule, CommonModule, SharedModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup = new FormGroup({
    emailAddress: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  isLoading: boolean = false;
  isButtonLoading: boolean = false;
  showAlert: boolean = false;
  alertMessage: string = '';
  alertType: 'success' | 'error' = 'success';
  showPassword: boolean = false;
  constructor(
    private authservice: AuthService,
    private dataService: DataService,
    private router: Router
  ) {
    if (this.authservice.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.isButtonLoading = true;
      const loginData = this.loginForm.value;

      this.authservice.loginUser(loginData).subscribe({
        next: (res) => {
          this.isButtonLoading = false;
          const token = res.data;
          if (token) {
            this.dataService.clearData();
            this.authservice.saveToken(token);
            this.showAlert = true;
            this.alertMessage = 'Login successful! Redirecting...';
            this.alertType = 'success';

            const redirectUrl = localStorage.getItem('redirectUrl') || '/home';
            localStorage.removeItem('redirectUrl');

            // Small delay for better UX
            setTimeout(() => {
              this.router.navigate([redirectUrl]);
            }, 1000);
          }
        },
        error: (err) => {
          this.isButtonLoading = false;

          if (
            err.error &&
            err.error.message &&
            err.error.message.toLowerCase().includes('not verified')
          ) {
            if (err.error.data) {
              this.dataService.setUserData({
                emailAddress: err.error.data,
              });
            }

            this.showAlert = true;
            this.alertMessage = 'Please verify your email to continue.';
            this.alertType = 'error';

            setTimeout(() => {
              this.showAlert = false;
              this.router.navigate(['/start/verify']);
            }, 2000);
          } else {
            this.showAlert = true;
            this.alertMessage =
              err.error?.message ||
              'Login failed. Please check your credentials.';
            this.alertType = 'error';
            setTimeout(() => {
              this.showAlert = false;
            }, 5000);
          }

          console.error('Login error:', err);
        },
      });
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
