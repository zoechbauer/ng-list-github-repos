import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface GitHubRepo {
  // TODO
  name1: string;
  name2: string;
}

export interface SelectOption {
  name: string;
  value: string;
}

@Injectable({
  providedIn: 'root',
})
export class GithubService {
  constructor(private http: HttpClient) {}

  getUrl() {
    // TODO
    return 'https://api.github.com/users/zoechbauer';
    // return 'https://api.github.com/orgs/angular/repos';
  }

  getGitHubRepos(): Observable<GitHubRepo[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const options = {
      headers: headers,
      crossDomain: true,
    };
    return this.http.get<GitHubRepo[]>(this.getUrl(), options).pipe(
      tap((repos: GitHubRepo[]) => {
        console.log('repos', repos);
      }),
      catchError((err) => {
        console.log(err);
        return throwError(err);
      })
    );
  }
}
