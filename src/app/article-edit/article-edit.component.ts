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
    if (this.status.UserStatus === 0) {
      this.router.navigate(['login']);
    }
  }

  private replaceAll(string: string, search: string, replace: string) {
    return string.split(search).join(replace);
  }

  private getArticle(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.articleService.getArticle(id)
      .subscribe(article => {
        this.article = article.Data;
        this.form.setValue({ Title: this.article.Title, Author: this.article.Author, Content: this.article.Content });
      });
  }

  public goBack(): void {
    this.location.back();
  }

  public save(): void {
    this.article.Content = this.replaceAll(this.article.Content, '\'', '\'\'');
    if (this.article) {
      this.article.Title = this.form.get('Title')?.value.trim();
      this.article.Content = this.form.get('Content')?.value.trim();
      const id = Number(this.route.snapshot.paramMap.get('id'));
      this.articleService.updateArticle(this.article, id)
        .subscribe(() => {
          alert('Success update an article');
          this.goBack();
        });
    }
  }

  private getUserStatus(): void {
    this.articleService.getUserStatus()
      .subscribe(status => {
        this.status = status;
      });
  }
}
