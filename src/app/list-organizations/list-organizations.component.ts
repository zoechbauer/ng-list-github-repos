import { Component, OnInit, OnDestroy, Output } from '@angular/core';
import { Subscription, Observable, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  filter,
} from 'rxjs/operators';
import { GithubService } from '../service/github.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-organizations',
  templateUrl: './list-organizations.component.html',
  styleUrls: ['./list-organizations.component.css'],
})
export class ListOrganizationsComponent implements OnInit, OnDestroy {
  searchOrg = 'Angular';
  // switch between ORG grid and repos grid
  showOrganizations = false;
  totalCountOrgSubscription: Subscription;
  // search Organizations
  resultsOrg: Observable<any>;
  latestSearchOrg = new Subject<string>();
  // show if all organizations of selection are displayed
  allOrgs = true;
  totalCountSelectedOrg = 0;

  constructor(private githubService: GithubService, private router: Router) {}

  ngOnInit(): void {
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
  }

  // emit selected org to parent which will hide this component
  onClickOrganization(event: Event) {
    const selectedOrg = (event.target as HTMLElement).innerText;
    this.githubService.selectedOrg.next(selectedOrg);
    this.router.navigate(['/repos/api']);
  }

  // filter organizations
  filterOrganization(searchText: string) {
    this.latestSearchOrg.next(searchText);
  }

  ngOnDestroy() {
    if (this.totalCountOrgSubscription) {
      this.totalCountOrgSubscription.unsubscribe();
    }
  }
}
