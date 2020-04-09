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

  getUrl() {
    // TODO change hardcoded organization - input field
    // return 'https://api.github.com/users/zoechbauer';
    // return 'https://api.github.com/search/users?q=type:org';
    return 'https://api.github.com/orgs/angular/repos';
  }

  getGitHubOrgRepos(): Observable<GitHubOrgRepo[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const options = {
      headers: headers,
      crossDomain: true,
    };
    return this.http.get<GitHubOrgRepo[]>(this.getUrl(), options).pipe(
      tap((repos: GitHubOrgRepo[]) => {
        console.log('repos', repos);
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
