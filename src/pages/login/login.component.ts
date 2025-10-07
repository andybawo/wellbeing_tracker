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
    // if (this.authservice.isLoggedIn()) {
    //   // Get token and check all requirements before auto-login
    //   const token = this.authservice.getToken();
    //   if (token) {
    //     this.authservice.getUserDetails(token).subscribe({
    //       next: (userRes) => {
    //         if (userRes?.success && userRes?.data) {
    //           const userData = userRes.data;
    //           console.log('User Data:', userData); // Debug log
    //           console.log('Company ID:', userData.companyId); // Debug log
    //           console.log('Email Verified:', userData.isEmailVerified); // Debug log
    //           // 1. Check if company exists
    //           if (
    //             !userData.companyId ||
    //             userData.companyId === null ||
    //             userData.companyId === '00000000-0000-0000-0000-000000000000'
    //           ) {
    //             this.router.navigate(['/start/registration']);
    //             return;
    //           }
    //           // 2. Check email verification
    //           if (!userData.isEmailVerified) {
    //             this.dataService.setUserData({
    //               emailAddress: userData.emailAddress,
    //             });
    //             this.router.navigate(['/start/verify']);
    //             return;
    //           }
    //           try {
    //             const payload = JSON.parse(atob(token.split('.')[1]));
    //             const subscriptionExpiryDate = payload.Subscription_Expires_At;
    //             // Check if subscription exists and is not the default date
    //             if (
    //               !subscriptionExpiryDate ||
    //               subscriptionExpiryDate === '1/1/0001 12:00:00 AM'
    //             ) {
    //               this.router.navigate(['/subscription']);
    //               return;
    //             }
    //             // Check if subscription has expired
    //             const expiryDate = new Date(subscriptionExpiryDate);
    //             const now = new Date();
    //             if (expiryDate < now) {
    //               this.router.navigate(['/subscription'], {
    //                 queryParams: { expired: 'true' },
    //               });
    //               return;
    //             }
    //           } catch (error) {
    //             console.error('Error checking subscription:', error);
    //           }
    //           // 3. Check integrations
    //           const hasSeamlessHR = userData.isSeamlessHRConnected;
    //           const hasSlack = userData.isSlackConnected;
    //           const hasJira = userData.isJiraConnected;
    //           if (!hasSeamlessHR || !hasSlack || !hasJira) {
    //             this.showAlert = true;
    //             this.alertMessage = 'Please complete your integrations.';
    //             this.alertType = 'error';
    //             setTimeout(() => {
    //               this.router.navigate(['/subscription/integration'], {
    //                 queryParams: { required: 'true' },
    //               });
    //             }, 1000);
    //             return;
    //           }
    //           // All checks passed, proceed to home
    //           this.router.navigate(['/home']);
    //         }
    //       },
    //       error: () => {
    //         // On error, let user manually log in
    //         console.log('Error getting user details, manual login required');
    //       },
    //     });
    //   }
    // }
  }
  onLogin() {
    if (this.loginForm.valid) {
      this.isButtonLoading = true;
      const loginData = this.loginForm.value;

      this.authservice.loginUser(loginData).subscribe({
        next: (res) => {
          const token = res.data;
          if (token) {
            this.dataService.clearData();
            this.authservice.saveToken(token);

            this.authservice.getUserDetails(token).subscribe({
              next: (userRes) => {
                this.isButtonLoading = false;
                const userData = userRes.data;

                if (userData) {
                  // Store user data
                  this.dataService.setUserData(userData);
                  localStorage.setItem('userData', JSON.stringify(userData));

                  // console.log('User Data:', userData); // Debug log
                  // console.log('Company ID:', userData.companyId); // Debug log
                  // console.log('Email Verified:', userData.isEmailVerified); // Debug log

                  if (
                    !userData.companyId ||
                    userData.companyId === null ||
                    userData.companyId ===
                      '00000000-0000-0000-0000-000000000000'
                  ) {
                    this.showAlert = true;
                    this.alertMessage = 'Please complete company registration.';
                    this.alertType = 'error';
                    setTimeout(() => {
                      this.showAlert = false;
                      this.router.navigate(['/start/registration']);
                    }, 2000);
                    return;
                  }

                  //To check if email is verified
                  if (!userData.isEmailVerified) {
                    this.dataService.setUserData({
                      emailAddress: userData.emailAddress,
                    });
                    this.showAlert = true;
                    this.alertMessage = 'Please verify your email to continue.';
                    this.alertType = 'error';
                    setTimeout(() => {
                      this.showAlert = false;
                      this.router.navigate(['/start/verify']);
                    }, 2000);
                    return;
                  }

                  // This is to check if subscription exist

                  try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    const subscriptionExpiryDate =
                      payload.Subscription_Expires_At;

                    if (
                      !subscriptionExpiryDate ||
                      subscriptionExpiryDate === '1/1/0001 12:00:00 AM'
                    ) {
                      this.showAlert = true;
                      this.alertMessage =
                        'Please subscribe to a package to continue.';
                      this.alertType = 'error';
                      setTimeout(() => {
                        this.router.navigate(['/subscription'], {});
                      }, 4000);
                      return;
                    }

                    // this is to check if subscription has expired
                    const expiryDate = new Date(subscriptionExpiryDate);
                    const now = new Date();

                    if (expiryDate < now) {
                      this.showAlert = true;
                      this.alertMessage =
                        'Subscription has expired. Subscribe to a package to continue';
                      this.alertType = 'error';
                      setTimeout(() => {
                        this.router.navigate(['/home/subscription-dash'], {
                          queryParams: { expired: 'true' },
                        });
                      }, 2000);
                      return;
                    }
                  } catch (error) {
                    console.error('Error checking subscription:', error);
                  }

                  //This is to check if all tools are registered

                  const hasSeamlessHR = userData.isSeamlessHRConnected;
                  const hasSlack = userData.isSlackConnected;
                  const hasJira = userData.isJiraConnected;

                  if (!hasSeamlessHR || !hasSlack || !hasJira) {
                    this.showAlert = true;
                    this.alertMessage = 'Please complete your integrations.';
                    this.alertType = 'error';
                    setTimeout(() => {
                      this.router.navigate(['/subscription/integration'], {
                        queryParams: { required: 'true' },
                      });
                    }, 1000);
                    return;
                  }

                  this.showAlert = true;
                  this.alertMessage = 'Login successful! Redirecting...';
                  this.alertType = 'success';
                  const redirectUrl =
                    localStorage.getItem('redirectUrl') || '/home';
                  localStorage.removeItem('redirectUrl');
                  setTimeout(() => {
                    this.router.navigate([redirectUrl]);
                  }, 1000);
                }
              },
            });
          }
        },
        error: (err) => {
          this.isButtonLoading = false;
          this.showAlert = true;
          this.alertMessage =
            err.error?.message || 'Login failed. Please try again.';
          this.alertType = 'error';
          setTimeout(() => {
            this.showAlert = false;
          }, 3000);
        },
      });
    }
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
