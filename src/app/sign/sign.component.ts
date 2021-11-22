import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ArticleService } from '../article.service';
import { ConfirmPassword } from '../validators';

@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.css']
})
export class SignComponent implements OnInit {

  private _form: FormGroup = new FormGroup({
    userName: new FormControl(null, [Validators.required, Validators.minLength(3)]),
    password: new FormControl(null, [Validators.required, Validators.minLength(5)]),
    confirmPassword: new FormControl(null, [Validators.required, ConfirmPassword.check('password')]),
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
    private snackBar: MatSnackBar,
  ) { }

  public ngOnInit() {
  }

  public submit(): void {
    this.articleService.userSignUp(this.form.get('userName')?.value, this.form.get('password')?.value).
      subscribe(() => {
        this.snackBar.open('建立帳號成功', 'OK', { horizontalPosition: 'center', verticalPosition: 'bottom', duration: 3000 });
        this.router.navigate(['login']);
      });
  }
}