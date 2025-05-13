import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() paymentDetails = new EventEmitter<any>();

  closeModal() {
    this.close.emit();
  }

  bankDetailsForm = new FormGroup({
    accountNumber: new FormControl('', Validators.required),
    bankName: new FormControl('', Validators.required),
  });

  onSubmitPayment(): void {
    if (this.bankDetailsForm.valid) {
      this.paymentDetails.emit(this.bankDetailsForm.value);
    } else {
      console.warn('Bank details are invalid.');
    }
  }
}
