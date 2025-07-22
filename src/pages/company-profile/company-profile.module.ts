import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileLayoutComponent } from './components/profile-layout/profile-layout.component';
import { CompanyProfileRoutingModule } from './company-profile-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CompanyProfileRoutingModule,
    ProfileLayoutComponent // Importing the standalone component
  ]
})
export class CompanyProfileModule { }
