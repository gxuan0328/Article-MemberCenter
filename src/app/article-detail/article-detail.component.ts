import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ArticleService } from '../article.service';
import { Article } from '../article';
import { User } from '../user';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css']
})
export class ArticleDetailComponent implements OnInit {

  public status: User = {
    ID: 0,
    UserName: 'Guset',
    UserStatus: 0
  };

  public time : string = '';

  // flag: boolean =false;
  // userID: number = 0;
  // userName: string = 'Guset';
  

  @Input() _article: Article = {
    ID: 0,
    Title: '',
    User_ID: 0,
    Author: '',
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
  ) { }

  public ngOnInit(): void {
    this.getArticle();
    this.getUserStatus();

  }

  private getUserStatus(): void {
    let status = this.articleService.getUserStatus();
    console.log(status);
    this.status = status;
  }

  private getArticle(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.articleService.getArticle(id)
      .subscribe(article => {
          this.article = article.Data;
          console.log('A', this.article);
          // this.time = JSON.stringify(article.Data.CreateDatetime).substr(1,19).replace('T',' ');
          // console.log(this.time);
          // let Ntime = Date.parse(this.time);
          // console.log(Ntime);
          // let Ctime = new Date(Ntime).toLocaleString();
          // console.log(Ctime);

          this.time = new Date(Date.parse(JSON.stringify(article.Data.UpdateDatetime).substr(1,19).replace('T',' '))).toLocaleString();

      });
  }

  public goBack(): void {

    this.location.back();
  }

  public delete(): void {
    if (confirm('Are you sure to delete this record?')) {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      this.articleService.deleteArticle(id)
        .subscribe(() => this.router.navigate(['articles']));
    }
  }



}
