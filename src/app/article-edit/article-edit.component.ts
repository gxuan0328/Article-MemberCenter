import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ArticleService } from '../article.service';
import { Article } from '../article';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-article-edit',
  templateUrl: './article-edit.component.html',
  styleUrls: ['./article-edit.component.css']
})
export class ArticleEditComponent implements OnInit {

  flag: boolean =false;
  userID: number = 0;
  userName: string = 'Guset';

  form:FormGroup = new FormGroup({
    Title: new FormControl(null, [Validators.required, Validators.minLength(3)]),
    Author: new FormControl({value:this.userName, disabled: true}, [Validators.required, Validators.minLength(3)] ),
    Content: new FormControl(null, [Validators.required, Validators.minLength(3)]),
  });

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
      .subscribe(article => {
        this.article = article.Data;
        this.form.setValue({Title:this.article.title, Author:this.article.author, Content:this.article.content});
      });
  }

  public goBack(): void {
    this.location.back();
  }

  public save(): void {
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
    let status = this.articleService.userStatus();
    console.log(status);
    this.flag = status.flag;
    this.userID = status.userID;
    this.userName = status.userName;
  }



}
