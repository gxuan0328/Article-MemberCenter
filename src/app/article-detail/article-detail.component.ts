import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ArticleService } from '../article.service';
import { Article } from '../article';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css']
})
export class ArticleDetailComponent implements OnInit {

  @Input() _article: Article = {
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
    private location: Location,
  ) { }

  private getArticle(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.articleService.getArticle(id)
      .subscribe(article => this.article = article.Data);
  }

  public goBack(): void {
    this.location.back();
  }

  public ngOnInit(): void {
    this.getArticle();
  }

}
