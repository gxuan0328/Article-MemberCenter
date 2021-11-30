import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ArticleService } from '../article.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../interface/user';
import { newArticle } from '../interface/newArticle';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-article-add',
  templateUrl: './article-add.component.html',
  styleUrls: ['./article-add.component.css']
})
export class ArticleAddComponent implements OnInit {

  private _submit: boolean = false;

  public get submit(): boolean {
    return this._submit;
  }

  private set submit(submit: boolean) {
    this._submit = submit;
  }

  private _status: User = {
    Id: 0,
    Name: '',
    Status: 0,
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
    Title: new FormControl(null, [Validators.required]),
    Author: new FormControl({ value: this.status.Name, disabled: true }, [Validators.required, Validators.minLength(3)]),
    Content: new FormControl(null, [Validators.required, Validators.minLength(20)]),
  });

  public get form(): FormGroup {
    return this._form;
  }

  private set form(form: FormGroup) {
    this._form = form;
  }

  public get Title(): FormControl {
    return this.form.get('Title') as FormControl;
  }

  public get Content(): FormControl {
    return this.form.get('Content') as FormControl;
  }

  constructor(
    private articleService: ArticleService,
    private location: Location,
    private router: Router,
    private snackBar: MatSnackBar,
  ) { }

  public ngOnInit(): void {
    this.getUserStatus();
  }

  private replaceAll(string: string, search: string, replace: string) {
    return string.split(search).join(replace);
  }

  public goBack(): void {
    this.location.back();
  }

  public add(): void {
    this.submit = true;

    const newArticle: newArticle = {
      Title: this.form.get('Title')?.value.trim(),
      User_Id: this.status.Id,
      Content: this.replaceAll(this.form.get('Content')?.value.trim(), '\'', '\'\'')
    };

    this.articleService.addArticle(newArticle)
      .subscribe(() => {
        this.snackBar.open('新增文章成功', 'OK', { horizontalPosition: 'center', verticalPosition: 'bottom', duration: 3000 });
        this.router.navigate(['articles']);
      });
  }

  private getUserStatus(): void {
    this.articleService.getUserStatus()
      .subscribe(status => {
        this.status = status;
        this.form.setValue({ Title: null, Author: this.status.Name, Content: null });
      });
  }
}
