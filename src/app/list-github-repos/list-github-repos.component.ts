import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Subject, Observable } from 'rxjs';
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
  // array for returned api repos
  repos: GitHubOrgRepo[] = [];
  // for unsubscribe
  getGitHubOrgReposSubscription: Subscription;

  // form properties
  filterProp = 'name';
  filterProperties: SelectOption[] = [];
  sortProp = 'A';
  searchText = '';
  searchTextLabelForText = 'Filter repos in FilterBy Column within ORG';
  searchTextLabelForNumbers = 'Filter repos with value greater than ';
  searchOrg: string;
  // search repos
  errors = false;
  pageNumber: number;
  searchTextOld = '';

  constructor(private githubService: GithubService) {}

  ngOnInit(): void {
    this.filterProperties = this.githubService.getFilterProperties();

    // store selected organization in org search field
    this.githubService.selectedOrg.subscribe((selectedOrg) => {
      this.searchOrg = selectedOrg;
    });

    // github api is called in a loop until all records of the organization are received
    // whenever a next Page Number oberservable arrives, the api is called
    this.githubService.pageNumberSubject.subscribe((nextPageNumber) => {
      this.pageNumber = nextPageNumber;
      console.log('Loop api: pageNumber', this.pageNumber);

      this.getGitHubOrgReposSubscription = this.githubService
        .getGitHubOrgRepos(this.searchOrg, this.pageNumber)
        .subscribe(
          (repos: GitHubOrgRepo[]) => {
            // end loop if empty array returned
            this.pageNumber = repos.length > 0 ? this.pageNumber++ : 0;
            if (this.pageNumber > 0) {
              // add repos to array
              this.repos.push(...repos);
            } else {
              this.searchText = this.searchTextOld;
            }
            this.errors = false;
            console.log(
              'currentRepos & totalRepos',
              repos.length,
              this.repos.length
            );
          },
          (errors) => {
            this.errors = true;
            this.searchText = this.searchTextOld;
            console.log('ERR in filterRepos', errors);
          }
        );
    });
  }

  ngOnDestroy() {
    if (this.getGitHubOrgReposSubscription) {
      this.getGitHubOrgReposSubscription.unsubscribe();
    }
  }

  // filter repos of selected organization and searchText
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
