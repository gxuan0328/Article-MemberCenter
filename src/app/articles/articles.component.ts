import { noUndefined } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { ArticleService } from '../article.service';
import { Articles } from '../interface/articles';
import { Response } from '../interface/response';
import { Search } from '../interface/search';

//todo

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit {

  private _panelOpenState: boolean = false;

  public get panelOpenState(): boolean {
    return this._panelOpenState;
  }

  private set panelOpenState(panelOpenState: boolean) {
    this._panelOpenState = panelOpenState;
  }

  public togglePanel(): void {
    this.panelOpenState = !this.panelOpenState;
  }

  private _length = 0;

  public get length(): number {
    return this._length;
  }

  private set length(length: number) {
    this._length = length;
  }

  private _pageSize = 0;

  public get pageSize(): number {
    return this._pageSize;
  }

  private set pageSize(pageSize: number) {
    this._pageSize = pageSize;
  }

  private _pageSizeOptions: number[] = [];

  public get pageSizeOptions(): number[] {
    return this._pageSizeOptions;
  }

  private set pageSizeOptions(pageSizeOptions: number[]) {
    this._pageSizeOptions = pageSizeOptions;
  }

  private _articleId: number[] = [];

  public get articleId(): number[] {
    return this._articleId;
  }

  private set articleId(articleId: number[]) {
    this._articleId = articleId;
  }

  private _articles: Articles[] = [];


  public get articles(): Articles[] {
    return this._articles;
  }

  private set articles(article: Articles[]) {
    this._articles = article;
  }

  private _form: FormGroup = new FormGroup({
    Title: new FormControl(null),
    Author: new FormControl(null),
    FromDate: new FormControl(null),
    ToDate: new FormControl(null),
  });

  public get form(): FormGroup {
    return this._form;
  }

  private set form(form: FormGroup) {
    this._form = form;
  }

  constructor(private articleService: ArticleService) {
    this.pageSize = 5;
    this.pageSizeOptions = [5, 10, 15, 20, 25];

  }

  public ngOnInit(): void {
    this.articleService.getArticlesId()
      .subscribe((id) => {
        this.getData(id);
      });
  }

  public getData(id: Response<number[]>) {
    this.articleId = id.Data;
    this.length = id.Data.length;
    this.articleService.getArticleList(id.Data.slice(0, 5))
      .subscribe((articles) => this.articles = articles.Data);
  }

  public nextPage(event: PageEvent): void {
    let startingIndex = event.pageIndex * event.pageSize;
    let endingIndex = startingIndex + event.pageSize;
    this.articleService.getArticleList(this.articleId.slice(startingIndex, endingIndex))
      .subscribe((articles) => this.articles = articles.Data);
  }

  public search() {
    const searchValue: Search = {
      Title: this.form.get('Title')?.value === null ? '' : this.form.get('Title')?.value,
      Author: this.form.get('Author')?.value === null ? '' : this.form.get('Author')?.value,
      FromDate: this.form.get('FromDate')?.value === null ? '' : new Date(this.form.get('FromDate')?.value).toISOString(),
      ToDate: this.form.get('ToDate')?.value === null ? '' : new Date(this.form.get('ToDate')?.value).toISOString()
    };

    if (searchValue.Title !== '' || searchValue.Author !== '' || searchValue.FromDate !== '' || searchValue.ToDate !== '') {
      this.articleService.advanceSearch(searchValue)
        .subscribe((id) => {
          this.getData(id);
        });
    }
  }
}