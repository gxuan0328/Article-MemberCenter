import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ArticleService } from '../article.service';
import { Article } from '../interface/article';
import { User } from '../interface/user';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css']
})
export class ArticleDetailComponent implements OnInit {

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

  private _time: string = '';

  public get time(): string {
    return this._time;
  }

  private set time(time: string) {
    this._time = time;
  }

  @Input() _article: Article = {
    Id: 0,
    Title: '',
    User_Id: 0,
    UserName: '',
    Content: '',
    CreateDatetime: '',
    UpdateDatetime: '',
  };

  public get article(): Article {
    return this._article;
  }

  private set article(article: Article) {
    this._article = article;
  }

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private location: Location,
    private router: Router,
    private snackBar: MatSnackBar,
  ) { }

  public ngOnInit(): void {
    this.getArticle();
    this.getUserStatus();
  }

  private getUserStatus(): void {
    this.articleService.getUserStatus()
      .subscribe(status => {
        this.status = status;
      });
  }

  private getArticle(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.articleService.getArticle(id)
      .subscribe(article => {
        this.article = article.Data;
        this.time = new Date(Date.parse(JSON.stringify(article.Data.CreateDatetime).substr(1, 19).replace('T', ' '))).toLocaleString();
      });
  }

  public goBack(): void {
    this.location.back();
  }

  public delete(): void {
    if (confirm('Are you sure to delete this record?')) {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      this.articleService.deleteArticle(id)
        .subscribe(() => {
          this.snackBar.open('刪除文章成功', 'OK', { horizontalPosition: 'center', verticalPosition: 'bottom', duration: 3000 });
          this.location.back();
        });
    }
  }
}
