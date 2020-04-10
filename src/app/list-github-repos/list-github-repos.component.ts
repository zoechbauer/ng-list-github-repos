import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { GithubService } from '../service/github.service';
import { GitHubOrgRepo } from '../service/githubOrganization.model';
import { SelectOption } from '../service/selectOption.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-list-github-repos',
  templateUrl: './list-github-repos.component.html',
  styleUrls: ['./list-github-repos.component.css'],
})
export class ListGithubReposComponent implements OnInit, OnDestroy {
  // @ViewChild('filterForm', { static: true }) filterForm: NgForm;
  repos: GitHubOrgRepo[] = [];
  subscription: Subscription;
  // formSubscription: Subscription;
  filterProp = 'name';
  filterProperties: SelectOption[] = [];
  searchText = '';
  searchTextLabelForText =
    'Filter repos in FilterBy Column within Organization';
  searchTextLabelForNumbers =
    'Filter repos with value in FilterBy Column greater than ';
  searchOrg = 'Angular';
  errors = false;

  constructor(private githubService: GithubService) {}

  ngOnInit(): void {
    // this.formSubscription = this.filterForm.valueChanges.subscribe((values) => {
    //   console.log(this.filterProp);
    //   console.log('FormValues', this.filterForm.value);
    // });

    this.filterProperties = this.githubService.getFilterProperties();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    // this.formSubscription.unsubscribe();
  }

  filterRepos() {
    this.subscription = this.githubService
      .getGitHubOrgRepos(this.searchOrg)
      .subscribe(
        (repos: GitHubOrgRepo[]) => {
          this.repos = repos;
          this.errors = false;
          console.log('repos count', this.repos.length);
        },
        (errors) => {
          this.errors = true;
        }
      );
  }
}
