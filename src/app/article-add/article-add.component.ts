import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ArticleService } from '../article.service';
import { Article } from '../article';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-article-add',
  templateUrl: './article-add.component.html',
  styleUrls: ['./article-add.component.css']
})
export class ArticleAddComponent implements OnInit {
  flag: boolean =false;
  userID: number = 0;
  userName: string = 'Guset';

  form:FormGroup = new FormGroup({
    Title: new FormControl(null, [Validators.required, Validators.minLength(3)]),
    Author: new FormControl({value:this.userName, disabled: true}, [Validators.required, Validators.minLength(3)] ),
    Content: new FormControl(null, [Validators.required, Validators.minLength(3)]),
  });

  constructor(
    private articleService: ArticleService,
    private location: Location,
  ) { }

  public ngOnInit(): void {
    this.getUserStatus();
  }

  public goBack(): void {
    this.location.back();
  }

  public add(): void {
    let title = this.form.get('Title')?.value.trim();
    let author = this.form.get('Author')?.value.trim();
    let textbox = this.form.get('Content')?.value.trim();
    
    this.articleService.addArticle({ title: title, author: author, content: textbox } as Article)
      .subscribe(article => {
        console.log(article);
        alert('Success add an article');
        this.location.back();
      });
  }

  private getUserStatus(): void {
    let status = this.articleService.userStatus();
    console.log(status);
    this.flag = status.flag;
    this.userID = status.userID;
    this.userName = status.userName;
    this.form.setValue({Title:null, Author:status.userName, Content:null});
  }


}
