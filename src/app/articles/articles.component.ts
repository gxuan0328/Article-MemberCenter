import { Component, OnInit } from '@angular/core';
import { Article } from '../article';
import { ArticleService } from '../article.service';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit {
  flag: boolean =false;
  userID: number = 0;
  userName: string = 'Guset';

  // data: [] = [];

  private _articles: Article[] = [];
  p: number = 0;

  private _test: Article[] = [];

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
  }

  public ngOnInit(): void {
    this.getArticles();
    this.getUserStatus();
    console.log('user status: ',this.articleService.userStatus());
    // this.getTest();
    // this.getDataFromAPI();
    // this.getUser();
  }


  private getArticles(): void {
    this.articleService.getArticles()
      .subscribe(articles => { 
          this.articles = articles.Data;
          console.log(articles);
      });
  }

  private getUserStatus(): void {
    let status = this.articleService.userStatus();
    console.log(status);
    this.flag = status.flag;
    this.userID = status.userID;
    this.userName = status.userName;
  }

  public Logout(): void {
    if(confirm('Are you sure to logout?')){
      this.articleService.Logout();
      this.getUserStatus();
    }
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
