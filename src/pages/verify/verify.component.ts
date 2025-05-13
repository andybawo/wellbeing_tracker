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
  showAlert: boolean = false; // Control alert visibility
  alertMessage: string = ''; // Alert message
  alertType: 'success' | 'error' = 'success'; // Alert typ
  closeModal() {
    this.isLoading = false;
  }

  @ViewChildren('digit1Input, digit2Input, digit3Input, digit4Input')
  digitInputs!: QueryList<ElementRef>;

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userData = this.dataService.getUserData();
    if (userData?.emailAddress) {
      // Send the verification code when the verify component loads
      this.sendVerificationEmail(userData.emailAddress);
    } else {
      console.error('User email not found, cannot send verification code.');
      this.router.navigate(['/start/signup']); // Or a relevant error route
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
        console.log('Verification code sent:', res);
      },
      error: (err) => {
        this.isLoading = false;
        this.showAlert = true;
        this.alertMessage =
          err.error?.message || 'Error resending verification code.';
        this.alertType = 'error';
        console.error('Error sending verification code:', err);
      },
    });
  }

  resendVerificationCode() {
    const userData = this.dataService.getUserData();
    if (userData?.emailAddress) {
      this.sendVerificationEmail(userData.emailAddress);
    } else {
      console.error('User email not found, cannot resend verification code.');
      this.showAlert = true;
      this.alertMessage = 'User email not found. Please signup again.';
      this.alertType = 'error';
      this.router.navigate(['/start/signup']);
    }
  }

  onVerifyCode() {
    if (this.verifyForm.valid) {
      this.isLoading = true;
      const verificationCode = Object.values(this.verifyForm.value).join('');
      const userData = this.dataService.getUserData();

      if (!userData || !userData.emailAddress) {
        console.error('user data not found');
        this.isLoading = false;
        this.showAlert = true;
        this.alertMessage = 'User data not found. Please signup again.';
        this.alertType = 'error';
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
            this.dataService.setHasRegisteredUser(true); // Mark user as verified

            // Navigate to the subscription page
            this.router.navigate(['/subscription']);
          },
          error: (err) => {
            this.isLoading = false;
            this.showAlert = true;
            this.alertMessage =
              err.error?.message || 'Verification failed. Please try again.';
            this.alertType = 'error';
            console.error('Verification failed:', err);
          },
        });
    } else {
      this.showAlert = true;
      this.alertMessage = 'Please enter the verification code.';
      this.alertType = 'error';
      console.log('Verification form is invalid');
    }
  }
}
