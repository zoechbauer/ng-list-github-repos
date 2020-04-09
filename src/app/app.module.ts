import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListGithubReposComponent } from './list-github-repos/list-github-repos.component';
import { HeaderComponent } from './header/header.component';
import { FilterPipe } from './list-github-repos/filter.pipe';

@NgModule({
  declarations: [
    AppComponent,
    ListGithubReposComponent,
    HeaderComponent,
    FilterPipe,
  ],
  imports: [BrowserModule, FormsModule, AppRoutingModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
