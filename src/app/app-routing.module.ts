import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListGithubReposComponent } from './list-github-repos/list-github-repos.component';

const routes: Routes = [
  { path: '', redirectTo: '/repos/api', pathMatch: 'full' },
  { path: 'repos/api', component: ListGithubReposComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
