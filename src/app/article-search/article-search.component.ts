import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Article } from '../article';
import { ArticleService } from '../article.service';
@Component({
  selector: 'app-article-search',
  templateUrl: './article-search.component.html',
  styleUrls: ['./article-search.component.css']
})
export class ArticleSearchComponent implements OnInit {

  public _articles$!: Observable<Article[]>;
  private searchTerm = new Subject<string>();

  public get articles$(): Observable<Article[]> {
    return this._articles$;
  }

  private set articles$(article: Observable<Article[]>){
    this._articles$ = article;
  }

  constructor(private articleService: ArticleService) { }

  public ngOnInit(): void {
    this.articles$ = this.searchTerm.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.articleService.searchArticle(term))
    );
  }

  public search(term: string): void{
    this.searchTerm.next(term);
  }



}
