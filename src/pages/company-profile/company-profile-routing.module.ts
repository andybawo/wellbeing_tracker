import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileLayoutComponent } from './components/profile-layout/profile-layout.component';
import { DepartmentComponent } from './components/department/department.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileLayoutComponent,
  },
  {
    path: 'department',
    component: DepartmentComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyProfileRoutingModule {}
