import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { ArticleService } from '../article.service';
import { Articles } from '../interface/article';
@Component({
  selector: 'app-article-search',
  templateUrl: './article-search.component.html',
  styleUrls: ['./article-search.component.css']
})
export class ArticleSearchComponent implements OnInit {

  private _articles$!: Observable<Articles[]>;
  
  private searchTerm = new Subject<string>();
  private _searchValue: string = '';

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
      distinctUntilChanged(),
      switchMap((term: string) => this.articleService.searchArticle(term).pipe(
        map(val => val.Data))
      )
    );
  }

  public search(): void {
    const term: string = this.searchValue.trim();
    if (term) {
      this.searchTerm.next(term);
    }
  }

  public reset(): void {
    setTimeout(() => {
      this.searchValue = '';
    }, 1000);
  }
}