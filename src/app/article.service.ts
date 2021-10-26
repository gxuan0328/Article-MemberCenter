import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, filter, tap } from 'rxjs/operators';
import { Article } from './article';
import { Response } from './response';
import { User } from './user';
@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  
  private articlesUrl = 'api';
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  

  flag: boolean =false;
  userID: number = 0;
  userName: string = 'Guset';

  constructor(private http: HttpClient) { }

  public Login(user: User): void {
    this.flag = true;
    this.userID = user.UserID;
    this.userName = user.UserName;
  }

  public Logout(): void {
    this.flag = false;
    this.userID = 0;
    this.userName = 'Guset';
  }

  public userStatus() {
    return {
      flag: this.flag,
      userID: this.userID,
      userName:this.userName,
    };
  }

  public getArticles(): Observable<Response<Article[]>> {
    return this.http.get<Response<Article[]>>(this.articlesUrl)
      .pipe(
        tap(_ => console.log('fetch article')),
        filter(article => {
          if (article.StatusCode === 200) {
            return true;
          }
          else{
            console.log(article.Message);
            alert('system error');
            return false;
          }
        }),
        catchError(this.handleError<Response<Article[]>>('getArticles', {StatusCode: 0, Message: 'failed update', Data: []}))
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
        else if(article.StatusCode === 404){
          console.log(article.Message);
          alert(article.Message);
          return false;
        }
        else{
          console.log(article.Message);
          alert('system error');
          return false;
        }
      }),
      catchError(this.handleError<Response<Article>>(`getArticle id=${id}`))
    );
  }

  public updateArticle(article: Article, id: number): Observable<Response<Article>> {
    const url = `${this.articlesUrl}/detail/${id}`;
    return this.http.put<Response<Article>>(url, article, this.httpOptions).pipe(
      tap(_ => console.log(`update article id=${article.id}`)),
      filter(article => {
        if (article.StatusCode === 200) {
          return true;
        } 
        else if(article.StatusCode === 404){
          console.log(article.Message);
          alert(article.Message);
          return false;
        }
        else{
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
        else if(article.StatusCode === 404){
          console.log(article);
          console.log(article.Message);
          alert(article.Message);
          return false;
        }
        else{
          console.log(article.Message);
          alert('system error');
          return false;
        }
      }),
      catchError(this.handleError<Response<Article>>('deleteArticle'))
    );
  }

  public addArticle(article: Article): Observable<Response<Article>> {
    return this.http.post<Response<Article>>(this.articlesUrl, article, this.httpOptions).pipe(
      tap((newArticle: Response<Article>) => console.log('success add a new article')),
      filter(article => {
        if (article.StatusCode === 200) {
          return true;
        } 
        else if(article.StatusCode === 404){
          console.log(article);
          console.log(article.Message);
          alert(article.Message);
          return false;
        }
        else{
          console.log(article.Message);
          alert('system error');
          return false;
        }
      }),
      catchError(this.handleError<Response<Article>>('addArticle'))
    );
  }

  public searchArticle(term: string): Observable<Article[]> {
    if (!term.trim()) {
      console.log('no string');
      return of([]);
    }
    return this.http.get<Article[]>(`${this.articlesUrl}/search/${term}`).pipe(
      tap(x => x.length ? console.log(`found articles matching "${term}"`) : console.log(`no articles matching "${term}"`)),
      
      catchError(this.handleError<Article[]>('searchArticle'))
    );
  }

  public getUser(name: string, password: string): Observable<Response<User>> {
    return this.http.get<Response<User>>(`${this.articlesUrl}/login`,{params:{UserName:name, Password:password}}).pipe(
      tap(_ => console.log('fetch user')),
      filter(article => {
        if (article.StatusCode === 200) {
          return true;
        } 
        else if(article.StatusCode === 404){
          console.log(article);
          console.log(article.Message);
          alert(article.Message);
          return false;
        }
        else{
          console.log(article.Message);
          alert('system error');
          return false;
        }
      }),
      catchError(this.handleError<Response<User>>(`getUser name=${name}`))
    );
  }








  // public getArticles(): Observable<Article[]> {
  //   return this.http.get<Article[]>(this.articlesUrl)
  //     .pipe(
  //       tap(_ => console.log('fetch article')),
  //       catchError(this.handleError<Article[]>('getArticles', []))
  //     );
  // }

  // public getTest(): Observable<Article[]> {
  //   return this.http.get<Article[]>(this.testUrl)
  //     .pipe(
  //       tap(_ => console.log('fetch test')),
  //       catchError(this.handleError<Article[]>('getTest', []))
  //     );
  // }

  // public getArticle(id: number): Observable<Article> {
  //   const url = `${this.articlesUrl}/${id}`;
  //   return this.http.get<Article>(url).pipe(
  //     tap(_ => console.log('fetch article')),
  //     catchError(this.handleError<Article>(`getArticle id=${id}`))
  //   );
  // }

  // public updateArticle(article: Article): Observable<any> {
  //   return this.http.put(this.articlesUrl, article, this.httpOptions).pipe(
  //     tap(_ => console.log(`update article id=${article.id}`)),
  //     catchError(this.handleError<any>('updateArticle'))
  //   );
  // }

  // public addArticle(article: Article): Observable<Article> {
  //   return this.http.post<Article>(this.articlesUrl, article, this.httpOptions).pipe(
  //     tap((newArticle: Article) => console.log(`added article w/ id=${newArticle.id}`)),
  //     catchError(this.handleError<Article>('addArticle'))
  //   );
  // }

  // public deleteArticle(id: number): Observable<Article> {
  //   const url = `${this.articlesUrl}/${id}`;
  //   return this.http.delete<Article>(url, this.httpOptions).pipe(
  //     tap(_ => console.log(`delete article id=${id}`)),
  //     catchError(this.handleError<Article>('deleteArticle'))
  //   );
  // }

  // public searchArticle(term: string): Observable<Article[]> {
  //   if (!term.trim()) {
  //     console.log('no string');
  //     return of([]);
  //   }
  //   return this.http.get<Article[]>(`${this.articlesUrl}/?title=${term}`).pipe(
  //     tap(x => x.length ? console.log(`found articles matching "${term}"`) : console.log(`no articles matching "${term}"`)),
  //     catchError(this.handleError<Article[]>('searchArticle'))
  //   );
  // }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

}
