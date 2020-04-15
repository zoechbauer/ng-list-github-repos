import { Injectable } from '@angular/core';
import { Observable, throwError, Subject } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
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
  totalCountOrgSubject = new Subject<number>();
  selectedOrg = new Subject<string>();

  constructor(private http: HttpClient) {}

  DETAIL_LOG_INFOS = false;

  UrlType = {
    Organization: 1,
    OrganizationRepositories: 2,
  };

  getUrl(urlType: any, org: string) {
    // return 'https://api.github.com/users/zoechbauer';
    // return 'https://api.github.com/search/users?q=type:org';

    let baseUrl = '';
    let query = '';
    let url = '';

    switch (urlType) {
      case this.UrlType.Organization:
        // const url = 'https://api.github.com/organizations';
        baseUrl = 'https://api.github.com/search/users';
        query = `?q=${org} type:organization&per_page=100`;
        break;

      case this.UrlType.OrganizationRepositories:
        // return 'https://api.github.com/orgs/angular/repos';
        baseUrl = `https://api.github.com/orgs/${this.filterOrg.toLocaleLowerCase()}/repos`;
        query = `?${this.getPage()}`;
        break;
    }
    url = baseUrl + query;
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
    return this.http
      .get<GitHubOrgRepo[]>(
        this.getUrl(this.UrlType.OrganizationRepositories, org),
        options
      )
      .pipe(
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

  getGithubOrganizations(org: string) {
    return this.http.get(this.getUrl(this.UrlType.Organization, org)).pipe(
      tap((res: any) => {
        // console.log('items', res);
        // const items = res.items;
        // console.log(items[0].login);
        console.log('total_count', res.total_count);
        this.totalCountOrgSubject.next(res.total_count);
      }),
      map((res: any) =>
        res.items.map((item) => {
          const obj = {
            login: item.login,
            avatar: item.avatar_url,
            url: item.html_url,
          };
          return obj;
        })
      )
    );
  }
}
