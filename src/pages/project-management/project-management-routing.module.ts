import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectLayoutComponent } from './components/project-layout/project-layout.component';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { ViewProjectsComponent } from './components/view-projects/view-projects.component';

const routes: Routes = [
  {
    path: '',
    component: ProjectLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'project-list',
        pathMatch: 'full',
      },
      {
        path: 'project-list',
        component: ProjectListComponent,
      },
      {
        path: 'view-projects/:id',
        component: ViewProjectsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectManagementRoutingModule {}
