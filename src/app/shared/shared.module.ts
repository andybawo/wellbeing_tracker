import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './components/button/button.component';
import { AlertComponent } from './components/alert/alert.component';

@NgModule({
  imports: [CommonModule, ButtonComponent, AlertComponent],
  exports: [ButtonComponent, AlertComponent],
})
export class SharedModule {}
