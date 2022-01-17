import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, mapTo, switchMap, tap } from 'rxjs/operators';
import { ArticleService } from '../article.service';
import { Articles, Search } from '../interface/article';
@Component({
  selector: 'app-article-search',
  templateUrl: './article-search.component.html',
  styleUrls: ['./article-search.component.css']
})
export class ArticleSearchComponent implements OnInit {

  private _articles$!: Observable<Articles[]>;

  private searchTerm = new Subject<Search>();

  private _searchValue: string = '';

  private _searchRequest: Search = {
    Title: '',
    Author: '',
    FromDate: new Date(0).toISOString(),
    ToDate: new Date().toISOString()
  };

  public get searchRequest(): Search {
    return this._searchRequest;
  }

  public set searchRequest(searchRequest: Search) {
    this._searchRequest = searchRequest;
  }

  public get searchValue(): string {
    return this._searchValue;
  }

  public set searchValue(searchValue: string) {
    this._searchValue = searchValue;
  }

  public get articles$(): Observable<Articles[]> {
    return this._articles$;
  }

  private set articles$(article: Observable<Articles[]>) {
    this._articles$ = article;
  }

  constructor(private articleService: ArticleService) { }

  public ngOnInit(): void {
    this.articles$ = this.searchTerm.pipe(
      debounceTime(300),
      switchMap((searchRequest) => this.articleService.searchArticle(searchRequest).pipe(
        map(val => val.Data))
      ),
    );
  }

  public search(): void {
    const term: string = this.searchValue.trim();
    if (term) {
      this.searchRequest.Title = term;
      this.searchTerm.next(this.searchRequest);
    }
  }

  public reset(): void {
    setTimeout(() => {
      this.searchValue = '';
    }, 1000);
  }
}