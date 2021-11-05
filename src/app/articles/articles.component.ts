import { Component, OnInit } from '@angular/core';
import { Article } from '../article';
import { ArticleService } from '../article.service';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit {

  private _articles: Article[] = [];

  //設存取子套件無法運作
  public page: number = 0;

  public get articles(): Article[] {
    return this._articles;
  }

  private set articles(article: Article[]) {
    this._articles = article;
  }

  constructor(private articleService: ArticleService) {
    this.page = 1;
  }

  public ngOnInit(): void {
    this.getArticles();
  }

  private getArticles(): void {
    this.articleService.getArticles()
      .subscribe(articles => {
        this.articles = articles.Data;
      });
  }
}
