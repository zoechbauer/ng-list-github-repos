import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

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
    return 'http://github.com/zoechbauer';
  }

  getGitHubRepos(): Observable<GitHubRepo[]> {
    return this.http.get<GitHubRepo[]>(this.getUrl()).pipe(
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
