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
    private location: Location,
    private router: Router,
  ) { }

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

  public delete(): void {
    if (confirm('Are you sure to delete this record?')) {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      this.articleService.deleteArticle(id)
        .subscribe(() => this.router.navigate(['articles']));
    }


  }

  public ngOnInit(): void {
    this.getArticle();
  }

}
