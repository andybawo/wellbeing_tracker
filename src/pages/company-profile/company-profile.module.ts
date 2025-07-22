import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileLayoutComponent } from './components/profile-layout/profile-layout.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CompanyProfileRoutingModule } from './company-profile-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CompanyProfileRoutingModule,
    ProfileLayoutComponent, 
    ProfileComponent 
  ]
})
export class CompanyProfileModule { }
