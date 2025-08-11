import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileLayoutComponent } from './components/profile-layout/profile-layout.component';
import { CompanyProfileRoutingModule } from './company-profile-routing.module';
import { DepartmentComponent } from './components/department/department.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RoleComponent } from './components/role/role.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CompanyProfileRoutingModule,
    ProfileLayoutComponent,
    DepartmentComponent,
    RoleComponent,
    ReactiveFormsModule,
  ],
})
export class CompanyProfileModule {}
