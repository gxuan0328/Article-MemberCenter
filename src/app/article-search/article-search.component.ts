import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import { Article } from '../article';
import { ArticleService } from '../article.service';
@Component({
  selector: 'app-article-search',
  templateUrl: './article-search.component.html',
  styleUrls: ['./article-search.component.css']
})
export class ArticleSearchComponent implements OnInit {

  private _articles$!: Observable<Article[]>;
  private searchTerm = new Subject<string>();

  public get articles$(): Observable<Article[]> {
    return this._articles$;
  }

  private set articles$(article: Observable<Article[]>) {
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

  public search(term: string): void {
    if (!term.trim()) {
      console.log('no string');
    }
    else {
      this.searchTerm.next(term);
    }

  }
}
