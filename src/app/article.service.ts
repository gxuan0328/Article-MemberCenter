import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Article } from './article';
import { Response } from './response';
import { User } from './user';
@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  private articlesUrl = 'api';
  private testUrl = 'api/test';
  private userUrl = 'api/user';
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  // getData() {
  //   return this.http.get('/api/getData');
  // }

  // getUser(): Observable<User> {
  //   return this.http.get<User>(this.userUrl)
  //     .pipe(
  //       tap(_ => console.log('fetch user')),
  //       catchError(this.handleError<User>('getUser', { name: '', password: '' }))
  //     );
  // }

  public getArticles(): Observable<Response<Article[]>> {
    return this.http.get<Response<Article[]>>(this.articlesUrl)
      .pipe(
        tap(_ => console.log('fetch article')),
        catchError(this.handleError<Response<Article[]>>('getArticles', {StatusCode: 0, Message: 'failed update', Data: []}))
      );
  }

  public getArticle(id: number): Observable<Response<Article>> {
    const url = `${this.articlesUrl}/${id}`;
    return this.http.get<Response<Article>>(url).pipe(
      tap(_ => console.log('fetch article')),
      catchError(this.handleError<Response<Article>>(`getArticle id=${id}`))
    );
  }

  public updateArticle(article: Article): Observable<Response<Article>> {
    return this.http.put<Response<Article>>(this.articlesUrl, article, this.httpOptions).pipe(
      tap(_ => console.log(`update article id=${article.id}`)),
      catchError(this.handleError<Response<Article>>('updateArticle'))
    );
  }

  public deleteArticle(id: number): Observable<Response<Article>> {
    const url = `${this.articlesUrl}/${id}`;
    return this.http.delete<Response<Article>>(url, this.httpOptions).pipe(
      tap(_ => console.log(`delete article id=${id}`)),
      catchError(this.handleError<Response<Article>>('deleteArticle'))
    );
  }

  public addArticle(article: Article): Observable<Response<Article>> {
    return this.http.post<Response<Article>>(this.articlesUrl, article, this.httpOptions).pipe(
      tap((newArticle: Response<Article>) => console.log(`added article w/ id=${newArticle.Data.id}`)),
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
