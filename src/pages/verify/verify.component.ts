import { Location } from '@angular/common';
import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { AuthService } from '../../app/core/services/auth.service';
import { DataService } from '../../app/core/services/data.service';
import { SharedModule } from '../../app/shared/shared.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verify',
  imports: [RouterModule, ReactiveFormsModule, SharedModule, CommonModule],
  templateUrl: './verify.component.html',
  styleUrl: './verify.component.scss',
})
export class VerifyComponent {
  verifyForm: FormGroup = new FormGroup({
    digit1: new FormControl('', [
      Validators.required,
      Validators.pattern('[0-9]'),
    ]),
    digit2: new FormControl('', [
      Validators.required,
      Validators.pattern('[0-9]'),
    ]),
    digit3: new FormControl('', [
      Validators.required,
      Validators.pattern('[0-9]'),
    ]),
    digit4: new FormControl('', [
      Validators.required,
      Validators.pattern('[0-9]'),
    ]),
    digit5: new FormControl('', [
      Validators.required,
      Validators.pattern('[0-9]'),
    ]),
    digit6: new FormControl('', [
      Validators.required,
      Validators.pattern('[0-9]'),
    ]),
  });
  isLoading: boolean = false;
  showAlert: boolean = false;

  alertMessage: string = '';
  alertType: 'success' | 'error' = 'success';
  closeModal() {
    this.isLoading = false;
  }

  @ViewChildren('digit1Input, digit2Input, digit3Input, digit4Input')
  digitInputs!: QueryList<ElementRef>;

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    const userData = this.dataService.getUserData();
    if (userData?.emailAddress) {
      this.sendVerificationEmail(userData.emailAddress);
    } else {
      this.router.navigate(['/start/signup']);
    }
  }
  focusNext(event: Event, nextInputName: string) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.value.length === 1) {
      const nextInput = this.digitInputs.find(
        (input) =>
          input.nativeElement.getAttribute('formControlName') === nextInputName
      );
      nextInput?.nativeElement.focus();
    }
  }

  focusPrevious(event: KeyboardEvent, previousInputName: string) {
    if (event.key === 'Backspace') {
      const inputElement = event.target as HTMLInputElement;
      if (inputElement.value.length === 0) {
        const previousInput = this.digitInputs.find(
          (input) =>
            input.nativeElement.getAttribute('formControlName') ===
            previousInputName
        );
        previousInput?.nativeElement.focus();
      }
    }
  }

  sendVerificationEmail(email: string) {
    this.isLoading = true;
    this.authService.sendVerification(email).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.showAlert = true;
        this.alertMessage = 'Verification code Sent successfully.';
        this.alertType = 'success';
        setTimeout(() => {
          this.showAlert = false;
        }, 3000);
      },
      error: (err) => {
        this.isLoading = false;
        this.showAlert = true;
        this.alertMessage =
          err.error?.message || 'Error resending verification code.';
        this.alertType = 'error';
        setTimeout(() => {
          this.showAlert = false;
        }, 3000);
      },
    });
  }

  resendVerificationCode() {
    const userData = this.dataService.getUserData();
    if (userData?.emailAddress) {
      this.sendVerificationEmail(userData.emailAddress);
    } else {
      this.showAlert = true;
      this.alertMessage = 'User email not found. Please signup again.';
      this.alertType = 'error';
      setTimeout(() => {
        this.showAlert = false;
      }, 10000);
      this.router.navigate(['/start/signup']);
    }
  }

  onVerifyCode() {
    if (this.verifyForm.valid) {
      this.isLoading = true;
      const verificationCode = Object.values(this.verifyForm.value).join('');
      const userData = this.dataService.getUserData();

      if (!userData || !userData.emailAddress) {
        this.isLoading = false;
        this.showAlert = true;
        this.alertMessage = 'User data not found. Please signup again.';
        this.alertType = 'error';
        setTimeout(() => {
          this.showAlert = false;
        }, 3000);
        this.router.navigate(['/start/signup']);
        return;
      }

      this.authService
        .verifyCode(userData.emailAddress, verificationCode)
        .subscribe({
          next: (verifyRes) => {
            this.isLoading = false;
            this.showAlert = true;
            this.alertMessage = 'Verification successful!';
            this.alertType = 'success';
            this.dataService.setHasRegisteredUser(true);

            localStorage.removeItem('signupUserData');
            localStorage.removeItem('registrationCompanyData');

            this.router.navigate(['/subscription']);
          },
          error: (err) => {
            this.isLoading = false;
            this.showAlert = true;
            this.alertMessage =
              err.error?.message || 'Verification failed. Please try again.';
            this.alertType = 'error';
            setTimeout(() => {
              this.showAlert = false;
            }, 3000);
          },
        });
    } else {
      this.showAlert = true;
      this.alertMessage = 'Please enter the verification code.';
      setTimeout(() => {
        this.showAlert = false;
      }, 3000);
      this.alertType = 'error';
    }
  }
  goBack(): void {
    this.location.back();
  }
}
