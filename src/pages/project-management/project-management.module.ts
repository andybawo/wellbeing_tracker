import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectManagementRoutingModule } from './project-management-routing.module';
import { ProjectLayoutComponent } from './components/project-layout/project-layout.component';
import { ViewProjectsComponent } from './components/view-projects/view-projects.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ProjectManagementRoutingModule,
    ProjectLayoutComponent,
    ViewProjectsComponent,
  ],
})
export class ProjectManagementModule {}
