import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './components/button/button.component';
import { AlertComponent } from './components/alert/alert.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@NgModule({
  imports: [CommonModule, ButtonComponent, AlertComponent, SidebarComponent],
  exports: [ButtonComponent, AlertComponent, SidebarComponent],
})
export class SharedModule {}
