import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  private _status: User = {
    ID: 0,
    UserName: 'Guset',
    UserStatus: 0,
    exp: 0,
    iat: 0
  };

  public get status(): User {
    return this._status;
  }

  private set status(status: User) {
    this._status = status;
  }

  private _form: FormGroup = new FormGroup({
    Title: new FormControl(null, [Validators.required, Validators.minLength(3)]),
    Author: new FormControl({ value: this.status.UserName, disabled: true }, [Validators.required, Validators.minLength(3)]),
    Content: new FormControl(null, [Validators.required, Validators.minLength(3)]),
  });

  public get form(): FormGroup {
    return this._form;
  }

  private set form(form: FormGroup) {
    this._form = form;
  }

  constructor(
    private articleService: ArticleService,
    private location: Location,
    private router: Router,
  ) { }

  public ngOnInit(): void {
    this.getUserStatus();
    if (this.status.UserStatus === 0) {
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
        alert('Success add an article');
        this.router.navigate(['articles']);
      });
  }

  private getUserStatus(): void {
    this.articleService.getUserStatus()
      .subscribe(status => {
        this.status = status;
        this.form.setValue({ Title: null, Author: this.status.UserName, Content: null });
      });

  }
}
