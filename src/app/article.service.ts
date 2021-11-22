import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, filter, map, tap } from 'rxjs/operators';
import { Article } from './interface/article';
import { Response } from './interface/response';
import { User } from './interface/user';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { Articles } from './interface/articles';
import { newArticle } from './interface/newArticle';
import { Search } from './interface/search';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  private articlesUrl = 'api';

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  private _status: User = {
    Id: 0,
    UserName: '',
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
    const guest = {
      Id: 0,
      UserName: '',
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

  public setAuthorization(token: string): void {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', token);
  }


  public getArticles(): Observable<Response<Articles[]>> {
    return this.http.get<Response<Articles[]>>(this.articlesUrl)
      .pipe(
        tap(_ => console.log('fetch all article')),
        filter(article => {
          if (article.StatusCode === 200) {
            return true;
          }
          else {
            alert('system error');
            return false;
          }
        }),
        catchError(this.handleError<Response<Articles[]>>('getArticles', { StatusCode: 0, Message: 'failed update', Data: [] }))
      );
  }

  public getArticlesId(): Observable<Response<number[]>> {
    return this.http.get<Response<number[]>>(`${this.articlesUrl}/articleId`)
      .pipe(
        tap(_ => console.log('fetch article id array')),
        filter(article => {
          if (article.StatusCode === 200) {
            return true;
          }
          else {
            alert('system error');
            return false;
          }
        }),
        catchError(this.handleError<Response<number[]>>('getArticles', { StatusCode: 0, Message: 'failed update', Data: [] }))
      );
  }

  public getPersonalArticlesId(): Observable<Response<number[]>> {
    return this.http.get<Response<number[]>>(`${this.articlesUrl}/personalArticleId`, this.httpOptions)
      .pipe(
        tap(_ => console.log('fetch personal article id array')),
        filter(article => {
          if (article.StatusCode === 200) {
            return true;
          }
          else {
            alert('system error');
            return false;
          }
        }),
        catchError(this.handleError<Response<number[]>>('getArticles', { StatusCode: 0, Message: 'failed update', Data: [] }))
      );
  }

  public getArticleList(list: number[]): Observable<Response<Articles[]>> {
    return this.http.get<Response<Articles[]>>(`${this.articlesUrl}/list`,{params:{list: list}})
      .pipe(
        tap(_ => console.log('fetch a part of articles')),
        filter(article => {
          if (article.StatusCode === 200) {
            return true;
          }
          else if (article.StatusCode === 400) {
            alert('don\'t have request article list');
            return false;
          }
          else if (article.StatusCode === 404) {
            alert('some request article was not found');
            return false;
          }
          else {
            alert('system error');
            return false;
          }
        }),
        catchError(this.handleError<Response<Articles[]>>('getArticles', { StatusCode: 0, Message: 'failed update', Data: [] }))
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
          alert('non-exist article');
          this.router.navigate(['articles']);
          return false;
        }
        else {
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
      tap(_ => console.log(`update article id=${article.Id}`)),
      filter(article => {
        if (article.StatusCode === 200) {
          return true;
        }
        else if (article.StatusCode === 400) {
          alert('update failed, input value can\'t be null');
          return false;
        }
        else if (article.StatusCode === 401) {
          alert('token varify failed, please login again');
          this.logout();
          this.router.navigate(['login']);
          return false;
        }
        else if (article.StatusCode === 403) {
          alert('don\'t have authority');
          this.logout();
          this.router.navigate(['login']);
          return false;
        }
        else if (article.StatusCode === 404) {
          alert('update failed, cannot proccess the request');
          return false;
        }
        else if (article.StatusCode === 412) {
          alert('don\'t have token');
          this.logout();
          this.router.navigate(['login']);
          return false;
        }
        else {
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
        else if (article.StatusCode === 401) {
          alert('token varify failed, please login again');
          this.logout();
          this.router.navigate(['login']);
          return false;
        }
        else if (article.StatusCode === 403) {
          alert('don\'t have authority');
          this.logout();
          this.router.navigate(['login']);
          return false;
        }
        else if (article.StatusCode === 404) {
          alert('non-exist article');
          this.router.navigate(['articles']);
          return false;
        }
        else if (article.StatusCode === 412) {
          alert('don\'t have token');
          this.logout();
          this.router.navigate(['login']);
          return false;
        }
        else {
          alert('system error');
          return false;
        }
      }),
      catchError(this.handleError<Response<Article>>('deleteArticle'))
    );
  }

  public addArticle(article: newArticle): Observable<Response<Article>> {
    return this.http.post<Response<Article>>(`${this.articlesUrl}/article`, article, this.httpOptions).pipe(
      tap(_ => console.log('success add a new article')),
      filter(article => {
        if (article.StatusCode === 200) {
          return true;
        }
        else if (article.StatusCode === 400) {
          alert('create failed, input value can\'t be null');
          return false;
        }
        else if (article.StatusCode === 401) {
          alert('token varify failed, please login again');
          this.logout();
          this.router.navigate(['login']);
          return false;
        }
        else if (article.StatusCode === 403) {
          alert('don\'t have authority');
          this.logout();
          this.router.navigate(['login']);
          return false;
        }
        else if (article.StatusCode === 412) {
          alert('don\'t have token');
          this.logout();
          this.router.navigate(['login']);
          return false;
        }
        else {
          alert('system error');
          return false;
        }
      }),
      catchError(this.handleError<Response<Article>>('addArticle'))
    );
  }

  public advanceSearch(value: Search): Observable<Response<number[]>> {
    return this.http.get<Response<number[]>>(`${this.articlesUrl}/search`, { params: { title: value.Title, author: value.Author, fromDate: value.FromDate, toDate: value.ToDate}}).pipe(
      tap(x => x.Data.length ? console.log(`found articles matching`) : console.log(`no articles matching`)),
      filter(article => {
        if (article.StatusCode === 200) {
          return true;
        }
        else if (article.StatusCode === 400) {
          alert('don\'t input any condition');
          return false;
        }
        else if (article.StatusCode === 404) {
          alert('no search result');
          return false;
        }
        else {
          alert('system error');
          return false;
        }
      }),
      catchError(this.handleError<Response<number[]>>('searchArticle'))
    );
  }

  public searchArticle(term: string): Observable<Response<Articles[]>> {
    return this.http.get<Response<Articles[]>>(`${this.articlesUrl}/search/${term}`).pipe(
      tap(x => x.Data.length ? console.log(`found articles matching "${term}"`) : console.log(`no articles matching "${term}"`)),
      filter(article => {
        if (article.StatusCode === 200) {
          return true;
        }
        else {
          alert('system error');
          return false;
        }
      }),
      catchError(this.handleError<Response<Articles[]>>('searchArticle'))
    );
  }

  public userLogin(name: string, password: string): Observable<Response<string>> {
    return this.http.post<Response<string>>(`${this.articlesUrl}/login`, { UserName: name, Password: password }).pipe(
      tap(_ => console.log('fetch user')),
      filter(article => {
        if (article.StatusCode === 200) {
          this.setAuthorization(article.Data);
          this.login(this.jwt.decodeToken(article.Data));
          localStorage.setItem('TOKEN', article.Data);
          return true;
        }
        else if (article.StatusCode === 400) {
          alert('input value can\'t be null');
          return false;
        }
        else if (article.StatusCode === 404) {
          alert('incorrect username or password');
          return false;
        }
        else {
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
        else if (article.StatusCode === 400) {
          alert('input value can\'t be null');
          return false;
        }
        else if (article.StatusCode === 404) {
          alert('existed username');
          return false;
        }
        else {
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