import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, filter, map, tap } from 'rxjs/operators';
import { Article } from './article';
import { Response } from './response';
import { User } from './user';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  private articlesUrl = 'api';

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  private _status: User = {
    ID: 0,
    UserName: 'Guset',
    UserStatus: 0,
    exp: 0,
    iat: 0
  };

  public get status(): User {
    return this._status;
  }

  private set status(status: User) {
    this._status = status;
  }

  private _userStatus = new BehaviorSubject<User>(this.status);

  public get userStatus(): BehaviorSubject<User> {
    return this._userStatus;
  }

  private set userStatus(userStatus: BehaviorSubject<User>) {
    this._userStatus = userStatus;
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private jwt: JwtHelperService,
  ) { }

  public login(user: User): void {
    this.userStatus.next(user);
    console.log(user);
  }

  public logout(): void {
    let guest = {
      ID: 0,
      UserName: 'Guset',
      UserStatus: 0,
      exp: 0,
      iat: 0
    };
    this.userStatus.next(guest);
    localStorage.removeItem('TOKEN');
  }

  public getUserStatus(): Observable<User> {
    return this.userStatus;
  }

  public getArticles(): Observable<Response<Article[]>> {
    return this.http.get<Response<Article[]>>(this.articlesUrl)
      .pipe(
        tap(_ => console.log('fetch all article')),
        filter(article => {
          if (article.StatusCode === 200) {
            return true;
          }
          else {
            console.log(article.Message);
            alert('system error');
            return false;
          }
        }),
        catchError(this.handleError<Response<Article[]>>('getArticles', { StatusCode: 0, Message: 'failed update', Data: [] }))
      );
  }

  public getArticle(id: number): Observable<Response<Article>> {
    const url = `${this.articlesUrl}/detail/${id}`;
    return this.http.get<Response<Article>>(url).pipe(
      tap(_ => console.log('fetch article')),
      filter(article => {
        if (article.StatusCode === 200) {
          return true;
        }
        else if (article.StatusCode === 404) {
          console.log(article.Message);
          alert(article.Message);
          this.router.navigate(['articles']);
          return false;
        }
        else {
          console.log(article.Message);
          alert('system error');
          this.router.navigate(['articles']);
          return false;
        }
      }),
      catchError(this.handleError<Response<Article>>(`getArticle id=${id}`))
    );
  }

  public updateArticle(article: Article, id: number): Observable<Response<Article>> {
    const url = `${this.articlesUrl}/detail/${id}`;
    return this.http.put<Response<Article>>(url, article, this.httpOptions).pipe(
      tap(_ => console.log(`update article id=${article.ID}`)),
      filter(article => {
        if (article.StatusCode === 200) {
          return true;
        }
        else if (article.StatusCode === 404) {
          console.log(article.Message);
          alert(article.Message);
          return false;
        }
        else if (article.StatusCode === 401 || article.StatusCode === 403) {
          console.log(article.Message);
          console.log(article);
          alert(article.Message);
          this.logout();
          this.router.navigate(['login']);
          return false;
        }
        else {
          console.log(article);
          console.log(article.Message);
          alert('system error');
          return false;
        }
      }),
      catchError(this.handleError<Response<Article>>('updateArticle'))
    );
  }

  public deleteArticle(id: number): Observable<Response<Article>> {
    const url = `${this.articlesUrl}/${id}`;
    return this.http.delete<Response<Article>>(url, this.httpOptions).pipe(
      tap(_ => console.log(`delete article id=${id}`)),
      filter(article => {
        if (article.StatusCode === 200) {
          return true;
        }
        else if (article.StatusCode === 404) {
          console.log(article);
          console.log(article.Message);
          alert(article.Message);
          this.router.navigate(['articles']);
          return false;
        }
        else if (article.StatusCode === 401 || article.StatusCode === 403) {
          console.log(article.Message);
          alert(article.Message);
          this.logout();
          this.router.navigate(['login']);
          return false;
        }
        else {
          console.log(article);
          console.log(article.Message);
          alert('system error');
          return false;
        }
      }),
      catchError(this.handleError<Response<Article>>('deleteArticle'))
    );
  }

  public addArticle(article: Article): Observable<Response<Article>> {
    return this.http.post<Response<Article>>(this.articlesUrl, article, this.httpOptions,).pipe(
      tap(_ => console.log('success add a new article')),
      filter(article => {
        if (article.StatusCode === 200) {
          return true;
        }
        else if (article.StatusCode === 404) {
          console.log(article);
          console.log(article.Message);
          alert(article.Message);
          return false;
        }
        else if (article.StatusCode === 401 || article.StatusCode === 403) {
          console.log(article.Message);
          alert(article.Message);
          this.logout();
          this.router.navigate(['login']);
          return false;
        }
        else {
          console.log(article.Message);
          console.log(article);
          alert('system error');
          return false;
        }
      }),
      catchError(this.handleError<Response<Article>>('addArticle'))
    );
  }

  public searchArticle(term: string): Observable<Response<Article[]>> {
    return this.http.get<Response<Article[]>>(`${this.articlesUrl}/search/${term}`).pipe(
      tap(x => x.Data.length ? console.log(`found articles matching "${term}"`) : console.log(`no articles matching "${term}"`)),

      catchError(this.handleError<Response<Article[]>>('searchArticle'))
    );
  }

  public userLogin(name: string, password: string): Observable<Response<string>> {
    return this.http.put<Response<string>>(`${this.articlesUrl}/login`, { UserName: name, Password: password }).pipe(
      tap(_ => console.log('fetch user')),
      filter(article => {
        if (article.StatusCode === 200) {
          this.httpOptions.headers = this.httpOptions.headers.set('Authorization', article.Data);
          this.login(this.jwt.decodeToken(article.Data));
          localStorage.setItem('TOKEN', article.Data);
          return true;
        }
        else if (article.StatusCode === 404) {
          console.log(article);
          console.log(article.Message);
          alert(article.Message);
          return false;
        }
        else {
          console.log(article.Message);
          console.log(article);
          alert('system error');
          return false;
        }
      }),
      catchError(this.handleError<Response<string>>(`userLogin name=${name}`))
    );
  }

  public userSignUp(name: string, password: string): Observable<Response<User>> {
    return this.http.post<Response<User>>(`${this.articlesUrl}/sign`, { UserName: name, Password: password }).pipe(
      tap(_ => console.log('create account')),
      filter(article => {
        if (article.StatusCode === 200) {
          return true;
        }
        else if (article.StatusCode === 404) {
          console.log(article);
          console.log(article.Message);
          alert(article.Message);
          return false;
        }
        else {
          console.log(article.Message);
          alert('system error');
          return false;
        }
      }),
      catchError(this.handleError<Response<User>>(`userSignUp name=${name}`))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}