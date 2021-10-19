import { Component, OnInit } from '@angular/core';
import { Article } from '../article';
import { ArticleService } from '../article.service';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit {
  data: [] = [];

  private _articles: Article[] = [];
  p: number = 0;

  private _test: Article[] = [];
  q: number = 0;

  n: number = 0;

  public get articles(): Article[] {
    return this._articles;
  }

  private set articles(article: Article[]){
    this._articles = article;
  }

  public get test(): Article[] {
    return this._test;
  }

  private set test(article: Article[]){
    this._test = article;
  }
  

  constructor(private articleService: ArticleService) {
    this.p = 1;
    this.q = 1;
    this.n = 1;
  }




  private getArticles(): void {
    this.articleService.getArticles()
      .subscribe(articles => { 
        this.articles = articles.Data;
        console.log(articles);
      });
  }

  // private getTest(): void {
  //   this.articleService.getTest()
  //     .subscribe(test => { 
  //       this.test = test, 
  //       console.log(test); 
  //     });
  // }


  public ngOnInit(): void {
    this.getArticles();
    // this.getTest();
    // this.getDataFromAPI();
    // this.getUser();
  }

  // getDataFromAPI() {
  //   this.articleService.getData().subscribe(
  //     data => {
  //       console.log('Response from api is ', data);},
  //     error =>{console.log('Error is ', error);}
  //   );
  // }

  // private getUser(): void {
  //   this.articleService.getUser()
  //     .subscribe(articles => { 
  //       console.log('user data',articles);
  //     });
  // }

}
