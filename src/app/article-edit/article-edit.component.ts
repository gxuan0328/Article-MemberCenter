import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ArticleService } from '../article.service';
import { Article } from '../article';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../user';

@Component({
  selector: 'app-article-edit',
  templateUrl: './article-edit.component.html',
  styleUrls: ['./article-edit.component.css']
})
export class ArticleEditComponent implements OnInit {

  public status: User = {
    ID: 0,
    UserName: 'Guset',
    UserStatus: 0
  };



  // flag: boolean =false;
  // userID: number = 0;
  // userName: string = 'Guset';

  public form:FormGroup = new FormGroup({
    Title: new FormControl(null, [Validators.required, Validators.minLength(3)]),
    Author: new FormControl({value:this.status.UserName, disabled: true}, [Validators.required, Validators.minLength(3)] ),
    Content: new FormControl(null, [Validators.required, Validators.minLength(3)]),
  });

  private _article: Article = {
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
    if(this.status.UserStatus === 0){
      this.router.navigate(['login']);
    }
  }


  private replaceAll(string: string, search: string, replace:string) {
    return string.split(search).join(replace);
  }

  private getArticle(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.articleService.getArticle(id)
      .subscribe(article => {
        this.article = article.Data;
        this.form.setValue({Title:this.article.Title, Author:this.article.Author, Content:this.article.Content});
      });
  }

  public goBack(): void {
    this.location.back();
  }

  public save(): void {
    this.article.Content = this.replaceAll(this.article.Content,'\'','\'\'');
    if (this.article) {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      this.articleService.updateArticle(this.article,id)
        .subscribe(() => {
          alert('Success update an article');
          this.goBack();
        });
    }
  }

  private getUserStatus(): void {
    let status = this.articleService.getUserStatus();
    console.log(status);
    this.status = status;
  }



}
