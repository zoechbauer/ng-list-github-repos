import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
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

  constructor(private http: HttpClient) {}

  DETAIL_LOG_INFOS = false;

  getUrl(org: string) {
    // return 'https://api.github.com/users/zoechbauer';
    // return 'https://api.github.com/search/users?q=type:org';

    // return 'https://api.github.com/orgs/angular/repos';
    const baseUrl = 'https://api.github.com/';
    const url = `${baseUrl}orgs/${org.toLocaleLowerCase()}/repos`;
    console.log(url);
    return url;
  }

  getGitHubOrgRepos(org: string): Observable<GitHubOrgRepo[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github.v3.+json',
    });
    const options = {
      headers: headers,
      crossDomain: true,
    };
    return this.http.get<GitHubOrgRepo[]>(this.getUrl(org), options).pipe(
      tap((repos: GitHubOrgRepo[]) => {
        console.log('repos', repos);
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
