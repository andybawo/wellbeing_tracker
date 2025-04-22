import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  userForm: FormGroup = new FormGroup({
    fullName: new FormControl('', [Validators.required]),
    email: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(private router: Router) {}

  onUserSave() {
    const formValue = this.userForm.value;
    debugger;
    this.router.navigate(['/start/verify']);
  }
}
