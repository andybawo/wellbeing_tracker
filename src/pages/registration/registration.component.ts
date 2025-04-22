import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-registration',
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent {
  compUserForm: FormGroup = new FormGroup({
    compName: new FormControl(''),
    compType: new FormControl(''),
    compLocation: new FormControl(''),
    compAddress: new FormControl(''),
  });
}
