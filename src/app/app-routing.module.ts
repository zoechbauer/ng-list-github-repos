import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListGithubReposComponent } from './list-github-repos/list-github-repos.component';
import { ListOrganizationsComponent } from './list-organizations/list-organizations.component';

const routes: Routes = [
  { path: '', redirectTo: '/repos/api', pathMatch: 'full' },
  { path: 'repos/api', component: ListGithubReposComponent },
  { path: 'org/api', component: ListOrganizationsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
