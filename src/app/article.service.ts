import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, filter   } from 'rxjs/operators';
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
    Name: '',
    Status: 0,
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
  }

  public logout(): void {
    const guest = {
      Id: 0,
      Name: '',
      Status: 0,
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

  public getArticlesId(): Observable<Response<number[]>> {
    return this.http.get<Response<number[]>>(`${this.articlesUrl}/articleId`)
      .pipe(
        filter(article => {
          if (article.StatusCode === 200) {
            return true;
          }
          else {
            alert('系統錯誤');
            return false;
          }
        }),
        catchError(this.handleError<Response<number[]>>('getArticles', { StatusCode: 0, Message: 'failed update', Data: [] }))
      );
  }

  public getPersonalArticlesId(): Observable<Response<number[]>> {
    return this.http.get<Response<number[]>>(`${this.articlesUrl}/personalArticleId`, this.httpOptions)
      .pipe(
        filter(article => {
          if (article.StatusCode === 200) {
            return true;
          }
          else if (article.StatusCode === 401) {
            alert('無效的憑證，請重新登入');
            this.logout();
            this.router.navigate(['login']);
            return false;
          }
          else if (article.StatusCode === 403) {
            alert('無操作權限');
            this.logout();
            this.router.navigate(['login']);
            return false;
          }
          else if (article.StatusCode === 412) {
            alert('憑證不存在');
            this.logout();
            this.router.navigate(['login']);
            return false;
          }
          else {
            alert('系統錯誤');
            return false;
          }
        }),
        catchError(this.handleError<Response<number[]>>('getArticles', { StatusCode: 0, Message: 'failed update', Data: [] }))
      );
  }

  public getArticleList(list: number[]): Observable<Response<Articles[]>> {
    return this.http.get<Response<Articles[]>>(`${this.articlesUrl}/list`, { params: { list: list } })
      .pipe(
        filter(article => {
          if (article.StatusCode === 200) {
            return true;
          }
          else if (article.StatusCode === 400) {
            return false;
          }
          else if (article.StatusCode === 404) {
            alert('部分文章已異動，請重新整理');
            return false;
          }
          else {
            alert('系統錯誤');
            return false;
          }
        }),
        catchError(this.handleError<Response<Articles[]>>('getArticles', { StatusCode: 0, Message: 'failed update', Data: [] }))
      );
  }

  public getArticle(id: number): Observable<Response<Article>> {
    const url = `${this.articlesUrl}/detail/${id}`;
    return this.http.get<Response<Article>>(url).pipe(
      filter(article => {
        if (article.StatusCode === 200) {
          return true;
        }
        else if (article.StatusCode === 404) {
          alert('文章不存在');
          this.router.navigate(['articles']);
          return false;
        }
        else {
          alert('系統錯誤');
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
      filter(article => {
        if (article.StatusCode === 200) {
          return true;
        }
        else if (article.StatusCode === 400) {
          alert('更新失敗，輸入欄位不可為空');
          return false;
        }
        else if (article.StatusCode === 401) {
          alert('無效的憑證，請重新登入');
          this.logout();
          this.router.navigate(['login']);
          return false;
        }
        else if (article.StatusCode === 403) {
          alert('無操作權限');
          this.logout();
          this.router.navigate(['login']);
          return false;
        }
        else if (article.StatusCode === 404) {
          alert('建立失敗，無法處理請求');
          return false;
        }
        else if (article.StatusCode === 412) {
          alert('憑證不存在');
          this.logout();
          this.router.navigate(['login']);
          return false;
        }
        else {
          alert('系統錯誤');
          return false;
        }
      }),
      catchError(this.handleError<Response<Article>>('updateArticle'))
    );
  }

  public deleteArticle(id: number): Observable<Response<Article>> {
    const url = `${this.articlesUrl}/${id}`;
    return this.http.delete<Response<Article>>(url, this.httpOptions).pipe(
      filter(article => {
        if (article.StatusCode === 200) {
          return true;
        }
        else if (article.StatusCode === 401) {
          alert('無效的憑證，請重新登入');
          this.logout();
          this.router.navigate(['login']);
          return false;
        }
        else if (article.StatusCode === 403) {
          alert('無操作權限');
          this.logout();
          this.router.navigate(['login']);
          return false;
        }
        else if (article.StatusCode === 404) {
          alert('文章不存在');
          this.router.navigate(['articles']);
          return false;
        }
        else if (article.StatusCode === 412) {
          alert('憑證不存在');
          this.logout();
          this.router.navigate(['login']);
          return false;
        }
        else {
          alert('系統錯誤');
          return false;
        }
      }),
      catchError(this.handleError<Response<Article>>('deleteArticle'))
    );
  }

  public addArticle(article: newArticle): Observable<Response<Article>> {
    return this.http.post<Response<Article>>(`${this.articlesUrl}/article`, article, this.httpOptions).pipe(
      filter(article => {
        if (article.StatusCode === 200) {
          return true;
        }
        else if (article.StatusCode === 400) {
          alert('建立失敗，輸入欄位不可為空');
          return false;
        }
        else if (article.StatusCode === 401) {
          alert('無效的憑證，請重新登入');
          this.logout();
          this.router.navigate(['login']);
          return false;
        }
        else if (article.StatusCode === 403) {
          alert('無操作權限');
          this.logout();
          this.router.navigate(['login']);
          return false;
        }
        else if (article.StatusCode === 412) {
          alert('憑證不存在');
          this.logout();
          this.router.navigate(['login']);
          return false;
        }
        else {
          alert('系統錯誤');
          return false;
        }
      }),
      catchError(this.handleError<Response<Article>>('addArticle'))
    );
  }

  public advanceSearch(value: Search): Observable<Response<number[]>> {
    return this.http.get<Response<number[]>>(`${this.articlesUrl}/search`, { params: { title: value.Title, author: value.Author, fromDate: value.FromDate, toDate: value.ToDate } }).pipe(
      filter(article => {
        if (article.StatusCode === 200) {
          return true;
        }
        else if (article.StatusCode === 400) {
          alert('請輸入查詢條件');
          return false;
        }
        else if (article.StatusCode === 404) {
          return true;
        }
        else {
          alert('系統錯誤');
          return false;
        }
      }),
      catchError(this.handleError<Response<number[]>>('searchArticle'))
    );
  }

  public searchArticle(term: string): Observable<Response<Articles[]>> {
    return this.http.get<Response<Articles[]>>(`${this.articlesUrl}/search/${term}`).pipe(
      filter(article => {
        if (article.StatusCode === 200) {
          return true;
        }
        else {
          alert('系統錯誤');
          return false;
        }
      }),
      catchError(this.handleError<Response<Articles[]>>('searchArticle'))
    );
  }

  public userLogin(name: string, password: string): Observable<Response<string>> {
    return this.http.post<Response<string>>(`${this.articlesUrl}/login`, { UserName: name, Password: password }).pipe(
      filter(article => {
        if (article.StatusCode === 200) {
          this.setAuthorization(article.Data);
          this.login(this.jwt.decodeToken(article.Data));
          localStorage.setItem('TOKEN', article.Data);
          return true;
        }
        else if (article.StatusCode === 400) {
          alert('輸入欄位不可為空');
          return false;
        }
        else if (article.StatusCode === 404) {
          alert('帳號或密碼錯誤');
          return false;
        }
        else {
          alert('系統錯誤');
          return false;
        }
      }),
      catchError(this.handleError<Response<string>>(`userLogin name=${name}`))
    );
  }

  public userSignUp(name: string, password: string): Observable<Response<User>> {
    return this.http.post<Response<User>>(`${this.articlesUrl}/sign`, { UserName: name, Password: password }).pipe(
      filter(article => {
        if (article.StatusCode === 200) {
          return true;
        }
        else if (article.StatusCode === 400) {
          alert('輸入欄位不可為空');
          return false;
        }
        else if (article.StatusCode === 404) {
          alert('使用者名稱已存在');
          return false;
        }
        else {
          alert('系統錯誤');
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