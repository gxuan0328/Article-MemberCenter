import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ArticleService } from '../article.service';

@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.css']
})
export class SignComponent implements OnInit {

  private _form: FormGroup = new FormGroup({
    userName: new FormControl(null, [Validators.required, Validators.minLength(3)]),
    password: new FormControl(null, [Validators.required, Validators.minLength(3)]),
  });

  public get form(): FormGroup {
    return this._form;
  }

  private set form(form: FormGroup) {
    this._form = form;
  }

  constructor(
    private articleService: ArticleService,
    private router: Router,
  ) { }

  public ngOnInit() {
  }

  public submit(): void {
    this.articleService.userSignUp(this.form.get('userName')?.value, this.form.get('password')?.value).
      subscribe((user) => {
        alert(user.Message);
        this.router.navigate(['login']);
      });
  }
}