import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ArticleService } from '../article.service';
import { Article } from '../article';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../user';

@Component({
  selector: 'app-article-add',
  templateUrl: './article-add.component.html',
  styleUrls: ['./article-add.component.css']
})
export class ArticleAddComponent implements OnInit {

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

  constructor(
    private articleService: ArticleService,
    private location: Location,
    private router: Router,
  ) { }

  public ngOnInit(): void {
    this.getUserStatus();
    if(this.status.UserStatus === 0){
      this.router.navigate(['login']);
    }
  }

  public goBack(): void {
    this.location.back();
  }

  public add(): void {
    let title = this.form.get('Title')?.value.trim();
    let author = this.form.get('Author')?.value.trim();
    let textbox = this.form.get('Content')?.value.trim();

    
    this.articleService.addArticle({ Title: title, User_ID: this.status.ID, Author: author, Content: textbox } as Article)
      .subscribe(article => {
        console.log(article);
        alert('Success add an article');
        this.location.back();
      });
  }

  private getUserStatus(): void {
    let status = this.articleService.getUserStatus();
    console.log(status);
    this.status = status;
    this.form.setValue({Title:null, Author:this.status.UserName, Content:null});
  }


}
