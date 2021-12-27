import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleService } from '../article.service';
import { Articles } from '../interface/article';
import { User } from '../interface/user';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})
export class PersonalComponent implements OnInit {

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

  private _articles!: Articles[];


  public get articles(): Articles[] {
    return this._articles;
  }

  private set articles(article: Articles[]) {
    this._articles = article;
  }

  constructor(
    private articleService: ArticleService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.pageSize = 5;
    this.pageSizeOptions = [5, 10, 15, 20, 25];

  }

  public ngOnInit(): void {
    this.getUserStatus();
    this.articleService.getPersonalArticlesId()
      .subscribe((id) => {
        this.articleId = id.Data;
        this.length = id.Data.length;
        this.articleService.getArticleList(id.Data.slice(0, this.pageSize).toString())
          .subscribe((articles) => this.articles = articles.Data);
      });
  }

  private getUserStatus(): void {
    this.articleService.getUserStatus()
      .subscribe(status => {
        this.status = status;
      });
  }

  public getData(event: PageEvent): void {
    let startingIndex = event.pageIndex * event.pageSize;
    let endingIndex = startingIndex + event.pageSize;
    this.articleService.getArticleList(this.articleId.slice(startingIndex, endingIndex).toString())
      .subscribe((articles) => this.articles = articles.Data);
  }

  public delete(id: number): void {
    if (confirm('是否確認刪除此篇文章?')) {
      this.articleService.deleteArticle(id)
        .subscribe(() => {
          this.snackBar.open('刪除文章成功', 'OK', { horizontalPosition: 'center', verticalPosition: 'bottom', duration: 3000 });
          window.location.reload();
        });
    }
  }
}
