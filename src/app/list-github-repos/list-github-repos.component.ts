import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { GithubService } from '../service/github.service';
import { GitHubOrgRepo } from '../service/githubOrganization.model';
import { SelectOption } from '../service/selectOption.model';
import { FilterPipe } from './filter.pipe';

@Component({
  selector: 'app-list-github-repos',
  templateUrl: './list-github-repos.component.html',
  styleUrls: ['./list-github-repos.component.css'],
})
export class ListGithubReposComponent implements OnInit, OnDestroy {
  repos: GitHubOrgRepo[] = [];
  subscription: Subscription;
  sortProp = '';
  filterProp = '';
  searchText = '';
  sortProperties: SelectOption[] = [];

  constructor(
    private githubService: GithubService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.subscription = this.githubService
      .getGitHubOrgRepos()
      .subscribe((arrData: GitHubOrgRepo[]) => {
        this.repos = arrData;
        console.log('repos count', this.repos.length);
      });
  }

  onSortChange() {
    console.log(this.sortProp);
  }

  onFilterChange() {
    console.log(this.filterProp);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  filterRepos() {
    console.log('filtern');
  }
}
