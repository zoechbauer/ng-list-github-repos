import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { GithubService, GitHubRepo, SelectOption } from '../github.service';
import { FilterPipe } from './filter.pipe';

@Component({
  selector: 'app-list-github-repos',
  templateUrl: './list-github-repos.component.html',
  styleUrls: ['./list-github-repos.component.css'],
})
export class ListGithubReposComponent implements OnInit, OnDestroy {
  repos: any = [];
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
      .getGitHubRepos()
      .subscribe((arrData: GitHubRepo[]) => {
        this.repos = arrData;
        console.log('ngOninit subscribe');
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
