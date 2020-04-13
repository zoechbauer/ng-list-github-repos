import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { GithubService } from '../service/github.service';
import { GitHubOrgRepo } from '../service/githubOrganization.model';
import { SelectOption } from '../service/selectOption.model';

@Component({
  selector: 'app-list-github-repos',
  templateUrl: './list-github-repos.component.html',
  styleUrls: ['./list-github-repos.component.css'],
})
export class ListGithubReposComponent implements OnInit, OnDestroy {
  BUSY_TEXT = 'please wait ...';
  repos: GitHubOrgRepo[] = [];
  subscription: Subscription;
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
    this.filterProperties = this.githubService.getFilterProperties();

    // github api is called in a loop until all records of the organization are received
    // whenever a next Page Number oberservable arrives, the api is called
    this.githubService.pageNumberSubject.subscribe((nextPageNumber) => {
      this.pageNumber = nextPageNumber;
      console.log('Loop api: pageNumber', this.pageNumber);

      this.subscription = this.githubService
        .getGitHubOrgRepos(this.searchOrg, this.pageNumber)
        .subscribe(
          (repos: GitHubOrgRepo[]) => {
            this.errors = false;
            // end loop if empty array returned
            this.pageNumber = repos.length > 0 ? this.pageNumber++ : 0;
            if (this.pageNumber > 0) {
              // add repos to array
              this.repos.push(...repos);
            } else {
              this.searchText = this.searchTextOld;
            }
            console.log(
              'currentRepos & totalRepos',
              repos.length,
              this.repos.length
            );
          },
          (errors) => {
            this.errors = true;
            console.log('ERR in filterRepos', errors);
          }
        );
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  filterRepos() {
    // wait until api loop is closed
    if (this.searchText === this.BUSY_TEXT) {
      return;
    }
    this.searchTextOld = this.searchText;
    this.searchText = this.BUSY_TEXT;
    this.repos = [];
    this.pageNumber = 1;
    this.githubService.pageNumberSubject.next(this.pageNumber);
  }
}
