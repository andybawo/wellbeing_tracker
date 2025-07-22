import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './components/button/button.component';
import { AlertComponent } from './components/alert/alert.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';

@NgModule({
  imports: [
    CommonModule,
    ButtonComponent,
    AlertComponent,
    SidebarComponent,
    NavbarComponent,
  ],
  exports: [ButtonComponent, AlertComponent, SidebarComponent, NavbarComponent],
})
export class SharedModule {}
