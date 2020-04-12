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
  sortProp = 'A';
  searchText = '';
  searchTextLabelForText =
    'Filter repos in FilterBy Column within Organization';
  searchTextLabelForNumbers =
    'Filter repos with value in FilterBy Column greater than ';
  searchOrg = 'Angular';
  errors = false;
  pageNumber: number;
  searchTextOld = '';

  constructor(private githubService: GithubService) {}

  ngOnInit(): void {
    // this.formSubscription = this.filterForm.valueChanges.subscribe((values) => {
    //   console.log(this.filterProp);
    //   console.log('FormValues', this.filterForm.value);
    // });

    this.filterProperties = this.githubService.getFilterProperties();

    // github api is called in a loop until all records of the organization are received
    this.githubService.pageNumberSubject.subscribe((nextPageNumber) => {
      this.pageNumber = nextPageNumber;
      console.log('Loop api: pageNumber', this.pageNumber);
      this.filterReposApi();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    // this.formSubscription.unsubscribe();
  }

  filterRepos() {
    this.searchTextOld = this.searchText;
    this.searchText = 'please wait ...';
    this.repos = [];
    this.pageNumber = 1;
    this.filterReposApi();
  }

  filterReposApi() {
    this.subscription = this.githubService
      .getGitHubOrgRepos(this.searchOrg, this.pageNumber)
      .subscribe(
        (repos: GitHubOrgRepo[]) => {
          // add repos to array
          this.repos.push(...repos);
          this.errors = false;
          // increment pagenumber or exit api
          this.pageNumber = repos.length > 0 ? this.pageNumber++ : 0;
          if (this.pageNumber === 0) {
            this.searchText = this.searchTextOld;
          }
          console.log('api-repos this.repos', repos.length, this.repos.length);
        },
        (errors) => {
          this.errors = true;
          console.log('ERR in filterRepos', errors);
        }
      );
  }
}
