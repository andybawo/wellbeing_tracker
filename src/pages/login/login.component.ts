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
  constructor(private authservice: AuthService, private router: Router) {}

  onLogin() {
    if (this.loginForm.valid) {
      this.isButtonLoading = true;
      const loginData = this.loginForm.value;

      this.authservice.loginUser(loginData).subscribe({
        next: (res) => {
          this.isButtonLoading = false;
          const token = res.data;
          if (token) {
            localStorage.setItem('authToken', token);
            // console.log('JWT token stored in localStorage:', token);
          }
          this.router.navigate(['/home']);
        },

        error: (err) => {
          this.isButtonLoading = false;
          this.showAlert = true;
          this.alertMessage = 'Login failed. Please check your credentials.';
          this.alertType = 'error';
          setTimeout(() => {
            this.showAlert = false;
          }, 1000000);
          // console.error('Login error:', err);
          // You can show error to user here
        },
      });
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
