import { Injectable } from '@angular/core';
import { Observable, throwError, Subject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GitHubOrgRepo } from './githubOrganization.model';
import { SelectOption } from './selectOption.model';

@Injectable({
  providedIn: 'root',
})
export class GithubService {
  private filterProps: SelectOption[] = [
    { name: 'Name', value: 'name' },
    { name: 'Description', value: 'description' },
    { name: 'Language', value: 'language' },
    { name: 'Watchers', value: 'watchers' },
    { name: 'Forks', value: 'forks' },
    { name: 'Size', value: 'size' },
  ];

  private filterOrg: string;
  private pageNumber: number;
  pageNumberSubject = new Subject<number>();

  constructor(private http: HttpClient) {}

  DETAIL_LOG_INFOS = false;

  getUrl() {
    // return 'https://api.github.com/users/zoechbauer';
    // return 'https://api.github.com/search/users?q=type:org';

    // return 'https://api.github.com/orgs/angular/repos';
    const baseUrl = 'https://api.github.com/';
    const url = `${baseUrl}orgs/${this.filterOrg.toLocaleLowerCase()}/repos?${this.getPage()}`;
    console.log(url);
    return url;
  }

  getPage(): string {
    // for organization repos you cannot search for the required sesarch fields
    // how can I search?
    // I increased resultset from 30 items per page to the allowed maximum & I am using pagination to get all records
    return `page=${this.pageNumber}&per_page=100`;
  }

  getGitHubOrgRepos(
    org: string,
    pageNumber: number
  ): Observable<GitHubOrgRepo[]> {
    this.filterOrg = org;
    this.pageNumber = pageNumber;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github.v3.+json',
    });
    const options = {
      headers: headers,
      crossDomain: true,
    };
    return this.http.get<GitHubOrgRepo[]>(this.getUrl(), options).pipe(
      tap((repos: GitHubOrgRepo[]) => {
        console.log('repos', repos);
        // loop through api until all records are retrieved
        const nextPageNumber = repos.length > 0 ? this.pageNumber + 1 : 0;
        if (nextPageNumber > 0) {
          this.pageNumberSubject.next(nextPageNumber);
        }
        if (this.DETAIL_LOG_INFOS) {
          repos.forEach((repo) => {
            console.log(
              repo.full_name,
              repo.name,
              repo.private,
              repo.owner.login,
              repo.description,
              repo.html_url,
              repo.homepage,
              repo.size,
              repo.language,
              repo.has_wiki
            );
          });
        }
      }),
      catchError((err) => {
        console.log(err);
        return throwError(err);
      })
    );
  }

  getFilterProperties(): SelectOption[] {
    return this.filterProps.slice();
  }
}
