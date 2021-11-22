import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ArticleService } from '../article.service';
import { Article } from '../interface/article';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../interface/user';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-article-edit',
  templateUrl: './article-edit.component.html',
  styleUrls: ['./article-edit.component.css']
})
export class ArticleEditComponent implements OnInit {

  private _submit: boolean = false;

  public get submit(): boolean {
    return this._submit;
  }

  private set submit(submit: boolean) {
    this._submit = submit;
  }

  private _status: User = {
    Id: 0,
    UserName: '',
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
    Content: new FormControl(null, [Validators.required, Validators.minLength(20)]),
  });

  public get form(): FormGroup {
    return this._form;
  }

  private set form(form: FormGroup) {
    this._form = form;
  }

  private _article: Article = {
    Id: 0,
    Title: '',
    User_Id: 0,
    UserName: '',
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

  public get Title(): FormControl {
    return this.form.get('Title') as FormControl;
  }

  public get Content(): FormControl {
    return this.form.get('Content') as FormControl;
  }

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private location: Location,
    private router: Router,
    private snackBar: MatSnackBar,
  ) { }

  public ngOnInit(): void {
    this.getArticle();
    this.getUserStatus();
  }

  private replaceAll(string: string, search: string, replace: string) {
    return string.split(search).join(replace);
  }

  private getArticle(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.articleService.getArticle(id)
      .subscribe(article => {
        this.article = article.Data;
        this.form.setValue({ Title: this.article.Title, Author: this.article.UserName, Content: this.article.Content });
      });
  }

  public goBack(): void {
    this.location.back();
  }

  public save(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.submit = true;
    this.article.Title = this.form.get('Title')?.value.trim();
    this.article.Content = this.replaceAll(this.form.get('Content')?.value.trim(), '\'', '\'\'');
    this.articleService.updateArticle(this.article, id)
      .subscribe(() => {
        this.snackBar.open('更新文章成功', 'OK', { horizontalPosition: 'center', verticalPosition: 'bottom', duration: 3000 });
        this.location.back();
      });
  }

  private getUserStatus(): void {
    this.articleService.getUserStatus()
      .subscribe(status => {
        this.status = status;
      });
  }
}
