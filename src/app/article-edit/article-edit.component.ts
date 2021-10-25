import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ArticleService } from '../article.service';
import { Article } from '../article';

@Component({
  selector: 'app-article-edit',
  templateUrl: './article-edit.component.html',
  styleUrls: ['./article-edit.component.css']
})
export class ArticleEditComponent implements OnInit {

  flag: boolean =false;
  userID: number = 0;
  userName: string = 'Guset';

  private _article: Article = {
    id: 0,
    title: '',
    author: '',
    content: ''
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
    private location: Location
  ) { }

  public ngOnInit(): void {
    this.getArticle();
    this.getUserStatus();
  }

  private getArticle(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.articleService.getArticle(id)
      .subscribe(article => this.article = article.Data);
  }

  public goBack(): void {
    this.location.back();
  }

  public save(): void {
    if (this.article) {
      this.articleService.updateArticle(this.article)
        .subscribe(() => this.goBack());
    }
  }

  private getUserStatus(): void {
    let status = this.articleService.userStatus();
    console.log(status);
    this.flag = status.flag;
    this.userID = status.userID;
    this.userName = status.userName;
  }



}
