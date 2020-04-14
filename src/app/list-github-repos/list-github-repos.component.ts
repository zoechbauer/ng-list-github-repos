import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Subject, Observable } from 'rxjs';
import { GithubService } from '../service/github.service';
import { GitHubOrgRepo } from '../service/githubOrganization.model';
import { SelectOption } from '../service/selectOption.model';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  filter,
} from 'rxjs/operators';

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
  totalCountOrgSubscription: Subscription;
  // form properties
  filterProp = 'name';
  filterProperties: SelectOption[] = [];
  sortProp = 'A';
  searchText = '';
  searchTextLabelForText = 'Filter repos in FilterBy Column within ORG';
  searchTextLabelForNumbers = 'Filter repos with value greater than ';
  searchOrg = 'Angular';
  // search repos
  errors = false;
  pageNumber: number;
  searchTextOld = '';
  // search Organizations
  resultsOrg: Observable<any>;
  latestSearchOrg = new Subject<string>();
  // switch between ORG grid and repos grid
  showOrganizations = false;
  // show if all organizations of selection are displayed
  allOrgs = true;
  totalCountSelectedOrg = 0;

  constructor(private githubService: GithubService) {}

  ngOnInit(): void {
    this.filterProperties = this.githubService.getFilterProperties();

    // get first 100 organization Login name that filter the entered ORG text
    this.resultsOrg = this.latestSearchOrg.pipe(
      debounceTime(750),
      distinctUntilChanged(),
      filter((searchText) => !!searchText),
      switchMap((searchText) =>
        this.githubService.getGithubOrganizations(searchText)
      )
    );
    // info if all organizations are displayed
    this.totalCountOrgSubscription = this.githubService.totalCountOrgSubject.subscribe(
      (totalCount) => {
        this.totalCountSelectedOrg = totalCount;
        this.allOrgs = totalCount < 100 ? true : false;
      }
    );

    // github api is called in a loop until all records of the organization are received
    // whenever a next Page Number oberservable arrives, the api is called
    this.githubService.pageNumberSubject.subscribe((nextPageNumber) => {
      this.pageNumber = nextPageNumber;
      console.log('Loop api: pageNumber', this.pageNumber);

      this.getGitHubOrgReposSubscription = this.githubService
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
            this.searchText = this.searchTextOld;
            console.log('ERR in filterRepos', errors);
          }
        );
    });
  }

  ngOnDestroy() {
    this.getGitHubOrgReposSubscription.unsubscribe();
    this.totalCountOrgSubscription.unsubscribe();
  }

  // filter repos of selected organization and searchText
  filterRepos() {
    // wait until api loop is closed
    if (this.searchText === this.BUSY_TEXT) {
      return;
    }
    this.showOrganizations = false;
    this.searchTextOld = this.searchText;
    this.searchText = this.BUSY_TEXT;
    this.repos = [];
    this.pageNumber = 1;
    this.githubService.pageNumberSubject.next(this.pageNumber);
  }

  // filter organizations
  filterOrganization(searchText: string) {
    this.showOrganizations = true;
    this.latestSearchOrg.next(searchText);
  }

  // fill search Organization field with selected Organization login name
  onClickOrganization(event: Event) {
    console.log(event);
    this.searchOrg = (event.target as HTMLElement).innerText;
  }
}
